"use client";

import React, { useState, useEffect, useRef } from "react";
import { Session, ChatMessage, AIAssistanceResponse } from "@/models/types";
import { CONSOLES, GAMES } from "@/mocks/seed";
import { getGameCoaching, getLobbyChatter } from "@/controllers/ai";
import {
  MessageSquare,
  MicOff,
  Monitor,
  Settings,
  X,
  Send,
  Bot,
  Gamepad,
  Maximize,
  Minimize,
  Signal,
  Battery,
  Save,
  Check,
  Loader2,
  Activity,
  Wifi,
  Server,
  Cpu,
  AlertCircle,
  Globe,
  Network,
  Link as LinkIcon,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Plug,
  Bluetooth,
  Smartphone,
  Keyboard,
  ChevronDown,
  CloudUpload,
} from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useToast } from "@/controllers/toast";

interface ActiveSessionProps {
  session: Session;
  onEndSession: () => void;
}

type InputMethod = "KEYBOARD" | "VIRTUAL_TOUCH" | "PHYSICAL";

const INITIAL_RESOLUTION = "1080p";

// Simple Game Engine Types
interface PlayerEntity {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

const ActiveSession: React.FC<ActiveSessionProps> = ({
  session,
  onEndSession,
}) => {
  const consoleData = CONSOLES.find((c) => c.id === session.consoleId);
  const gameData = GAMES.find((g) => g.id === session.gameId);
  const { addToast } = useToast();

  const [chatOpen, setChatOpen] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<"chat" | "stats">("chat");
  const [aiOpen, setAiOpen] = useState(false);
  const [peersModalOpen, setPeersModalOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "sys1",
      sender: "System",
      text: `Connected to ${consoleData?.name}. Streaming at ${INITIAL_RESOLUTION} 60fps.`,
      timestamp: session.startTime,
      isSystem: true,
    },
  ]);
  const [isCRT, setIsCRT] = useState(consoleData?.type === "RETRO");
  const [aiResponse, setAiResponse] = useState<AIAssistanceResponse | null>(
    null,
  );
  const [aiLoading, setAiLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const [saveProgress, setSaveProgress] = useState(0);

  // Resolution State
  const [resolution, setResolution] = useState(INITIAL_RESOLUTION);
  const [showResMenu, setShowResMenu] = useState(false);

  // Peering State
  const [connectedPeers, setConnectedPeers] = useState<string[]>([]);
  const [connectingPeerId, setConnectingPeerId] = useState<string | null>(null);

  // New Toolbar States
  const [micActive, setMicActive] = useState(true);
  const [gamepadActive, setGamepadActive] = useState(true); // This toggles the HUD visualizer
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Input & Controller State
  const [inputMethod, setInputMethod] = useState<InputMethod>("KEYBOARD");
  const [showInputMenu, setShowInputMenu] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [physicalControllerName, setPhysicalControllerName] = useState<
    string | null
  >(null);
  const [availableDevices, setAvailableDevices] = useState<string[]>([]);

  // Input Visualization State
  const [inputState, setInputState] = useState<Record<string, boolean>>({});

  const [stats, setStats] = useState<
    { time: number; fps: number; latency: number }[]
  >([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Canvas Refs for Game Loop
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const playerRef = useRef<PlayerEntity>({
    x: 400,
    y: 300,
    vx: 0,
    vy: 0,
    color: "#0ff0fc",
  });
  const particlesRef = useRef<Particle[]>([]);

  // Mock Peers - Enhanced to show similar consoles
  const mockPeers = [
    {
      id: "p1",
      name: "RetroGlitch_01",
      ping: 34,
      region: "US-East",
      status: "Playing",
      device: consoleData?.name || "Retro Console",
    },
    {
      id: "p2",
      name: "SpeedRunnerEx",
      ping: 88,
      region: "EU-West",
      status: "Menu",
      device: consoleData?.name || "Retro Console",
    },
    {
      id: "p3",
      name: "ConsoleKing",
      ping: 22,
      region: "US-West",
      status: "Playing",
      device: "PC Rig (Cross-play)",
    },
    {
      id: "p4",
      name: "PixelMaster",
      ping: 120,
      region: "ASIA",
      status: "Idle",
      device: consoleData?.name || "Retro Console",
    },
  ];

  // Input Listener for Keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (inputMethod === "KEYBOARD") {
        setInputState((prev) => ({ ...prev, [e.code]: true }));
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (inputMethod === "KEYBOARD") {
        setInputState((prev) => ({ ...prev, [e.code]: false }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [inputMethod]);

  // Mock Stream Stats
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => {
        const now = Date.now();
        const newStat = {
          time: now,
          fps: 58 + Math.random() * 4,
          latency: 20 + Math.random() * 15,
        };
        const newArr = [...prev, newStat];
        if (newArr.length > 30) newArr.shift();
        return newArr;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- REAL PLAYABLE GAME LOOP ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initialize Canvas Size
    canvas.width = 1920;
    canvas.height = 1080;

    const update = () => {
      const player = playerRef.current;

      // Physics Consts
      const SPEED = 1.5;
      const FRICTION = 0.92;

      // Input Handling (Maps Keys/Virtual Buttons to Velocity)
      if (inputState["ArrowUp"] || inputState["KeyW"]) player.vy -= SPEED;
      if (inputState["ArrowDown"] || inputState["KeyS"]) player.vy += SPEED;
      if (inputState["ArrowLeft"] || inputState["KeyA"]) player.vx -= SPEED;
      if (inputState["ArrowRight"] || inputState["KeyD"]) player.vx += SPEED;

      // Apply Physics
      player.vx *= FRICTION;
      player.vy *= FRICTION;
      player.x += player.vx;
      player.y += player.vy;

      // Boundary Checks
      if (player.x < 0) {
        player.x = 0;
        player.vx *= -0.5;
      }
      if (player.x > canvas.width) {
        player.x = canvas.width;
        player.vx *= -0.5;
      }
      if (player.y < 0) {
        player.y = 0;
        player.vy *= -0.5;
      }
      if (player.y > canvas.height) {
        player.y = canvas.height;
        player.vy *= -0.5;
      }

      // Generate Particles if moving
      if (Math.abs(player.vx) > 0.5 || Math.abs(player.vy) > 0.5) {
        particlesRef.current.push({
          x: player.x,
          y: player.y,
          vx: (Math.random() - 0.5) * 5,
          vy: (Math.random() - 0.5) * 5,
          life: 1.0,
          color: Math.random() > 0.5 ? "#e94560" : "#0ff0fc",
        });
      }
    };

    const draw = () => {
      // Clear Screen with Fade Effect for Trails
      ctx.fillStyle = "rgba(16, 16, 24, 0.3)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Retro Grid
      ctx.strokeStyle = "rgba(15, 240, 252, 0.1)";
      ctx.lineWidth = 2;
      const gridSize = 100;
      // Offset grid by player position to simulate camera movement
      const offsetX = (playerRef.current.x * 0.5) % gridSize;
      const offsetY = (playerRef.current.y * 0.5) % gridSize;

      ctx.beginPath();
      for (let x = -offsetX; x < canvas.width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      for (let y = -offsetY; y < canvas.height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      ctx.stroke();

      // Update & Draw Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.05;

        if (p.life <= 0) {
          particlesRef.current.splice(i, 1);
        } else {
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }
      }

      // Draw Player Ship
      const p = playerRef.current;
      ctx.shadowBlur = 20;
      ctx.shadowColor = p.color;

      ctx.save();
      ctx.translate(p.x, p.y);
      // Rotate towards movement
      const angle = Math.atan2(p.vy, p.vx);
      ctx.rotate(angle + Math.PI / 2);

      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(0, -20);
      ctx.lineTo(15, 20);
      ctx.lineTo(0, 10);
      ctx.lineTo(-15, 20);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      ctx.shadowBlur = 0;
    };

    const loop = () => {
      update();
      draw();
      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(requestRef.current);
  }, [inputState]);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sidebarTab]);

  // Launch toast and simulated friend joining
  useEffect(() => {
    addToast(`Launched ${gameData?.title}`, "success");

    // Simulate friends joining
    setTimeout(async () => {
      const chatter = await getLobbyChatter(gameData?.title || "Game");
      setMessages((prev) => [
        ...prev,
        {
          id: "friend1",
          sender: "RetroFan99",
          text: chatter,
          timestamp: Date.now(),
        },
      ]);
      addToast("RetroFan99 came online", "info");
    }, 3000);
  }, [consoleData, gameData, addToast]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "You",
        text: chatInput,
        timestamp: Date.now(),
      },
    ]);
    setChatInput("");
  };

  const askAI = async () => {
    setAiLoading(true);
    setAiOpen(true);
    addToast("Analyzing current frame...", "info");
    const result = await getGameCoaching(
      gameData?.title || "Unknown Game",
      "I just started the level and I am exploring.",
    );
    setAiResponse(result);
    setAiLoading(false);
  };

  const handleSaveState = () => {
    if (saveStatus !== "idle") return;
    setSaveStatus("saving");
    setSaveProgress(0);

    // Simulate a multi-step save process for better visual feel
    const progressInterval = setInterval(() => {
      setSaveProgress((p) => Math.min(p + Math.random() * 30, 95));
    }, 300);

    // Simulate cloud save latency
    setTimeout(() => {
      clearInterval(progressInterval);
      setSaveProgress(100);
      setSaveStatus("saved");
      addToast("Game state saved to cloud slot 1", "success");

      // Add system message
      setMessages((prev) => [
        ...prev,
        {
          id: `sys_save_${Date.now()}`,
          sender: "System",
          text: `Cloud Save Complete: Slot 1. Snapshot taken.`,
          timestamp: Date.now(),
          isSystem: true,
        },
      ]);

      setTimeout(() => {
        setSaveStatus("idle");
        setSaveProgress(0);
      }, 2500);
    }, 2000);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleConnectPeer = (peerName: string, peerId: string) => {
    setConnectingPeerId(peerId);
    setTimeout(() => {
      setConnectedPeers((prev) => [...prev, peerName]);
      setConnectingPeerId(null);

      // Add system message
      setMessages((prev) => [
        ...prev,
        {
          id: `sys_peer_${Date.now()}`,
          sender: "System",
          text: `P2P Link established with ${peerName}. Shared session active.`,
          timestamp: Date.now(),
          isSystem: true,
        },
      ]);
      addToast(`Connected to ${peerName}`, "success");
    }, 1500);
  };

  const handleDisconnectPeer = (peerName: string) => {
    setConnectedPeers((prev) => prev.filter((p) => p !== peerName));
    setMessages((prev) => [
      ...prev,
      {
        id: `sys_peer_disc_${Date.now()}`,
        sender: "System",
        text: `P2P Link with ${peerName} terminated.`,
        timestamp: Date.now(),
        isSystem: true,
      },
    ]);
    addToast(`Disconnected from ${peerName}`, "warning");
  };

  const scanForControllers = () => {
    setIsScanning(true);
    setAvailableDevices([]);
    setTimeout(() => {
      setIsScanning(false);
      setAvailableDevices([
        "DualSense Wireless Controller",
        "Xbox Series X Controller",
        "8BitDo Pro 2",
      ]);
    }, 1500);
  };

  const connectController = (name: string) => {
    setPhysicalControllerName(name);
    setInputMethod("PHYSICAL");
    setAvailableDevices([]);
    addToast(`${name} Connected`, "success");
    setMessages((prev) => [
      ...prev,
      {
        id: `sys_ctrl_${Date.now()}`,
        sender: "System",
        text: `Input Source Switched: ${name}`,
        timestamp: Date.now(),
        isSystem: true,
      },
    ]);
  };

  const changeResolution = (res: string) => {
    if (res === resolution) {
      setShowResMenu(false);
      return;
    }
    setShowResMenu(false);
    setResolution(res);
    addToast(`Stream quality switched to ${res}`, "info");

    setMessages((prev) => [
      ...prev,
      {
        id: `sys_res_${Date.now()}`,
        sender: "System",
        text: `Resolution changed to ${res}. Stream optimization active.`,
        timestamp: Date.now(),
        isSystem: true,
      },
    ]);
  };

  // Virtual Controller Handlers
  const handleVirtualInput = (key: string, active: boolean) => {
    setInputState((prev) => ({ ...prev, [key]: active }));
  };

  const getAvatarColor = (name: string) => {
    if (name === "You") return "bg-gaming-accent";
    if (name === "System") return "bg-gaming-neon";
    const colors = [
      "bg-blue-600",
      "bg-green-600",
      "bg-purple-600",
      "bg-orange-600",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++)
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  if (!consoleData || !gameData) return <div>Loading Session...</div>;

  // Calculate current stats
  const currentFps =
    stats.length > 0 ? stats[stats.length - 1].fps.toFixed(1) : "60.0";
  const currentLatency =
    stats.length > 0 ? stats[stats.length - 1].latency.toFixed(0) : "24";

  return (
    <div className="h-full flex bg-black relative overflow-hidden">
      {/* Main Game Stream Area */}
      <div className="flex-1 relative flex items-center justify-center bg-black">
        {/* Stream Container */}
        <div
          className={`relative aspect-video w-full max-h-full bg-gray-900 overflow-hidden shadow-2xl border-x transition-all duration-300 ${saveStatus === "saved" ? "border-green-500 ring-4 ring-green-500/50" : "border-gaming-800 ring-0"} ${isCRT ? "sepia-[.3] contrast-125 brightness-110" : ""} ${isFullscreen ? "fixed inset-0 z-[60] w-screen h-screen" : ""}`}
        >
          {/* Playable Canvas Layer */}
          <canvas
            ref={canvasRef}
            className="w-full h-full block bg-stream-canvas"
          />

          {/* Save State Overlay Indicator */}
          {(saveStatus === "saving" || saveStatus === "saved") && (
            <div className="absolute top-24 right-8 z-50 animate-fade-in-up">
              <div
                className={`flex items-center gap-3 px-4 py-2 rounded-xl backdrop-blur-md border shadow-2xl transition-all duration-300 ${saveStatus === "saving" ? "bg-gaming-neon/20 border-gaming-neon/50 text-gaming-neon" : "bg-green-500/20 border-green-500/50 text-green-400"}`}
              >
                {saveStatus === "saving" ? (
                  <CloudUpload className="w-5 h-5 animate-bounce" />
                ) : (
                  <Check className="w-5 h-5" />
                )}
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-widest">
                    {saveStatus === "saving"
                      ? "Syncing to Cloud..."
                      : "State Protected"}
                  </span>
                  {saveStatus === "saving" && (
                    <div className="w-32 h-1 bg-white/20 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-gaming-neon transition-all duration-300"
                        style={{ width: `${saveProgress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Game UI Overlay Simulation */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center pointer-events-none">
            <h1 className="text-4xl font-bold text-white/20 drop-shadow-lg uppercase tracking-widest">
              {gameData.title}
            </h1>
            <p className="mt-2 text-gaming-neon/50 font-mono text-sm">
              PLAYABLE DEMO MODE
            </p>
          </div>

          {inputMethod === "PHYSICAL" && !physicalControllerName && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 text-red-500 bg-black/80 px-4 py-2 rounded-sm border border-red-500/50">
              <Plug className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">
                No Device Detected
              </span>
            </div>
          )}

          {/* VIRTUAL CONTROLLER OVERLAY (INTERACTIVE) */}
          {inputMethod === "VIRTUAL_TOUCH" && (
            <div className="absolute inset-0 z-20 pointer-events-none">
              <div className="w-full h-full relative pointer-events-auto">
                {/* D-Pad Area */}
                <div className="absolute bottom-12 left-12 w-48 h-48 bg-white/5 rounded-full backdrop-blur-[2px] border border-white/10 flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <button
                      aria-label="Up"
                      onMouseDown={() => handleVirtualInput("ArrowUp", true)}
                      onMouseUp={() => handleVirtualInput("ArrowUp", false)}
                      onMouseLeave={() => handleVirtualInput("ArrowUp", false)}
                      onTouchStart={() => handleVirtualInput("ArrowUp", true)}
                      onTouchEnd={() => handleVirtualInput("ArrowUp", false)}
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-12 bg-gaming-800/80 rounded-t-lg border border-white/20 active:bg-gaming-neon active:border-gaming-neon"
                    />
                    <button
                      aria-label="Down"
                      onMouseDown={() => handleVirtualInput("ArrowDown", true)}
                      onMouseUp={() => handleVirtualInput("ArrowDown", false)}
                      onMouseLeave={() =>
                        handleVirtualInput("ArrowDown", false)
                      }
                      onTouchStart={() => handleVirtualInput("ArrowDown", true)}
                      onTouchEnd={() => handleVirtualInput("ArrowDown", false)}
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-12 bg-gaming-800/80 rounded-b-lg border border-white/20 active:bg-gaming-neon active:border-gaming-neon"
                    />
                    <button
                      aria-label="Left"
                      onMouseDown={() => handleVirtualInput("ArrowLeft", true)}
                      onMouseUp={() => handleVirtualInput("ArrowLeft", false)}
                      onMouseLeave={() =>
                        handleVirtualInput("ArrowLeft", false)
                      }
                      onTouchStart={() => handleVirtualInput("ArrowLeft", true)}
                      onTouchEnd={() => handleVirtualInput("ArrowLeft", false)}
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-12 bg-gaming-800/80 rounded-l-lg border border-white/20 active:bg-gaming-neon active:border-gaming-neon"
                    />
                    <button
                      aria-label="Right"
                      onMouseDown={() => handleVirtualInput("ArrowRight", true)}
                      onMouseUp={() => handleVirtualInput("ArrowRight", false)}
                      onMouseLeave={() =>
                        handleVirtualInput("ArrowRight", false)
                      }
                      onTouchStart={() =>
                        handleVirtualInput("ArrowRight", true)
                      }
                      onTouchEnd={() => handleVirtualInput("ArrowRight", false)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 h-10 w-12 bg-gaming-800/80 rounded-r-lg border border-white/20 active:bg-gaming-neon active:border-gaming-neon"
                    />
                    {/* Center Deadzone */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-gaming-900 rounded-full"></div>
                  </div>
                </div>

                {/* Face Buttons Area */}
                <div className="absolute bottom-12 right-12 w-48 h-48 bg-white/5 rounded-full backdrop-blur-[2px] border border-white/10 flex items-center justify-center rotate-12">
                  <div className="relative w-36 h-36">
                    <button
                      onMouseDown={() => handleVirtualInput("KeyX", true)}
                      onMouseUp={() => handleVirtualInput("KeyX", false)}
                      onMouseLeave={() => handleVirtualInput("KeyX", false)}
                      onTouchStart={() => handleVirtualInput("KeyX", true)}
                      onTouchEnd={() => handleVirtualInput("KeyX", false)}
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 bg-yellow-500/20 border-2 border-yellow-500 text-yellow-500 rounded-full font-bold active:bg-yellow-500 active:text-black shadow-lg"
                    >
                      Y
                    </button>
                    <button
                      onMouseDown={() => handleVirtualInput("KeyZ", true)}
                      onMouseUp={() => handleVirtualInput("KeyZ", false)}
                      onMouseLeave={() => handleVirtualInput("KeyZ", false)}
                      onTouchStart={() => handleVirtualInput("KeyZ", true)}
                      onTouchEnd={() => handleVirtualInput("KeyZ", false)}
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-12 bg-green-500/20 border-2 border-green-500 text-green-500 rounded-full font-bold active:bg-green-500 active:text-black shadow-lg"
                    >
                      A
                    </button>
                    <button
                      onMouseDown={() => handleVirtualInput("KeyC", true)}
                      onMouseUp={() => handleVirtualInput("KeyC", false)}
                      onMouseLeave={() => handleVirtualInput("KeyC", false)}
                      onTouchStart={() => handleVirtualInput("KeyC", true)}
                      onTouchEnd={() => handleVirtualInput("KeyC", false)}
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-blue-500/20 border-2 border-blue-500 text-blue-500 rounded-full font-bold active:bg-blue-500 active:text-black shadow-lg"
                    >
                      X
                    </button>
                    <button
                      onMouseDown={() => handleVirtualInput("KeyV", true)}
                      onMouseUp={() => handleVirtualInput("KeyV", false)}
                      onMouseLeave={() => handleVirtualInput("KeyV", false)}
                      onTouchStart={() => handleVirtualInput("KeyV", true)}
                      onTouchEnd={() => handleVirtualInput("KeyV", false)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-red-500/20 border-2 border-red-500 text-red-500 rounded-full font-bold active:bg-red-500 active:text-black shadow-lg"
                    >
                      B
                    </button>
                  </div>
                </div>

                {/* Middle Buttons */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
                  <button className="w-16 h-6 rounded-full bg-gray-800 border border-gray-600 text-[10px] text-gray-400 font-bold uppercase active:bg-gaming-neon active:text-black">
                    Select
                  </button>
                  <button className="w-16 h-6 rounded-full bg-gray-800 border border-gray-600 text-[10px] text-gray-400 font-bold uppercase active:bg-gaming-neon active:text-black">
                    Start
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* INPUT VISUALIZER HUD (Passive) */}
          {gamepadActive && (
            <div className="absolute bottom-20 left-6 bg-black/40 backdrop-blur-xs p-3 rounded-xl border border-white/10 z-20 transform scale-75 origin-bottom-left pointer-events-none">
              <div className="grid grid-cols-3 gap-1 w-24 mb-2">
                <div className="col-start-2 flex justify-center">
                  <div
                    className={`w-8 h-8 border-2 rounded-sm flex items-center justify-center transition-all ${inputState["KeyW"] || inputState["ArrowUp"] ? "bg-gaming-neon border-gaming-neon text-black" : "border-white/30 text-white/30"}`}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="col-start-1 flex justify-center">
                  <div
                    className={`w-8 h-8 border-2 rounded-sm flex items-center justify-center transition-all ${inputState["KeyA"] || inputState["ArrowLeft"] ? "bg-gaming-neon border-gaming-neon text-black" : "border-white/30 text-white/30"}`}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </div>
                </div>
                <div className="col-start-2 flex justify-center">
                  <div
                    className={`w-8 h-8 border-2 rounded-sm flex items-center justify-center transition-all ${inputState["KeyS"] || inputState["ArrowDown"] ? "bg-gaming-neon border-gaming-neon text-black" : "border-white/30 text-white/30"}`}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </div>
                </div>
                <div className="col-start-3 flex justify-center">
                  <div
                    className={`w-8 h-8 border-2 rounded-sm flex items-center justify-center transition-all ${inputState["KeyD"] || inputState["ArrowRight"] ? "bg-gaming-neon border-gaming-neon text-black" : "border-white/30 text-white/30"}`}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-center mt-2 border-t border-white/10 pt-2">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all ${inputState["KeyZ"] ? "bg-green-500 border-green-500 text-black" : "border-green-500/30 text-green-500/30"}`}
                >
                  A
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all ${inputState["KeyX"] ? "bg-red-500 border-red-500 text-black" : "border-red-500/30 text-red-500/30"}`}
                >
                  B
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all ${inputState["KeyC"] ? "bg-blue-500 border-blue-500 text-black" : "border-blue-500/30 text-blue-500/30"}`}
                >
                  X
                </div>
              </div>
              <p className="text-[8px] text-center mt-1 text-gray-500 font-mono uppercase">
                Source: {inputMethod}{" "}
                {inputMethod === "PHYSICAL" &&
                  physicalControllerName &&
                  `- ${physicalControllerName}`}
              </p>
            </div>
          )}

          {/* Connected Peers Overlay */}
          {connectedPeers.length > 0 && (
            <div className="absolute bottom-20 right-6 bg-black/70 border border-gaming-neon/50 rounded-lg p-3 z-30 backdrop-blur-md shadow-lg">
              <div className="text-[10px] font-bold text-gaming-neon uppercase mb-2 flex items-center gap-2">
                <Network className="w-3 h-3" /> P2P Linked
              </div>
              <div className="flex -space-x-2">
                {connectedPeers.map((p, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-black bg-gaming-accent flex items-center justify-center text-xs text-white font-bold shadow-xs"
                    title={p}
                  >
                    {p[0]}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Retro Scanlines Overlay */}
          {isCRT && (
            <div className="absolute inset-0 scanlines z-10 pointer-events-none mix-blend-overlay opacity-50"></div>
          )}

          {/* Top Stream Info Bar */}
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent z-20 pointer-events-auto">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-red-600/90 text-white text-xs font-bold px-2 py-1 rounded-sm animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full" /> LIVE
              </div>
              <div className="text-white/80 text-sm font-mono flex gap-3">
                <span className="flex items-center gap-1">
                  <Signal className="w-3 h-3" /> {currentLatency}ms
                </span>

                {/* Interactive Resolution Selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowResMenu(!showResMenu)}
                    aria-expanded={showResMenu}
                    aria-label={`Stream Resolution ${resolution}`}
                    className="flex items-center gap-1 hover:text-white hover:bg-white/10 px-2 py-0.5 rounded-sm transition-colors border border-transparent hover:border-white/10"
                  >
                    <Monitor className="w-3 h-3" /> {resolution}{" "}
                    <ChevronDown className="w-3 h-3 opacity-70" />
                  </button>

                  {showResMenu && (
                    <div className="absolute top-full left-0 mt-1 bg-gaming-900/95 backdrop-blur-xl border border-gaming-700 rounded-lg shadow-xl overflow-hidden z-50 w-24 flex flex-col py-1">
                      {["720p", "1080p", "1440p", "4K"].map((res) => (
                        <button
                          key={res}
                          onClick={() => changeResolution(res)}
                          className={`px-3 py-2 text-[10px] text-left hover:bg-gaming-accent/20 hover:text-gaming-accent font-mono transition-colors ${resolution === res ? "text-gaming-neon font-bold bg-gaming-neon/10" : "text-gray-400"}`}
                        >
                          {res}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <span className="flex items-center gap-1">
                  <Battery className="w-3 h-3 text-green-400" /> 98%
                </span>
                {connectedPeers.length > 0 && (
                  <span className="flex items-center gap-1 text-purple-400 border-l border-white/20 pl-3 ml-1">
                    <Network className="w-3 h-3" /> P2P Active
                  </span>
                )}
                {physicalControllerName && (
                  <span className="flex items-center gap-1 text-gaming-neon border-l border-white/20 pl-3 ml-1">
                    <Gamepad className="w-3 h-3" /> {physicalControllerName}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onEndSession}
              className="bg-red-500/20 hover:bg-red-500 text-red-200 hover:text-white px-3 py-1 rounded-sm text-xs font-bold transition-colors border border-red-500/50"
            >
              END SESSION
            </button>
          </div>

          {/* AI Coach Overlay */}
          {aiOpen && (
            <div className="absolute top-20 left-4 w-80 bg-black/80 backdrop-blur-xl border border-gaming-neon/50 rounded-xl p-4 z-30 shadow-[0_0_30px_rgba(15,240,252,0.1)]">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2 text-gaming-neon">
                  <Bot className="w-5 h-5" />
                  <span className="font-bold">AI Coach</span>
                </div>
                <button
                  onClick={() => setAiOpen(false)}
                  aria-label="Close AI Coach"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {aiLoading ? (
                <div className="h-20 flex items-center justify-center text-gaming-neon animate-pulse">
                  Analyzing gameplay...
                </div>
              ) : aiResponse ? (
                <div className="space-y-3">
                  <div className="bg-gaming-neon/10 p-3 rounded-sm border-l-2 border-gaming-neon">
                    <p className="text-sm text-white font-medium">
                      💡 Tip: {aiResponse.tip}
                    </p>
                  </div>
                  <div className="text-xs text-gray-300">
                    <span className="text-gaming-accent font-bold">
                      STRATEGY:
                    </span>{" "}
                    {aiResponse.strategy}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {aiResponse.relevantStats.map((stat, i) => (
                      <div key={i} className="bg-gaming-800 p-2 rounded-sm">
                        <p className="text-[10px] text-gray-500 uppercase">
                          {stat.label}
                        </p>
                        <p className="text-sm font-mono text-white">
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* Controller Connection Modal */}
          {showInputMenu && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-gaming-900/95 backdrop-blur-xl border border-gaming-neon rounded-2xl p-6 z-50 shadow-[0_0_50px_rgba(15,240,252,0.2)] animate-fade-in-up">
              <div className="flex justify-between items-center mb-6 border-b border-gaming-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Plug className="w-5 h-5 text-gaming-neon" /> Input Source
                  </h3>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                    Select or pair a controller
                  </p>
                </div>
                <button
                  onClick={() => setShowInputMenu(false)}
                  aria-label="Close Input Source"
                >
                  <X className="w-5 h-5 text-gray-500 hover:text-white" />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <button
                  onClick={() => {
                    setInputMethod("KEYBOARD");
                    setShowInputMenu(false);
                    addToast("Switched to Keyboard & Mouse", "info");
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${inputMethod === "KEYBOARD" ? "bg-gaming-accent/20 border-gaming-accent text-white" : "bg-gaming-800 border-gaming-700 text-gray-400 hover:border-gray-500"}`}
                >
                  <div className="flex items-center gap-3">
                    <Keyboard className="w-6 h-6" />
                    <div className="text-left">
                      <p className="font-bold text-sm">Keyboard & Mouse</p>
                      <p className="text-[10px] opacity-70">Desktop Standard</p>
                    </div>
                  </div>
                  {inputMethod === "KEYBOARD" && (
                    <div className="w-2 h-2 bg-gaming-accent rounded-full shadow-[0_0_5px_rgba(233,69,96,1)]" />
                  )}
                </button>

                <button
                  onClick={() => {
                    setInputMethod("VIRTUAL_TOUCH");
                    setShowInputMenu(false);
                    addToast("Virtual Touch Controller Active", "info");
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${inputMethod === "VIRTUAL_TOUCH" ? "bg-gaming-neon/20 border-gaming-neon text-white" : "bg-gaming-800 border-gaming-700 text-gray-400 hover:border-gray-500"}`}
                >
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-6 h-6" />
                    <div className="text-left">
                      <p className="font-bold text-sm">Virtual Controller</p>
                      <p className="text-[10px] opacity-70">Touch Overlay</p>
                    </div>
                  </div>
                  {inputMethod === "VIRTUAL_TOUCH" && (
                    <div className="w-2 h-2 bg-gaming-neon rounded-full shadow-[0_0_5px_rgba(15,240,252,1)]" />
                  )}
                </button>

                <button
                  disabled={
                    inputMethod === "PHYSICAL" && !!physicalControllerName
                  }
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${inputMethod === "PHYSICAL" ? "bg-green-500/20 border-green-500 text-white" : "bg-gaming-800 border-gaming-700 text-gray-400 hover:border-gray-500"}`}
                >
                  <div className="flex items-center gap-3">
                    <Gamepad className="w-6 h-6" />
                    <div className="text-left">
                      <p className="font-bold text-sm">
                        {physicalControllerName || "Wireless Controller"}
                      </p>
                      <p className="text-[10px] opacity-70">
                        {physicalControllerName
                          ? "Connected"
                          : "No Device Paired"}
                      </p>
                    </div>
                  </div>
                  {inputMethod === "PHYSICAL" && (
                    <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_5px_rgba(34,197,94,1)]" />
                  )}
                </button>
              </div>

              {/* Pairing Section */}
              <div className="bg-black/20 rounded-xl p-4 border border-gaming-700">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-gray-400 uppercase">
                    New Connection
                  </span>
                  {isScanning && (
                    <Loader2 className="w-3 h-3 text-gaming-neon animate-spin" />
                  )}
                </div>

                <button
                  onClick={scanForControllers}
                  disabled={isScanning}
                  className="w-full py-2 bg-gaming-700 hover:bg-gaming-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 mb-3"
                >
                  <Bluetooth className="w-4 h-4" />
                  {isScanning ? "Scanning..." : "Scan for Bluetooth Devices"}
                </button>

                {availableDevices.length > 0 && (
                  <div className="space-y-2 animate-fade-in-up">
                    {availableDevices.map((device, idx) => (
                      <button
                        key={idx}
                        onClick={() => connectController(device)}
                        className="w-full flex items-center justify-between p-2 bg-gaming-800 hover:bg-gaming-neon/20 rounded-sm border border-gaming-700 hover:border-gaming-neon transition-all text-left group"
                      >
                        <span className="text-xs font-bold text-gray-300 group-hover:text-white">
                          {device}
                        </span>
                        <div className="text-[9px] bg-gaming-neon/10 text-gaming-neon px-1.5 rounded-sm border border-gaming-neon/30">
                          Pair
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Peers Modal */}
          {peersModalOpen && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-gaming-900/95 backdrop-blur-xl border border-gaming-neon rounded-2xl p-6 z-50 shadow-[0_0_50px_rgba(15,240,252,0.2)]">
              <div className="flex justify-between items-center mb-6 border-b border-gaming-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-gaming-neon" /> Peer Network
                  </h3>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                    Scanning for similar consoles...
                  </p>
                </div>
                <button
                  onClick={() => setPeersModalOpen(false)}
                  aria-label="Close Peer Network"
                >
                  <X className="w-5 h-5 text-gray-500 hover:text-white" />
                </button>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar mb-4">
                {mockPeers.map((peer) => {
                  const isConnected = connectedPeers.includes(peer.name);
                  const isConnecting = connectingPeerId === peer.id;
                  return (
                    <div
                      key={peer.id}
                      className={`p-3 rounded-xl border flex items-center justify-between transition-all ${isConnected ? "bg-green-500/10 border-green-500/30" : "bg-gaming-800 border-gaming-700 hover:border-gray-500"}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gaming-700 flex items-center justify-center font-bold text-xs text-white">
                          {peer.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">
                            {peer.name}
                          </p>
                          <div className="flex items-center gap-3 text-[10px] text-gray-400 font-mono">
                            <span
                              className={`flex items-center gap-1 ${peer.ping < 50 ? "text-green-400" : "text-yellow-400"}`}
                            >
                              <Signal className="w-2 h-2" /> {peer.ping}ms
                            </span>
                            <span className="flex items-center gap-1">
                              <Gamepad className="w-2 h-2 text-gaming-accent" />{" "}
                              {peer.device}
                            </span>
                          </div>
                        </div>
                      </div>

                      {isConnected ? (
                        <button
                          onClick={() => handleDisconnectPeer(peer.name)}
                          className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg text-[10px] font-bold uppercase hover:bg-red-500 hover:text-white transition-colors"
                        >
                          Unlink
                        </button>
                      ) : (
                        <button
                          onClick={() => handleConnectPeer(peer.name, peer.id)}
                          disabled={isConnecting}
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1 transition-colors ${isConnecting ? "bg-gaming-neon/20 text-gaming-neon cursor-wait" : "bg-white text-gaming-900 hover:bg-gaming-neon"}`}
                        >
                          {isConnecting ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <LinkIcon className="w-3 h-3" />
                          )}
                          {isConnecting ? "Linking" : "Connect"}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="text-center">
                <p className="text-[10px] text-gray-500 italic">
                  Peering allows shared inputs or screen sharing depending on
                  game mode.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Controls Toolbar */}
        <div className="absolute bottom-6 bg-gaming-900/90 backdrop-blur-sm border border-white/10 rounded-full px-6 py-3 flex items-center gap-6 shadow-2xl z-40">
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className={`p-2 rounded-full hover:bg-white/10 transition relative ${chatOpen ? "text-gaming-accent bg-white/10 shadow-[0_0_10px_rgba(233,69,96,0.5)]" : "text-white"}`}
            title="Toggle Chat"
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              setMicActive(!micActive);
              addToast(
                micActive ? "Microphone Muted" : "Microphone Active",
                "info",
              );
            }}
            className={`p-2 rounded-full hover:bg-white/10 transition flex items-center justify-center w-10 h-10 ${micActive ? "text-white" : "text-red-500 bg-red-500/10"}`}
            title={micActive ? "Mute Mic" : "Unmute Mic"}
          >
            {micActive ? (
              <div className="flex items-end gap-[2px] h-4 w-4">
                <div className="w-1 bg-gaming-neon rounded-t-sm sound-wave-bar"></div>
                <div className="w-1 bg-gaming-neon rounded-t-sm sound-wave-bar"></div>
                <div className="w-1 bg-gaming-neon rounded-t-sm sound-wave-bar"></div>
              </div>
            ) : (
              <MicOff className="w-5 h-5" />
            )}
          </button>

          <div className="h-8 w-px bg-white/20 mx-2"></div>

          <button
            onClick={askAI}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition border border-gaming-neon/50 ${aiOpen ? "bg-gaming-neon/20 shadow-[0_0_15px_rgba(15,240,252,0.3)]" : "hover:bg-gaming-neon/10"}`}
          >
            <Bot className="w-5 h-5 text-gaming-neon" />
            <span className="text-xs font-bold text-gaming-neon uppercase">
              Ask AI
            </span>
          </button>

          <div className="h-8 w-px bg-white/20 mx-2"></div>

          <button
            onClick={() => setPeersModalOpen(!peersModalOpen)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition border ${peersModalOpen || connectedPeers.length > 0 ? "bg-purple-500/20 text-purple-400 border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.3)]" : "text-gray-400 hover:bg-white/5 border-transparent hover:text-white"}`}
          >
            <Network className="w-4 h-4" />
            {connectedPeers.length > 0
              ? `${connectedPeers.length} Linked`
              : "Peers"}
          </button>

          <div className="h-8 w-px bg-white/20 mx-2"></div>

          {consoleData.type === "RETRO" && (
            <>
              <button
                onClick={handleSaveState}
                disabled={saveStatus !== "idle"}
                className={`group relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
                  saveStatus === "saved"
                    ? "bg-green-500/20 text-green-400 border-green-500/50 scale-105 shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                    : saveStatus === "saving"
                      ? "bg-gaming-accent/20 text-gaming-accent border-gaming-accent/50 cursor-wait"
                      : "text-gray-400 hover:bg-white/5 border-transparent hover:text-white"
                }`}
              >
                {saveStatus === "saving" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : saveStatus === "saved" ? (
                  <Check className="w-4 h-4 animate-bounce" />
                ) : (
                  <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                )}
                <span>
                  {saveStatus === "saved"
                    ? "Saved"
                    : saveStatus === "saving"
                      ? "Saving..."
                      : "Save State"}
                </span>

                {/* Inline mini progress bar for saving status */}
                {saveStatus === "saving" && (
                  <div
                    className="absolute bottom-0 left-0 h-0.5 bg-gaming-accent transition-all duration-300 rounded-full"
                    style={{ width: `${saveProgress}%` }}
                  />
                )}
              </button>

              <div className="h-8 w-px bg-white/20 mx-2"></div>

              <button
                onClick={() => setIsCRT(!isCRT)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition border ${isCRT ? "bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-[0_0_10px_rgba(251,191,36,0.2)]" : "text-gray-400 hover:bg-white/5 border-transparent hover:text-white"}`}
              >
                <Settings className="w-4 h-4" /> CRT Mode
              </button>
            </>
          )}

          <button
            onClick={() => setShowInputMenu(!showInputMenu)}
            className={`p-2 rounded-full hover:bg-white/10 transition ${showInputMenu || inputMethod !== "KEYBOARD" ? "text-gaming-neon bg-white/10 shadow-[0_0_10px_rgba(15,240,252,0.3)]" : "text-gray-500"}`}
            title="Controller Settings"
          >
            <Plug className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              setGamepadActive(!gamepadActive);
              addToast(
                gamepadActive ? "Overlay Hidden" : "Input Overlay Enabled",
                "info",
              );
            }}
            className={`p-2 rounded-full hover:bg-white/10 transition ${gamepadActive ? "text-gaming-neon bg-white/10" : "text-gray-500"}`}
            title="Toggle Input Overlay"
          >
            <Gamepad className="w-5 h-5" />
          </button>

          <button
            onClick={toggleFullscreen}
            className={`p-2 rounded-full hover:bg-white/10 transition ${isFullscreen ? "text-gaming-retro bg-white/10" : "text-white"}`}
            title="Fullscreen"
          >
            {isFullscreen ? (
              <Minimize className="w-5 h-5" />
            ) : (
              <Maximize className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Right Sidebar: Party & Chat */}
      <div
        className={`w-80 bg-gaming-900 border-l border-gaming-800 flex flex-col transition-all duration-300 z-50 ${chatOpen ? "translate-x-0" : "translate-x-full absolute right-0 h-full hidden"}`}
      >
        {/* Tabs */}
        <div className="flex border-b border-gaming-800">
          <button
            onClick={() => setSidebarTab("chat")}
            aria-pressed={sidebarTab === "chat"}
            className={`flex-1 py-3 text-sm font-bold tracking-wide transition-colors ${sidebarTab === "chat" ? "text-white border-b-2 border-gaming-accent bg-gaming-800/30" : "text-gray-500 hover:text-gray-300 hover:bg-gaming-800/10"}`}
          >
            Party Chat
          </button>
          <button
            onClick={() => setSidebarTab("stats")}
            aria-pressed={sidebarTab === "stats"}
            className={`flex-1 py-3 text-sm font-bold tracking-wide transition-colors ${sidebarTab === "stats" ? "text-white border-b-2 border-gaming-neon bg-gaming-800/30" : "text-gray-500 hover:text-gray-300 hover:bg-gaming-800/10"}`}
          >
            Stream Stats
          </button>
        </div>

        {/* Tab Content: Chat */}
        {sidebarTab === "chat" && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin scrollbar-thumb-gaming-700 scrollbar-track-transparent">
              {messages.map((msg) => {
                const isMe = msg.sender === "You";
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${isMe ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {/* Avatar */}
                    {!msg.isSystem && (
                      <div
                        className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white shadow-lg ${getAvatarColor(msg.sender)}`}
                      >
                        {msg.sender[0]}
                      </div>
                    )}
                    {msg.isSystem && (
                      <div className="w-full flex justify-center mb-2">
                        <div className="bg-gaming-800/80 border border-gaming-neon/30 rounded-full px-3 py-1 flex items-center gap-2">
                          <AlertCircle className="w-3 h-3 text-gaming-neon" />
                          <span className="text-[10px] font-mono text-gaming-neon uppercase tracking-wider">
                            System Alert
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`flex flex-col max-w-[80%] ${isMe ? "items-end" : "items-start"} ${msg.isSystem ? "items-center w-full" : ""}`}
                    >
                      {!msg.isSystem && (
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-[11px] font-bold text-gray-400">
                            {msg.sender}
                          </span>
                          <span className="text-[9px] text-gray-600">
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      )}

                      <div
                        className={`px-4 py-2.5 text-sm leading-relaxed shadow-md ${
                          msg.isSystem
                            ? "text-gray-300 text-center text-xs"
                            : isMe
                              ? "bg-gaming-accent text-white rounded-2xl rounded-tr-xs"
                              : "bg-gaming-700 text-gray-200 rounded-2xl rounded-tl-xs"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-gaming-800/50 border-t border-gaming-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Message party..."
                  aria-label="Message Party"
                  className="flex-1 bg-gaming-900 border border-gaming-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-hidden focus:border-gaming-accent transition-all placeholder:text-gray-600"
                />
                <button
                  onClick={handleSendMessage}
                  aria-label="Send Message"
                  className="bg-gaming-700 hover:bg-gaming-600 text-white p-2.5 rounded-xl transition shadow-lg"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}

        {/* Tab Content: Stats */}
        {sidebarTab === "stats" && (
          <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-black/20">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gaming-800/50 p-3 rounded-lg border border-gaming-700">
                <div className="flex items-center gap-2 text-xs text-gray-500 uppercase mb-1">
                  <Activity className="w-3 h-3 text-green-400" /> FPS
                </div>
                <div className="text-2xl font-mono font-bold text-white">
                  {currentFps}
                </div>
              </div>
              <div className="bg-gaming-800/50 p-3 rounded-lg border border-gaming-700">
                <div className="flex items-center gap-2 text-xs text-gray-500 uppercase mb-1">
                  <Wifi className="w-3 h-3 text-gaming-neon" /> Latency
                </div>
                <div className="text-2xl font-mono font-bold text-white">
                  {currentLatency}
                  <span className="text-sm text-gray-500">ms</span>
                </div>
              </div>
              <div className="bg-gaming-800/50 p-3 rounded-lg border border-gaming-700">
                <div className="flex items-center gap-2 text-xs text-gray-500 uppercase mb-1">
                  <Server className="w-3 h-3 text-purple-400" /> Bitrate
                </div>
                <div className="text-2xl font-mono font-bold text-white">
                  12.5<span className="text-sm text-gray-500">mbps</span>
                </div>
              </div>
              <div className="bg-gaming-800/50 p-3 rounded-lg border border-gaming-700">
                <div className="flex items-center gap-2 text-xs text-gray-500 uppercase mb-1">
                  <AlertCircle className="w-3 h-3 text-yellow-400" /> Packet
                  Loss
                </div>
                <div className="text-2xl font-mono font-bold text-white">
                  0.01<span className="text-sm text-gray-500">%</span>
                </div>
              </div>
            </div>

            <div className="bg-gaming-800/30 border border-gaming-700 rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-4 flex items-center gap-2">
                <Cpu className="w-3 h-3" /> Frame Timing (ms)
              </p>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats}>
                    <XAxis dataKey="time" hide />
                    <YAxis domain={["auto", "auto"]} hide />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1a1a2e",
                        border: "1px solid #2d3748",
                        borderRadius: "8px",
                      }}
                      itemStyle={{ color: "#0ff0fc", fontFamily: "monospace" }}
                      labelStyle={{ display: "none" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="fps"
                      stroke="#0ff0fc"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, fill: "#fff" }}
                      animationDuration={300}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-green-500/20 p-2 rounded-full">
                  <Check className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-green-400">
                    Connection Excellent
                  </h4>
                  <p className="text-xs text-green-200/70 mt-1">
                    Your connection to the nearest data center (US-East) is
                    stable. No packet loss detected in the last 5 minutes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveSession;
