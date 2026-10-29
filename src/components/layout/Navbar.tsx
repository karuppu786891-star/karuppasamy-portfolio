"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    LINKS.forEach((l) => {
      const el = document.getElementById(l.href.slice(1));
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <nav
        aria-label="Primary"
        className={`mx-auto flex max-w-7xl items-center justify-between px-5 md:px-8 ${
          scrolled ? "glass mx-3 rounded-2xl py-2.5 md:mx-auto" : ""
        }`}
      >
        <a href="#home" className="font-display text-lg font-bold tracking-tight">
          {name.split(" ")[0]}
          <span className="text-violet">.</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => {
            const on = active === l.href.slice(1);
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  aria-current={on ? "true" : undefined}
                  className={`rounded-full px-4 py-2 text-sm transition-colors ${
                    on ? "bg-white/10 text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {l.label}
                </a>
              </li>
            );
          })}
        </ul>

        <button
          className="grid h-10 w-10 place-items-center rounded-full glass md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {open && (
        <div className="glass mx-3 mt-2 rounded-2xl p-3 md:hidden">
          <ul>
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-muted hover:bg-white/5 hover:text-ink"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
