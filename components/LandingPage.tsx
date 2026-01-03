
import React, { useState, useEffect, useRef } from 'react';
import { Gamepad2, Zap, Globe, Cpu, ChevronRight, Play, ShieldCheck, X, Mail, Lock, User, ArrowRight, ChevronLeft, Bot, Users, Cloud, Smartphone, ChevronDown, Calendar } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface LandingPageProps {
  onLogin: () => void;
}

const FEATURE_SLIDES = [
  {
    id: 1,
    tag: "AI ENHANCED",
    title: "Gemini AI Coaching",
    description: "Stuck on a boss? Our real-time AI analyzes your screen to provide strategy guides, hidden item locations, and tactical advice instantly without leaving the game.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=80",
    icon: Bot,
    color: "text-gaming-neon",
    bgAccent: "bg-gaming-neon"
  },
  {
    id: 2,
    tag: "MULTIPLAYER EVOLVED",
    title: "Virtual Couch Co-op",
    description: "Share your session link and pass the controller. Turn any single-player retro classic into an online multiplayer experience with friends halfway across the world.",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80",
    icon: Users,
    color: "text-yellow-400",
    bgAccent: "bg-yellow-400"
  },
  {
    id: 3,
    tag: "SEAMLESS CONTINUITY",
    title: "Universal Cloud Saves",
    description: "Start on your PC, resume on your phone. Your precise save states and memory cards sync automatically across all devices in real-time.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80",
    icon: Cloud,
    color: "text-blue-400",
    bgAccent: "bg-blue-400"
  },
  {
    id: 4,
    tag: "ANY DEVICE",
    title: "Play Anywhere",
    description: "No console required. Stream AAA titles to your browser, tablet, or smart TV with ultra-low latency edge computing nodes.",
    image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=1600&q=80",
    icon: Smartphone,
    color: "text-purple-400",
    bgAccent: "bg-purple-400"
  }
];

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const { addToast } = useToast();
  const [scrolled, setScrolled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle scroll for navbar glass effect
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrolled(container.scrollTop > 50);
    };
    
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-advance slider
  useEffect(() => {
    const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % FEATURE_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % FEATURE_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + FEATURE_SLIDES.length) % FEATURE_SLIDES.length);

  const handleScrollDown = () => {
    sliderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (authMode === 'SIGNUP') {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 16) {
        addToast("You must be 16 years or older to sign up.", "error");
        setLoading(false);
        return;
      }
    }

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setAuthModalOpen(false);
      onLogin();
      if (authMode === 'SIGNUP') {
        addToast("Welcome to V-Console Hub!", "success");
      } else {
        addToast("Successfully logged in", "success");
      }
    }, 1500);
  };

  return (
    <div ref={containerRef} className="h-screen bg-gaming-900 text-white font-sans overflow-y-auto overflow-x-hidden selection:bg-gaming-neon selection:text-gaming-900 scroll-smooth scrollbar-thin scrollbar-thumb-gaming-accent scrollbar-track-gaming-900">
      
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-gaming-accent/20 rounded-full blur-[120px] animate-pulse-fast" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-gaming-neon/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]" />
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled ? 'bg-gaming-900/80 backdrop-blur-md border-gaming-800 py-4' : 'bg-transparent border-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gaming-accent rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(233,69,96,0.5)]">
              <Gamepad2 className="text-white w-6 h-6" />
            </div>
            <span className="font-retro text-lg tracking-tighter text-white">
              V-CONSOLE <span className="text-gaming-neon">HUB</span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => { setAuthMode('LOGIN'); setAuthModalOpen(true); }}
              className="hidden md:block text-sm font-bold text-gray-300 hover:text-white transition-colors uppercase tracking-wider"
            >
              Log In
            </button>
            <button 
              onClick={() => { setAuthMode('SIGNUP'); setAuthModalOpen(true); }}
              className="bg-white text-gaming-900 px-6 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide hover:bg-gaming-neon hover:shadow-[0_0_20px_rgba(15,240,252,0.5)] transition-all transform hover:-translate-y-0.5"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-16 lg:pt-48 lg:pb-20 container mx-auto px-6 min-h-screen flex flex-col justify-center">
        <div className="flex flex-col lg:flex-row items-center gap-16 mb-12">
          <div className="lg:w-1/2 space-y-8">
            <div className="inline-flex items-center gap-2 bg-gaming-800/50 border border-gaming-700 rounded-full px-4 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gaming-neon opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gaming-neon"></span>
              </span>
              <span className="text-xs font-bold text-gaming-neon tracking-wider uppercase">Next Gen Cloud Gaming</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
              Play Anything.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gaming-accent to-purple-600">Anywhere.</span>
            </h1>

            {/* Slogan Infusion */}
            <div className="flex items-center gap-4 py-2 border-l-4 border-gaming-neon pl-4 bg-gradient-to-r from-gaming-neon/10 to-transparent rounded-r-xl">
                <Zap className="w-6 h-6 text-gaming-neon fill-gaming-neon animate-pulse" />
                <p className="text-xl md:text-2xl font-retro text-white tracking-tighter">
                    PLAY AS YOU <span className="text-gaming-accent">GO</span>
                </p>
            </div>
            
            <p className="text-lg text-gray-400 max-w-xl leading-relaxed">
              Rent high-end virtual consoles or relive the classics. No hardware required. Stream 4K gaming directly to your browser with zero latency.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => { setAuthMode('SIGNUP'); setAuthModalOpen(true); }}
                className="bg-gaming-accent text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-red-600 transition-all shadow-[0_0_30px_rgba(233,69,96,0.4)] flex items-center justify-center gap-2 group"
              >
                Start Free Trial <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-gaming-800 border border-gaming-700 text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider hover:border-gaming-neon hover:text-gaming-neon transition-all flex items-center justify-center gap-2">
                <Play className="w-4 h-4" /> Watch Demo
              </button>
            </div>

            <div className="pt-8 flex items-center gap-6 text-gray-500 text-sm font-mono">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gaming-neon" /> AES-256 ENCRYPTED
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gaming-neon" /> 12 REGIONS
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="lg:w-1/2 relative">
            <div className="relative z-10 bg-gradient-to-br from-gaming-800 to-gaming-900 border border-gaming-700 rounded-2xl p-2 shadow-2xl transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
              <div className="aspect-video bg-black rounded-xl overflow-hidden relative group">
                <img 
                  src="https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80" 
                  alt="Gameplay" 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gaming-900 via-transparent to-transparent" />
                
                {/* UI Overlay Mockup */}
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                  <div>
                    <h3 className="text-2xl font-bold text-white uppercase italic tracking-wider">Cyber Odyssey</h3>
                    <div className="flex gap-2 mt-2">
                      <span className="px-2 py-1 bg-gaming-accent text-white text-[10px] font-bold rounded uppercase">Live</span>
                      <span className="px-2 py-1 bg-gaming-neon/20 text-gaming-neon border border-gaming-neon/30 text-[10px] font-bold rounded uppercase">120 FPS</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center backdrop-blur-md">
                    <Gamepad2 className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative Elements behind visual */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gaming-neon/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-5 -left-5 w-full h-full border-2 border-gaming-700 rounded-2xl -z-10 transform rotate-[2deg]" />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div 
          onClick={handleScrollDown}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 cursor-pointer group z-20 opacity-70 hover:opacity-100 transition-opacity"
        >
          <div className="w-6 h-10 border-2 border-gray-500 rounded-full flex justify-center p-1 group-hover:border-gaming-neon transition-colors shadow-[0_0_10px_rgba(0,0,0,0.5)] bg-black/20 backdrop-blur">
            <div className="w-1 h-2 bg-gray-500 rounded-full animate-bounce group-hover:bg-gaming-neon transition-colors" />
          </div>
          <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gaming-neon transition-colors animate-pulse" />
        </div>
      </section>

      {/* Interactive Feature Slider */}
      <section ref={sliderRef} className="relative z-10 py-12 container mx-auto px-6">
        <div className="relative rounded-3xl overflow-hidden border border-gaming-700 shadow-2xl bg-gaming-900/50 backdrop-blur-sm group">
            {/* Slides */}
            <div className="relative h-[500px] md:h-[400px]">
                {FEATURE_SLIDES.map((slide, index) => (
                    <div 
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out flex flex-col md:flex-row ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                    >
                        {/* Image Side */}
                        <div className="md:w-3/5 h-64 md:h-full relative overflow-hidden">
                            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gaming-900/90 md:bg-gradient-to-r md:from-transparent md:via-gaming-900/20 md:to-gaming-900"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-gaming-900 via-transparent to-transparent md:hidden"></div>
                        </div>

                        {/* Content Side */}
                        <div className="md:w-2/5 h-full p-8 md:p-12 flex flex-col justify-center relative bg-gaming-900/90 md:bg-transparent">
                             <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest w-fit mb-4 border border-white/10 ${slide.color} bg-white/5`}>
                                 <slide.icon className="w-3 h-3" /> {slide.tag}
                             </div>
                             <h3 className="text-3xl font-bold text-white mb-4 leading-tight">{slide.title}</h3>
                             <p className="text-gray-400 leading-relaxed mb-8">{slide.description}</p>
                             
                             <button className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-colors hover:underline underline-offset-4 ${slide.color}`}>
                                 Learn More <ArrowRight className="w-4 h-4" />
                             </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div className="absolute bottom-6 right-6 z-20 flex items-center gap-4">
                <div className="flex gap-2">
                    {FEATURE_SLIDES.map((_, i) => (
                        <button 
                            key={i}
                            onClick={() => setCurrentSlide(i)}
                            className={`w-12 h-1 rounded-full transition-all duration-300 ${i === currentSlide ? `bg-white` : 'bg-white/20 hover:bg-white/40'}`}
                        />
                    ))}
                </div>
                <div className="flex gap-2 ml-4">
                    <button onClick={prevSlide} className="p-2 rounded-full bg-black/30 hover:bg-white/10 text-white border border-white/10 backdrop-blur transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={nextSlide} className="p-2 rounded-full bg-black/30 hover:bg-white/10 text-white border border-white/10 backdrop-blur transition-colors">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-20 bg-gaming-800/30 border-y border-gaming-800 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Power Beyond Hardware</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Access a fleet of supercomputers and retro consoles instantly. Switch devices seamlessly without losing progress.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Cpu, title: 'Cloud Power', desc: 'RTX 4090 equivalent performance streamed to any device.', color: 'text-gaming-neon' },
              { icon: Globe, title: 'Zero Latency', desc: 'Edge computing nodes ensure <20ms ping globally.', color: 'text-purple-400' },
              { icon: Zap, title: 'Instant Access', desc: 'No downloads. No updates. Click and play in seconds.', color: 'text-yellow-400' }
            ].map((feature, idx) => (
              <div key={idx} className="bg-gaming-900 p-8 rounded-2xl border border-gaming-800 hover:border-gaming-neon/50 hover:shadow-[0_0_30px_rgba(15,240,252,0.1)] transition-all group">
                <div className={`w-14 h-14 bg-gaming-800 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${feature.color}`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 container mx-auto px-6 text-center">
        <div className="bg-gradient-to-r from-gaming-accent/20 to-purple-600/20 border border-gaming-accent/30 rounded-3xl p-12 md:p-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gaming-900/50 backdrop-blur-sm z-0" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-retro tracking-tighter">Ready Player One?</h2>
            <p className="text-xl text-gray-300 mb-10">Join 50,000+ gamers renting high-end rigs and hosting retro tournaments today.</p>
            <button 
              onClick={() => { setAuthMode('SIGNUP'); setAuthModalOpen(true); }}
              className="bg-white text-gaming-900 px-10 py-4 rounded-xl font-bold text-lg uppercase tracking-wider hover:bg-gaming-neon transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] transform hover:-translate-y-1"
            >
              Create Free Account
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gaming-900 border-t border-gaming-800 py-12 text-center text-gray-500 text-sm relative z-10">
        <p>© 2024 V-Console Hub. All rights reserved.</p>
      </footer>

      {/* Auth Modal */}
      {authModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gaming-900 border border-gaming-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative animate-fade-in-up">
            <button 
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {authMode === 'LOGIN' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-gray-400 text-sm">
                  {authMode === 'LOGIN' ? 'Enter your credentials to access the hub.' : 'Join the future of cloud gaming today.'}
                </p>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === 'SIGNUP' && (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase ml-1">Username</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input 
                          type="text" 
                          placeholder="PlayerOne" 
                          className="w-full bg-gaming-800 border border-gaming-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-gaming-neon focus:outline-none transition-colors"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase ml-1">Date of Birth</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input 
                          type="date" 
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          className="w-full bg-gaming-800 border border-gaming-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-gaming-neon focus:outline-none transition-colors"
                          required
                        />
                      </div>
                      <p className="text-[10px] text-gray-500 ml-1">You must be 16 or older to join.</p>
                    </div>
                  </>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com" 
                      className="w-full bg-gaming-800 border border-gaming-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-gaming-neon focus:outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full bg-gaming-800 border border-gaming-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-gaming-neon focus:outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gaming-accent hover:bg-red-600 text-white font-bold py-3.5 rounded-lg uppercase tracking-wider text-sm shadow-[0_0_20px_rgba(233,69,96,0.4)] hover:shadow-[0_0_30px_rgba(233,69,96,0.6)] transition-all mt-6 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="animate-pulse">Processing...</span>
                  ) : (
                    <>
                      {authMode === 'LOGIN' ? 'Log In' : 'Sign Up'} <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-500 text-sm">
                  {authMode === 'LOGIN' ? "Don't have an account? " : "Already have an account? "}
                  <button 
                    onClick={() => setAuthMode(authMode === 'LOGIN' ? 'SIGNUP' : 'LOGIN')}
                    className="text-gaming-neon hover:text-white font-bold transition-colors"
                  >
                    {authMode === 'LOGIN' ? 'Sign Up' : 'Log In'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
