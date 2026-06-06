"use client";

import { useState } from "react";
import PopupGOLSospensione from "./PopupGOLSospensione";

export default function CorsoGolPopup() {
  const [show, setShow] = useState(true);
  if (!show) return null;
  return (
    <PopupGOLSospensione
      onDismiss={() => setShow(false)}
      continuaLabel="Consulta le informazioni archiviate"
    />
  );
}
