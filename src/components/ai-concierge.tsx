"use client";

import { useState } from "react";
import { Bot, Check, MessageSquare, Send, ShoppingBag, Sparkles, X } from "lucide-react";
import { useApp } from "@/components/app-provider";
import { Price, Stars } from "@/components/ui";
import { money, type Product } from "@/lib/shop";

type ChatMessage = {
  id: string;
  sender: "bot" | "user";
  text: string;
  recommendations?: Product[];
};

const SUGGESTED_PROMPTS = [
  "Housewarming gift under $100",
  "Focus essentials for desk setup",
  "Relaxing wellness items for calm evenings",
  "Luxury travel gear under $200",
];

export function AiConcierge() {
  const { ui, setUi, products, addToCart, playSound } = useApp();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Welcome to Meridian Living. I am Aura, your personal AI luxury concierge. How may I assist your space or gift search today?",
    },
  ]);

  if (!ui.aiOpen) {
    return (
      <button
        type="button"
        onClick={() => {
          playSound("chime");
          setUi({ aiOpen: true });
        }}
        className="group fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full border border-gold/40 bg-night-2/90 px-4 py-3 text-xs font-bold tracking-wider text-gold-2 shadow-2xl shadow-gold/20 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-gold hover:bg-gold/20"
      >
        <span className="grid size-7 place-items-center rounded-full bg-gold/20 text-gold-2 group-hover:scale-110">
          <Sparkles size={14} />
        </span>
        <span className="hidden sm:inline">Nova AI Concierge</span>
      </button>
    );
  }

  const handleSend = (userText: string) => {
    const text = userText.trim();
    if (!text) return;
    playSound("click");

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate AI Concierge recommendations algorithm
    setTimeout(() => {
      const q = text.toLowerCase();
      let matched = (products || []).filter((p) => {
        if (q.includes("gift") && p.moods.includes("Giftable")) return true;
        if (q.includes("desk") || q.includes("focus")) return p.category === "Desk Setup" || p.moods.includes("Focus");
        if (q.includes("wellness") || q.includes("relax") || q.includes("calm")) return p.category === "Wellness" || p.moods.includes("Calm");
        if (q.includes("travel")) return p.category === "Travel Essentials";
        if (q.includes("decor") || q.includes("home")) return p.category === "Home Decor";
        if (q.includes("smart")) return p.category === "Smart Home";
        return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      });

      if (matched.length === 0) matched = (products || []).slice(0, 3);
      else matched = matched.slice(0, 3);

      const botReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: `I've auditioned our collection for "${text}". Here are the most refined pieces tailored for your request:`,
        recommendations: matched,
      };

      setMessages((prev) => [...prev, botReply]);
      playSound("chime");
    }, 600);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-night-2/95 border-l border-white/10 shadow-2xl backdrop-blur-xl pop-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-full bg-gold/15 text-gold-2 border border-gold/30">
            <Sparkles size={16} />
          </span>
          <div>
            <h3 className="font-display text-base font-bold text-ivory">Aura AI Concierge</h3>
            <p className="text-[0.62rem] text-teal tracking-widest uppercase font-semibold">Personal Luxury Assistant</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setUi({ aiOpen: false })}
          className="grid size-8 place-items-center rounded-full border border-white/10 text-mist hover:text-ivory"
        >
          <X size={15} />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={m.sender === "user" ? "ml-auto max-w-[85%]" : "mr-auto max-w-[90%]"}
          >
            <div
              className={
                m.sender === "user"
                  ? "rounded-2xl bg-gold/15 border border-gold/30 p-3.5 text-xs text-ivory"
                  : "rounded-2xl glass-deep p-4 text-xs text-ivory-dim leading-relaxed"
              }
            >
              <p>{m.text}</p>

              {/* Recommendations Cards inside Bot message */}
              {m.recommendations && m.recommendations.length > 0 && (
                <div className="mt-3 space-y-2.5 pt-2 border-t border-white/10">
                  {m.recommendations.map((p) => (
                    <div key={p.slug} className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-2.5 border border-white/5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt={p.name} className="size-12 rounded-lg object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[0.6rem] font-bold text-teal uppercase">{p.brand || p.category}</p>
                        <h5 className="truncate text-xs font-semibold text-ivory">{p.name}</h5>
                        <Price cents={p.price} className="text-xs mt-0.5" />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          addToCart(p.slug);
                          playSound("cart");
                        }}
                        className="rounded-full bg-gold/15 border border-gold/30 p-2 text-gold-2 hover:bg-gold hover:text-night transition-colors"
                      >
                        <ShoppingBag size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Prompts */}
      <div className="px-6 py-2 border-t border-white/5 flex gap-2 overflow-x-auto">
        {SUGGESTED_PROMPTS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => handleSend(p)}
            className="shrink-0 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[0.62rem] text-mist hover:border-gold/40 hover:text-gold-2"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="p-4 border-t border-white/10 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Aura for curated recommendations..."
          className="flex-1 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs text-ivory outline-none focus:border-gold/60"
        />
        <button
          type="submit"
          className="btn-gold grid size-10 place-items-center rounded-full"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
