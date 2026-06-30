"use client";
import { useState } from "react";
import { Send, CheckCircle, Bell } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section className="px-4 py-16 bg-dark-card border-t border-dark-border">
      <div className="max-w-4xl mx-auto text-center">
        <span className="inline-flex w-12 h-12 rounded-xl bg-yellow-muted border border-yellow-border items-center justify-center mb-5">
          <Bell size={22} className="text-yellow" />
        </span>
        <h2 className="font-heading font-bold text-white text-3xl md:text-4xl uppercase mb-3">
          Биди прв што ќе дознае
        </h2>
        <p className="text-gray-light font-body mb-8 max-w-xl mx-auto">
          Претплати се и добивај известување за нови возила и актуелни понуди пред сите други.
        </p>

        {done ? (
          <div className="flex items-center justify-center gap-2 text-yellow font-body">
            <CheckCircle size={20} /> Успешно се претплати! Ти благодариме.
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setDone(true);
            }}
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="твојот е-маил"
              className="flex-1 bg-dark border border-dark-border rounded-xl px-4 py-3.5 text-white text-sm font-body placeholder:text-gray-muted focus:outline-none focus:border-yellow-border transition-colors"
            />
            <button type="submit" className="btn-primary">
              <Send size={16} /> Претплати се
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
