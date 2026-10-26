"use client";

import React, { useState } from "react";
import { Transaction } from "@/models/types";
import {
  Wallet,
  Bitcoin,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  QrCode,
  Copy,
  Check,
  Loader2,
  History,
} from "lucide-react";
import { useToast } from "@/controllers/toast";
import { useAppState } from "@/controllers/app-state";

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "tx_1",
    type: "PURCHASE",
    amount: -2.5,
    method: "STORE_CREDIT",
    date: "2023-10-25",
    status: "COMPLETED",
    description: "PS5 Rental (1h)",
  },
  {
    id: "tx_2",
    type: "DEPOSIT",
    amount: 50.0,
    method: "CRYPTO",
    date: "2023-10-24",
    status: "COMPLETED",
    description: "BTC Deposit",
  },
  {
    id: "tx_3",
    type: "PRIZE",
    amount: 25.0,
    method: "STORE_CREDIT",
    date: "2023-10-22",
    status: "COMPLETED",
    description: "Tournament 2nd Place",
  },
  {
    id: "tx_4",
    type: "PURCHASE",
    amount: -5.0,
    method: "STORE_CREDIT",
    date: "2023-10-20",
    status: "COMPLETED",
    description: "Retro Bundle",
  },
];

const CRYPTO_OPTIONS = [
  {
    id: "BTC",
    name: "Bitcoin",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
  },
  {
    id: "ETH",
    name: "Ethereum",
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
  },
  {
    id: "SOL",
    name: "Solana",
    address: "HN7cABqLq46Es1jh92d90de7whD65bH9c82s09c",
    color: "text-teal-400",
    bg: "bg-teal-400/10",
    border: "border-teal-400/30",
  },
];

const WalletView: React.FC = () => {
  const { walletBalance: balance, addFunds: onAddFunds } = useAppState();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<"CRYPTO" | "FIAT">("CRYPTO");
  const [selectedCrypto, setSelectedCrypto] = useState(CRYPTO_OPTIONS[0]);
  const [amount, setAmount] = useState<string>("");
  const [processing, setProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [transactions, setTransactions] =
    useState<Transaction[]>(INITIAL_TRANSACTIONS);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedCrypto.address);
    setCopied(true);
    addToast("Address copied to clipboard", "info");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeposit = () => {
    if (!amount) return;
    setProcessing(true);

    // Simulate network delay
    setTimeout(() => {
      const value = parseFloat(amount);
      onAddFunds(value);

      const newTx: Transaction = {
        id: `tx_${Date.now()}`,
        type: "DEPOSIT",
        amount: value,
        method: activeTab === "CRYPTO" ? "CRYPTO" : "CREDIT_CARD",
        date: new Date().toISOString().split("T")[0],
        status: "COMPLETED",
        description:
          activeTab === "CRYPTO"
            ? `${selectedCrypto.id} Deposit`
            : "Credit Card Top-up",
      };

      setTransactions([newTx, ...transactions]);
      setProcessing(false);
      setAmount("");
      addToast(`Successfully deposited $${value.toFixed(2)}`, "success");
    }, 2000);
  };

  return (
    <div className="p-6 md:p-10 h-full overflow-y-auto bg-gaming-900 scrollbar-thin scrollbar-thumb-gaming-neon/20 scrollbar-track-gaming-900">
      <header className="mb-10 border-b border-gaming-700 pb-6">
        <h1 className="text-3xl md:text-4xl font-retro text-white mb-2 tracking-tight drop-shadow-[0_2px_0_var(--black)]">
          Virtual <span className="text-gaming-neon">Wallet</span>
        </h1>
        <p className="text-gray-400 font-mono text-sm flex items-center gap-2">
          <Wallet className="w-4 h-4 text-gaming-accent" />
          SECURE_LEDGER_V2.1
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Balance & Top Up */}
        <div className="lg:col-span-2 space-y-6">
          {/* Balance Card */}
          <div className="bg-gaming-800 rounded-2xl p-8 border border-gaming-neon/20 shadow-[0_0_30px_color-mix(in_oklab,var(--gaming-neon)_5%,transparent)] relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-gaming-neon/5 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">
                Total Balance
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl md:text-7xl font-mono font-bold text-white drop-shadow-[0_0_10px_color-mix(in_oklab,var(--white)_30%,transparent)]">
                  ${balance.toFixed(2)}
                </span>
                <span className="text-gaming-neon font-bold">USD</span>
              </div>
              <div className="flex gap-4 mt-6">
                <div className="flex items-center gap-2 text-green-400 text-sm bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20">
                  <ArrowUpRight className="w-4 h-4" /> +12.5% this week
                </div>
              </div>
            </div>
          </div>

          {/* Funding Section */}
          <div className="bg-gaming-800 rounded-2xl overflow-hidden border border-gaming-700">
            <div className="flex border-b border-gaming-700">
              <button
                onClick={() => setActiveTab("CRYPTO")}
                aria-pressed={activeTab === "CRYPTO"}
                className={`flex-1 py-4 font-bold text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${activeTab === "CRYPTO" ? "bg-gaming-700/50 text-gaming-neon border-b-2 border-gaming-neon" : "text-gray-500 hover:text-white"}`}
              >
                <Bitcoin className="w-4 h-4" /> Crypto Deposit
              </button>
              <button
                onClick={() => setActiveTab("FIAT")}
                aria-pressed={activeTab === "FIAT"}
                className={`flex-1 py-4 font-bold text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${activeTab === "FIAT" ? "bg-gaming-700/50 text-gaming-accent border-b-2 border-gaming-accent" : "text-gray-500 hover:text-white"}`}
              >
                <CreditCard className="w-4 h-4" /> Credit Card
              </button>
            </div>

            <div className="p-6 md:p-8">
              {activeTab === "CRYPTO" && (
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1 space-y-4">
                    <p
                      id="wallet-network-label"
                      className="text-xs font-bold text-gray-400 uppercase"
                    >
                      Select Network
                    </p>
                    <div
                      role="group"
                      aria-labelledby="wallet-network-label"
                      className="space-y-2"
                    >
                      {CRYPTO_OPTIONS.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setSelectedCrypto(option)}
                          aria-pressed={selectedCrypto.id === option.id}
                          className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${selectedCrypto.id === option.id ? `${option.bg} ${option.border} text-white shadow-lg` : "bg-gaming-900 border-gaming-700 text-gray-400 hover:border-gray-500"}`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${option.bg}`}
                            >
                              {option.id === "BTC" ? (
                                <Bitcoin
                                  className={`w-4 h-4 ${option.color}`}
                                />
                              ) : (
                                <div
                                  className={`w-4 h-4 rounded-full border-2 ${option.color}`}
                                ></div>
                              )}
                            </div>
                            <span className="font-bold">{option.name}</span>
                          </div>
                          {selectedCrypto.id === option.id && (
                            <Check className={`w-4 h-4 ${option.color}`} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 bg-black/20 rounded-xl p-6 border border-gaming-700 flex flex-col items-center text-center">
                    <div className="bg-white p-2 rounded-lg mb-4">
                      <QrCode className="w-32 h-32 text-black" />
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      Scan to deposit {selectedCrypto.name}
                    </p>
                    <div className="w-full bg-gaming-900 rounded-sm border border-gaming-700 p-2 flex items-center justify-between gap-2">
                      <code className="text-[10px] text-gray-300 break-all font-mono text-left">
                        {selectedCrypto.address}
                      </code>
                      <button
                        onClick={handleCopy}
                        aria-label="Copy Address"
                        className="p-1.5 hover:bg-gaming-800 rounded-sm text-gray-400 hover:text-white transition-colors"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <div className="mt-6 w-full">
                      <input
                        type="number"
                        placeholder="Enter Amount ($USD equiv)"
                        aria-label="Deposit Amount in USD"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-gaming-900 border border-gaming-700 rounded-lg px-4 py-2 text-white text-sm mb-3 focus:border-gaming-neon focus:outline-hidden"
                      />
                      <button
                        onClick={handleDeposit}
                        disabled={processing || !amount}
                        className="w-full bg-gaming-neon text-gaming-900 font-bold py-2 rounded-lg uppercase text-xs tracking-wider hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center"
                      >
                        {processing ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Confirm Deposit"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "FIAT" && (
                <div className="space-y-6">
                  <div>
                    <p
                      id="wallet-quick-amount"
                      className="text-xs font-bold text-gray-400 uppercase mb-3 block"
                    >
                      Quick Amount
                    </p>
                    <div
                      role="group"
                      aria-labelledby="wallet-quick-amount"
                      className="flex gap-3"
                    >
                      {[10, 25, 50, 100].map((val) => (
                        <button
                          key={val}
                          onClick={() => setAmount(val.toString())}
                          aria-pressed={amount === val.toString()}
                          className={`flex-1 py-3 rounded-xl border font-bold transition-all ${amount === val.toString() ? "bg-gaming-accent text-white border-gaming-accent shadow-[0_0_15px_color-mix(in_oklab,var(--gaming-accent)_40%,transparent)]" : "bg-gaming-900 border-gaming-700 text-gray-400 hover:border-white hover:text-white"}`}
                        >
                          ${val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase mb-3 block">
                      Card Details
                    </p>
                    <div className="bg-gaming-900 p-4 rounded-xl border border-gaming-700 space-y-3">
                      <input
                        type="text"
                        placeholder="Card Number"
                        aria-label="Card Number"
                        className="w-full bg-transparent border-b border-gaming-700 pb-2 text-white focus:outline-hidden focus:border-gaming-accent"
                      />
                      <div className="flex gap-4">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          aria-label="Expiry Date"
                          className="w-full bg-transparent border-b border-gaming-700 pb-2 text-white focus:outline-hidden focus:border-gaming-accent"
                        />
                        <input
                          type="text"
                          placeholder="CVC"
                          aria-label="CVC"
                          className="w-full bg-transparent border-b border-gaming-700 pb-2 text-white focus:outline-hidden focus:border-gaming-accent"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleDeposit}
                    disabled={processing || !amount}
                    className="w-full bg-gaming-accent text-white font-bold py-3 rounded-xl uppercase text-sm tracking-wider hover:bg-red-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center"
                  >
                    {processing ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      `Add Funds $${amount || "0.00"}`
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: History */}
        <div className="bg-gaming-800 rounded-2xl border border-gaming-700 flex flex-col">
          <div className="p-6 border-b border-gaming-700 flex justify-between items-center">
            <h3 className="font-bold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-gray-400" /> Transaction History
            </h3>
            <button className="text-xs text-gaming-neon hover:text-white font-bold uppercase">
              Export
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar h-[500px]">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-gaming-900/50 p-4 rounded-xl border border-gaming-700/50 flex justify-between items-center group hover:border-gaming-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border ${tx.type === "DEPOSIT" || tx.type === "PRIZE" ? "bg-green-500/10 border-green-500/30 text-green-500" : "bg-gaming-accent/10 border-gaming-accent/30 text-gaming-accent"}`}
                  >
                    {tx.type === "DEPOSIT" || tx.type === "PRIZE" ? (
                      <ArrowDownLeft className="w-5 h-5" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm group-hover:text-gaming-neon transition-colors">
                      {tx.description}
                    </p>
                    <p className="text-[10px] text-gray-500 font-mono">
                      {tx.date} • {tx.method.replace("_", " ")}
                    </p>
                  </div>
                </div>
                <div
                  className={`text-right font-mono font-bold ${tx.amount > 0 ? "text-green-400" : "text-white"}`}
                >
                  {tx.amount > 0 ? "+" : ""}
                  {tx.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletView;
