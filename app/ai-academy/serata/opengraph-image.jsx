import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SERATA_AI, TESTI_SERATA } from "@/app/lib/serataAi";

// Immagine di anteprima per la condivisione del link (WhatsApp, Facebook,
// LinkedIn, email). Generata al build a partire dai dati in app/lib/serataAi.js.

export const alt = `${TESTI_SERATA.titolo} AI Academy Open, ${SERATA_AI.giorno} ore ${SERATA_AI.ora}, ${SERATA_AI.luogo}, Como.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SPETTRO =
  "linear-gradient(90deg, #43287b 0%, #93338a 16%, #d64586 30%, #d8596c 40%, #d5462e 54%, #e07a55 72%, #f5c944 90%, #fbe853 100%)";

async function dataUrl(percorso, tipo) {
  const file = await readFile(join(process.cwd(), "public", percorso));
  return `data:${tipo};base64,${file.toString("base64")}`;
}

export default async function Image() {
  const [sfondo, logo] = await Promise.all([
    dataUrl("aia/sfondo-nebulosa.jpg", "image/jpeg"),
    dataUrl("ai-academy-logo.png", "image/png"),
  ]);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", backgroundColor: "#07188d" }}>
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img src={sfondo} width={1200} height={630} style={{ position: "absolute", top: 0, left: 0, objectFit: "cover" }} />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "linear-gradient(90deg, rgba(7,24,141,0.92) 0%, rgba(7,24,141,0.75) 60%, rgba(7,24,141,0.35) 100%)",
          }}
        />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", padding: "56px 72px", width: "100%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
          <img src={logo} width={266} height={70} />
          <div
            style={{
              display: "flex",
              marginTop: 40,
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: 2,
              color: "#fbe853",
              textTransform: "uppercase",
            }}
          >
            {`AI Academy Open · ${SERATA_AI.giornoSenzaAnno} · ore ${SERATA_AI.ora}`}
          </div>
          <div style={{ display: "flex", marginTop: 18, fontSize: 64, fontWeight: 700, lineHeight: 1.08, color: "#ffffff", maxWidth: 1000 }}>
            {TESTI_SERATA.titolo}
          </div>
          <div style={{ display: "flex", marginTop: 30, width: 420, height: 8, borderRadius: 4, backgroundImage: SPETTRO }} />
          <div style={{ display: "flex", marginTop: "auto", fontSize: 28, color: "rgba(255,255,255,0.92)" }}>
            {`${SERATA_AI.luogo}, Como · Ingresso gratuito · Posti limitati`}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
