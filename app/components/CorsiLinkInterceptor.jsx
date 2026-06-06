"use client";

import { useEffect, useState } from "react";
import PopupGOLSospensione from "./PopupGOLSospensione";

export default function CorsiLinkInterceptor() {
  const [show, setShow] = useState(false);
  const [targetHref, setTargetHref] = useState(null);

  useEffect(() => {
    function handleClick(e) {
      const link = e.target.closest('a[href^="/corsi/"]');
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

  return (
    <PopupGOLSospensione
      onDismiss={() => setShow(false)}
      onContinua={() => {
        setShow(false);
        if (targetHref) window.location.href = targetHref;
      }}
      continuaLabel="Consulta le informazioni archiviate"
    />
  );
}
