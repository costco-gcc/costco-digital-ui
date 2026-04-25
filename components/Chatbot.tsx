'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Trash2 } from 'lucide-react';
import { answer } from '@/lib/chatbot-knowledge';

type Msg = { role: 'user' | 'bot'; text: string; followups?: string[]; intentId?: string };

const WELCOME: Msg = {
  role: 'bot',
  text: "Hi, I'm Kirky — your Costco India GCC guide. Ask me about Costco, our Hyderabad office, careers, life at Costco, ESG, or how to get in touch.",
  followups: ['Who is the CEO?', 'What does the GCC do?', 'Where are you located?', 'How do I apply for jobs?'],
};

const STORAGE_KEY = 'kirky.messages.v1';
const MAX_INPUT = 300;
const MAX_HISTORY = 60;

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([WELCOME]);
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const lastUserText = useRef<string>('');

  // Hydrate persisted conversation on first mount (sessionStorage so it
  // survives an accidental close but not a fresh tab).
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Msg[];
        if (Array.isArray(parsed) && parsed.length) setMsgs(parsed);
      }
    } catch { /* ignore */ }
  }, []);

  // Persist
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(msgs.slice(-MAX_HISTORY)));
    } catch { /* ignore */ }
  }, [msgs]);

  // Auto-scroll on new messages or open / typing change
  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, open, thinking]);

  // Focus the input when the panel opens; trap Escape to close
  useEffect(() => {
    if (open) {
      // Defer to let the dialog mount before focusing.
      const id = window.setTimeout(() => inputRef.current?.focus(), 60);
      return () => window.clearTimeout(id);
    } else {
      // Return focus to trigger when closing for keyboard users.
      triggerRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && open) setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  // Last 2 bot intent ids — feed to matcher to avoid repeating itself.
  const recentIntents = useMemo(() => {
    const ids: string[] = [];
    for (let i = msgs.length - 1; i >= 0 && ids.length < 2; i--) {
      const m = msgs[i];
      if (m.role === 'bot' && m.intentId) ids.push(m.intentId);
    }
    return ids;
  }, [msgs]);

  function send(text: string) {
    const t = text.trim();
    if (!t || thinking) return;
    lastUserText.current = t;
    setInput('');
    setMsgs((m) => [...m, { role: 'user', text: t }]);

    const a = answer(t, { recentIntents });
    // Tiny think-delay proportional to reply length — feels alive without
    // dragging. Cap so long replies don't stall.
    const delay = Math.min(900, Math.max(280, Math.round(a.reply.length * 6)));
    setThinking(true);
    window.setTimeout(() => {
      setMsgs((m) => [...m, { role: 'bot', text: a.reply, followups: a.followups, intentId: a.intentId }]);
      setThinking(false);
    }, delay);
  }

  function clear() {
    setMsgs([WELCOME]);
    setInput('');
    lastUserText.current = '';
    try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    inputRef.current?.focus();
  }

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // ↑ recalls the last user message (handy for tweaks)
    if (e.key === 'ArrowUp' && !input && lastUserText.current) {
      e.preventDefault();
      setInput(lastUserText.current);
    }
  }

  // De-dup followups across turns: drop chips the user has already sent
  // verbatim, so the bot stops re-suggesting the same prompts after a
  // few turns.
  const lastBotIdx = (() => {
    for (let i = msgs.length - 1; i >= 0; i--) if (msgs[i].role === 'bot') return i;
    return -1;
  })();
  const sentBefore = useMemo(
    () => new Set(msgs.filter((m) => m.role === 'user').map((m) => m.text.toLowerCase())),
    [msgs]
  );

  const remaining = MAX_INPUT - input.length;

  return (
    <>
      <button
        ref={triggerRef}
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
          <m.div
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
            <header className="flex items-center justify-between px-4 py-3 border-b border-[color:var(--line)] shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-costco-red to-costco-blue grid place-items-center text-white shrink-0">
                  <Sparkles size={14} aria-hidden />
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold leading-tight flex items-center gap-1.5">
                    <span className="truncate">Kirky</span>
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded-full shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-soft" aria-hidden /> online
                    </span>
                  </div>
                  <div className="text-[11px] text-[color:var(--muted)] truncate">Costco India GCC · On-page assistant</div>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={clear} aria-label="Clear conversation" title="Clear conversation" className="p-1.5 rounded hover:bg-[color:var(--line)]">
                  <Trash2 size={14} />
                </button>
                <button onClick={() => setOpen(false)} aria-label="Close chat" className="p-1.5 rounded hover:bg-[color:var(--line)]">
                  <X size={16} />
                </button>
              </div>
            </header>

            <div
              ref={scroller}
              className="flex-1 min-h-0 overflow-y-auto px-3 py-3 space-y-2"
              role="log"
              aria-live="polite"
              aria-relevant="additions"
              aria-busy={thinking}
            >
              {msgs.map((m, i) => {
                const isLastBot = i === lastBotIdx;
                const followups = isLastBot
                  ? (m.followups || []).filter((f) => !sentBefore.has(f.toLowerCase()))
                  : [];
                return (
                  <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                    <div
                      className={
                        m.role === 'user'
                          ? 'inline-block bg-[color:var(--brand-2)] text-white rounded-2xl rounded-br-sm px-3 py-2 text-sm max-w-[85%] text-left whitespace-pre-wrap break-words'
                          : 'inline-block bg-[color:var(--card)] border border-[color:var(--line)] rounded-2xl rounded-bl-sm px-3 py-2 text-sm max-w-[85%] whitespace-pre-wrap break-words'
                      }
                    >
                      {m.text}
                    </div>
                    {m.role === 'bot' && followups.length > 0 && !thinking && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {followups.map((f) => (
                          <button
                            key={f}
                            onClick={() => send(f)}
                            className="text-xs px-2.5 py-1 rounded-full border border-[color:var(--line)] hover:bg-[color:var(--line)] focus-visible:bg-[color:var(--line)] transition-colors"
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              {thinking && (
                <div className="text-left">
                  <div className="inline-flex items-center gap-1 bg-[color:var(--card)] border border-[color:var(--line)] rounded-2xl rounded-bl-sm px-3 py-2.5">
                    <span className="sr-only">Kirky is typing</span>
                    <Dot delay="0ms" />
                    <Dot delay="160ms" />
                    <Dot delay="320ms" />
                  </div>
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="border-t border-[color:var(--line)] p-2 flex items-center gap-2 shrink-0"
            >
              <label htmlFor="kirky-input" className="sr-only">Message Kirky</label>
              <input
                id="kirky-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, MAX_INPUT))}
                onKeyDown={onInputKeyDown}
                placeholder="Ask about Costco, careers, life at Costco…"
                className="flex-1 min-w-0 px-3 py-2 rounded-full bg-transparent border border-[color:var(--line)] outline-none focus:border-[color:var(--brand-2)] text-sm"
                autoComplete="off"
                enterKeyHint="send"
                inputMode="text"
                maxLength={MAX_INPUT}
                aria-describedby={remaining < 40 ? 'kirky-count' : undefined}
              />
              {remaining < 40 && (
                <span id="kirky-count" className="text-[10px] text-[color:var(--muted)] tabular-nums" aria-live="polite">
                  {remaining}
                </span>
              )}
              <button
                type="submit"
                aria-label="Send message"
                disabled={!input.trim() || thinking}
                className="p-2.5 rounded-full bg-[color:var(--brand-1)] text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <Send size={14} aria-hidden />
              </button>
            </form>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      aria-hidden
      className="inline-block w-1.5 h-1.5 rounded-full bg-[color:var(--muted)] animate-pulse-soft"
      style={{ animationDelay: delay }}
    />
  );
}
