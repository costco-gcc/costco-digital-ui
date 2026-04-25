'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Trash2 } from 'lucide-react';
import { Mark } from '@/components/Logo';
import { answer } from '@/lib/chatbot-knowledge';

type Msg = { role: 'user' | 'bot'; text: string; followups?: string[] };

const WELCOME: Msg = {
  role: 'bot',
  text: "Hi, I'm Kirky — your Costco India GCC guide. Ask me about Costco, our Hyderabad office, careers, life at Costco, ESG, or how to get in touch.",
  followups: ['Who is the CEO?', 'What does the GCC do?', 'Where are you located?', 'How do I apply for jobs?'],
};

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState<Msg[]>([WELCOME]);
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new messages or open
  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, open]);

  // Focus the input when the panel opens; trap Escape to close
  useEffect(() => {
    if (open) inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  function send(text: string) {
    const t = text.trim();
    if (!t) return;
    const a = answer(t);
    setMsgs((m) => [...m, { role: 'user', text: t }, { role: 'bot', text: a.reply, followups: a.followups }]);
    setInput('');
  }

  function clear() {
    setMsgs([WELCOME]);
    setInput('');
    inputRef.current?.focus();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close Kirky chat' : 'Open Kirky chat'}
        aria-expanded={open}
        aria-controls="kirky-panel"
        className="fixed bottom-5 right-5 z-50 group"
      >
        <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-costco-red to-costco-blue text-white shadow-[0_18px_40px_-15px_rgba(0,93,170,0.6)] hover:scale-105 transition-transform">
          {open ? <X size={22} /> : <MessageCircle size={22} />}
          {!open && <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[color:var(--brand-3)] animate-pulse-soft" aria-hidden />}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="kirky-panel"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            role="dialog"
            aria-label="Kirky, Costco India GCC assistant"
            aria-modal="false"
            className="fixed bottom-24 right-4 sm:right-5 z-50 w-[min(380px,calc(100vw-2rem))] h-[min(560px,calc(100dvh-7rem))] glass rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[color:var(--line)]">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-costco-red to-costco-blue grid place-items-center text-white">
                  <Sparkles size={14} aria-hidden />
                </span>
                <div>
                  <div className="text-sm font-semibold leading-tight flex items-center gap-1.5">
                    Kirky
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-soft" aria-hidden /> online
                    </span>
                  </div>
                  <div className="text-[11px] text-[color:var(--muted)]">Costco India GCC · On-page assistant</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={clear} aria-label="Clear conversation" title="Clear conversation" className="p-1 rounded hover:bg-[color:var(--line)]">
                  <Trash2 size={14} />
                </button>
                <button onClick={() => setOpen(false)} aria-label="Close chat" className="p-1 rounded hover:bg-[color:var(--line)]">
                  <X size={16} />
                </button>
              </div>
            </div>

            <div
              ref={scroller}
              className="flex-1 overflow-y-auto px-3 py-3 space-y-2"
              role="log"
              aria-live="polite"
              aria-relevant="additions"
            >
              {msgs.map((m, i) => (
                <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                  <div
                    className={
                      m.role === 'user'
                        ? 'inline-block bg-[color:var(--brand-2)] text-white rounded-2xl rounded-br-sm px-3 py-2 text-sm max-w-[85%]'
                        : 'inline-block bg-[color:var(--card)] border border-[color:var(--line)] rounded-2xl rounded-bl-sm px-3 py-2 text-sm max-w-[85%]'
                    }
                  >
                    {m.text}
                  </div>
                  {m.role === 'bot' && m.followups && m.followups.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.followups.map((f) => (
                        <button
                          key={f}
                          onClick={() => send(f)}
                          className="text-xs px-2.5 py-1 rounded-full border border-[color:var(--line)] hover:bg-[color:var(--line)] focus-visible:bg-[color:var(--line)]"
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="border-t border-[color:var(--line)] p-2 flex items-center gap-2"
            >
              <label htmlFor="kirky-input" className="sr-only">Message Kirky</label>
              <input
                id="kirky-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Costco, careers, life at Costco…"
                className="flex-1 px-3 py-2 rounded-full bg-transparent border border-[color:var(--line)] outline-none focus:border-[color:var(--brand-2)] text-sm"
                autoComplete="off"
              />
              <button type="submit" aria-label="Send message" disabled={!input.trim()} className="p-2.5 rounded-full bg-[color:var(--brand-1)] text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed">
                <Send size={14} aria-hidden />
              </button>
            </form>
            <p className="text-[10px] text-[color:var(--muted)] px-3 pb-2 text-center">
              Kirky is a generic on-page guide. For accurate role details, visit Talent500.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
