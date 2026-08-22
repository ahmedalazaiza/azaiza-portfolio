import React, { useState, useRef } from "react";
import { motion, useInView } from "motion/react";
import { Mail, Phone, MapPin, ExternalLink, CheckCircle, Send } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function ContactSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const { error } = await supabase.from("messages").insert([
        {
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
          is_read: false,
        },
      ]);

      if (error) {
        throw error;
      }

      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const inputClass =
    "w-full px-5 py-3.5 rounded-xl border border-border bg-input-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-sm";

  return (
    <section id="contact" ref={ref} className="py-24 lg:py-32 border-t border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary font-mono text-sm font-medium tracking-widest uppercase">
              Get In Touch
            </span>
            <h2 className="mt-4 text-4xl lg:text-5xl font-display font-extrabold text-foreground leading-tight">
              Let's build something great together.
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Whether you have a project in mind or just want to chat about design — my inbox is always open.
              I typically respond within 24 hours.
            </p>

            <div className="mt-10 space-y-4">
              {[
                { icon: Mail, label: "Email", value: "ahmedazy.uxui@gmail.com", href: "mailto:ahmedazy.uxui@gmail.com" },
                { icon: Phone, label: "Phone", value: "+90 507 638 12 62", href: "tel:+905076381262" },
                { icon: MapPin, label: "Location", value: "Istanbul, Turkey", href: null },
              ].map(({ icon: Icon, label, value, href }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:border-primary/30 transition-colors duration-200"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-mono">{label}</div>
                    {href ? (
                      <a
                        href={href}
                        className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <div className="text-sm font-semibold text-foreground">{value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-4">
              <a
                href="https://www.upwork.com/freelancers/~0164cb29425e741b93"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-6 py-3 rounded-2xl border border-border bg-card text-sm text-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all duration-200 font-semibold group shadow-sm"
              >
                <ExternalLink size={15} className="text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                <span>Upwork</span>
              </a>
            </div>
          </motion.div>

          {/* Right form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center text-center py-16 h-full bg-card border border-border rounded-3xl p-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <CheckCircle size={28} className="text-primary" />
                </div>
                <h3 className="text-2xl font-display font-bold text-foreground mb-3">Message sent!</h3>
                <p className="text-muted-foreground mb-8">Thanks for reaching out. I'll get back to you soon.</p>
                <button
                  onClick={() => setStatus("idle")}
                  className="px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono text-muted-foreground uppercase tracking-wide block mb-2">
                      Name
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Ahmed Al-Azaiza"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-muted-foreground uppercase tracking-wide block mb-2">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="you@company.com"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-mono text-muted-foreground uppercase tracking-wide block mb-2">
                    Subject
                  </label>
                  <input
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    placeholder="Project collaboration"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-muted-foreground uppercase tracking-wide block mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell me about your project..."
                    className={`${inputClass} resize-none`}
                  />
                </div>
                {status === "error" && (
                  <p className="text-sm text-destructive-foreground bg-destructive/20 rounded-lg px-4 py-2.5">
                    Something went wrong. Please try again or email directly.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-base hover:shadow-[0_0_40px_rgba(170,255,56,0.25)] disabled:opacity-60 transition-all duration-300 active:scale-[0.99]"
                >
                  {status === "loading" ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />{" "}
                      Sending...
                    </span>
                  ) : (
                    <>
                      <Send size={16} /> Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
