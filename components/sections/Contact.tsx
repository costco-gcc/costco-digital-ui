'use client';

import SectionHeader from '@/components/SectionHeader';
import { motion } from 'framer-motion';
import { Mail, MapPin, Building2, ShieldCheck, ExternalLink, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import content from '@/data/content/contact.json';

type Errors = Partial<Record<'name' | 'email' | 'message' | 'consent', string>>;

export default function Contact() {
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  function validate(form: HTMLFormElement): Errors {
    const f = new FormData(form);
    const e: Errors = {};
    const name = String(f.get('name') || '').trim();
    const email = String(f.get('email') || '').trim();
    const message = String(f.get('message') || '').trim();
    const consent = f.get('consent') === 'on';
    if (!name) e.name = content.form.errors.name;
    if (!email) e.email = content.form.errors.emailRequired;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = content.form.errors.emailInvalid;
    if (!message) e.message = content.form.errors.message;
    if (!consent) e.consent = content.form.errors.consent;
    return e;
  }

  function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const form = ev.currentTarget;
    const e = validate(form);
    setErrors(e);
    if (Object.keys(e).length) {
      const first = form.querySelector<HTMLElement>('[aria-invalid="true"]');
      first?.focus();
      return;
    }
    const f = new FormData(form);
    const name = String(f.get('name') || '').trim();
    const email = String(f.get('email') || '').trim();
    const topic = String(f.get('topic') || 'General');
    const message = String(f.get('message') || '').trim();
    const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0ATopic: ${topic}%0D%0A%0D%0A${encodeURIComponent(message)}`;
    window.location.href = `mailto:${content.email}?subject=${encodeURIComponent('[Costco India GCC] ' + topic)}&body=${body}`;
    setSent(true);
  }

  return (
    <section id="contact" className="py-20 sm:py-28 bg-[color:var(--card)]/30 border-t border-[color:var(--line)]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <SectionHeader
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.description}
          />
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3"><MapPin size={16} className="mt-0.5 text-costco-blue shrink-0" /><div><strong>{content.address.name}</strong><br />{content.address.cityLine}</div></div>
            <div className="flex items-start gap-3"><Mail size={16} className="mt-0.5 text-costco-blue shrink-0" /><div><a href={`mailto:${content.email}`} className="hover:text-costco-blue">{content.email}</a></div></div>
            <div className="flex items-start gap-3"><Building2 size={16} className="mt-0.5 text-costco-blue shrink-0" /><div>{content.company}</div></div>
            <div className="flex items-start gap-3"><ShieldCheck size={16} className="mt-0.5 text-costco-blue shrink-0" /><div>{content.whistleblowerLabel} <a href={content.whistleblowerHref} className="text-costco-blue underline">{content.whistleblowerCta}</a></div></div>
          </div>
          <div className="mt-6">
            <a href={content.talent500Href} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              {content.talent500Cta} <ExternalLink size={14} aria-hidden />
            </a>
          </div>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="lg:col-span-7 card p-6 sm:p-8 space-y-4"
          noValidate
          aria-describedby="contact-help"
        >
          <p id="contact-help" className="sr-only">{content.form.srHelp}</p>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={content.form.nameLabel} name="name" required error={errors.name} />
            <Field label={content.form.emailLabel} name="email" type="email" required error={errors.email} />
          </div>
          <Select label={content.form.topicLabel} name="topic" options={content.form.topics} />
          <TextArea label={content.form.messageLabel} name="message" required error={errors.message} />

          <div>
            <label className="flex items-start gap-2 text-xs text-[color:var(--muted)]">
              <input type="checkbox" name="consent" aria-invalid={!!errors.consent} className="mt-0.5 accent-[color:var(--brand-2)]" />
              <span>
                {content.form.consent.lead}{' '}
                <a className="underline" href={content.form.consent.linkHref}>{content.form.consent.linkText}</a>{content.form.consent.tail}
              </span>
            </label>
            {errors.consent && <FieldError msg={errors.consent} />}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-xs text-[color:var(--muted)]">{content.form.submitHelp}</p>
            <button type="submit" className="btn btn-primary self-start sm:self-auto">{content.form.submitLabel}</button>
          </div>

          {sent && Object.keys(errors).length === 0 && (
            <p className="text-sm text-emerald-600">{content.form.successMessage}</p>
          )}
        </motion.form>
      </div>
    </section>
  );
}

function Field({ label, name, type = 'text', required, error }: { label: string; name: string; type?: string; required?: boolean; error?: string }) {
  const id = `f-${name}`;
  const errId = `${id}-err`;
  return (
    <label htmlFor={id} className="block text-sm">
      <span className="text-[color:var(--ink)] font-medium">{label}{required && <span className="text-costco-red"> *</span>}</span>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errId : undefined}
        className="field mt-1"
        autoComplete={name === 'name' ? 'name' : name === 'email' ? 'email' : undefined}
      />
      {error && <FieldError id={errId} msg={error} />}
    </label>
  );
}

function TextArea({ label, name, required, error }: { label: string; name: string; required?: boolean; error?: string }) {
  const id = `f-${name}`;
  const errId = `${id}-err`;
  return (
    <label htmlFor={id} className="block text-sm">
      <span className="text-[color:var(--ink)] font-medium">{label}{required && <span className="text-costco-red"> *</span>}</span>
      <textarea
        id={id}
        name={name}
        required={required}
        rows={5}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errId : undefined}
        className="field mt-1 resize-y"
      />
      {error && <FieldError id={errId} msg={error} />}
    </label>
  );
}

function Select({ label, name, options }: { label: string; name: string; options: string[] }) {
  const id = `f-${name}`;
  return (
    <label htmlFor={id} className="block text-sm">
      <span className="text-[color:var(--ink)] font-medium">{label}</span>
      <select id={id} name={name} className="field mt-1">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}

function FieldError({ msg, id }: { msg: string; id?: string }) {
  return (
    <p id={id} role="alert" className="mt-1 text-xs text-[color:var(--brand-1)] inline-flex items-center gap-1">
      <AlertCircle size={12} aria-hidden /> {msg}
    </p>
  );
}
