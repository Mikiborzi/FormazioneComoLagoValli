"use client";

import { useState, useEffect, useCallback } from "react";

const quotes = [
  {
    text: "L'educazione è l'arma più potente che puoi usare per cambiare il mondo.",
    author: "Nelson Mandela",
    note: "Premio Nobel per la Pace",
  },
  {
    text: "La mente che si apre a una nuova idea non torna mai alle sue dimensioni originali.",
    author: "Albert Einstein",
    note: "Fisico",
  },
  {
    text: "Il successo non è definitivo, il fallimento non è fatale: è il coraggio di continuare che conta.",
    author: "Winston Churchill",
    note: "Statista",
  },
  {
    text: "Investire in conoscenza paga i migliori interessi.",
    author: "Benjamin Franklin",
    note: "Inventore e statista",
  },
  {
    text: "Non è mai troppo tardi per imparare qualcosa di nuovo. Di solito poi torna utile quando meno te lo aspetti.",
    author: "Variazione libera su Oscar Wilde",
    note: "Con qualche aggiornamento",
  },
  {
    text: "Ho scoperto che più studio, più fortunato divento. Soprattutto ai colloqui di lavoro.",
    author: "Anonimo ottimista",
    note: "In cerca di occupazione",
  },
];

export default function QuoteCarousel() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  const goTo = useCallback((index) => {
    setVisible(false);
    setTimeout(() => {
      setCurrent(index);
      setVisible(true);
    }, 350);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((prev) => {
        const next = (prev + 1) % quotes.length;
        return next;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [goTo]);

  const handleGoTo = (index) => {
    goTo(index);
  };

  return (
    <section className="overflow-hidden py-12 lg:py-20" style={{ backgroundColor: "#1a2e5a" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Decorative quotes mark */}
        <div
          className="font-display font-bold leading-none mb-4 select-none"
          style={{ fontSize: "5rem", lineHeight: 1, color: "#c8941a" }}
          aria-hidden="true"
        >
          &ldquo;
        </div>

        {/* Quote content */}
        <div
          className="transition-opacity duration-350 min-h-[12rem] flex flex-col justify-center"
          style={{ opacity: visible ? 1 : 0, transition: "opacity 0.35s ease" }}
        >
          <blockquote className="font-display italic text-white text-xl sm:text-2xl lg:text-3xl leading-relaxed mb-8 px-4">
            {quotes[current].text}
          </blockquote>
          <cite className="not-italic block">
            <span className="font-sans font-semibold text-lg" style={{ color: "#c8941a" }}>
              {quotes[current].author}
            </span>
            <span className="font-sans text-white/50 text-sm block mt-1">
              {quotes[current].note}
            </span>
          </cite>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-10" role="tablist" aria-label="Citazioni">
          {quotes.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === current}
              aria-label={`Citazione ${i + 1}`}
              onClick={() => handleGoTo(i)}
              className="h-2 rounded-full transition-all duration-300 cursor-pointer"
              style={{
                width: i === current ? "1.5rem" : "0.5rem",
                backgroundColor:
                  i === current
                    ? "#c8941a"
                    : "rgba(255,255,255,0.3)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
