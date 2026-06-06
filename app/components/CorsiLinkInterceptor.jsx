"use client";

import { useEffect, useState } from "react";
import PopupGOLSospensione from "./PopupGOLSospensione";

export default function CorsiLinkInterceptor() {
  const [show, setShow] = useState(false);
  const [targetHref, setTargetHref] = useState(null);

  useEffect(() => {
    function handleClick(e) {
      const link = e.target.closest('a[href^="/corsi/"], a[href="/#corsi"], a[href="#corsi"]');
      if (!link) return;
      e.preventDefault();
      e.stopPropagation();
      setTargetHref(link.getAttribute("href"));
      setShow(true);
    }
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  if (!show) return null;

  function handleContinua() {
    setShow(false);
    if (!targetHref) return;
    if (targetHref === "/#corsi" || targetHref === "#corsi") {
      setTimeout(() => {
        document.getElementById("corsi")?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    } else {
      window.location.href = targetHref;
    }
  }

  return (
    <PopupGOLSospensione
      onDismiss={() => setShow(false)}
      onContinua={handleContinua}
      continuaLabel="Consulta le informazioni archiviate"
    />
  );
}
