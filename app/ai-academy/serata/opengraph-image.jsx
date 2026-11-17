import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { TESTI_SERATA } from "@/app/lib/serataAi";

// Immagine di anteprima per la condivisione del link (WhatsApp, Facebook,
// LinkedIn, email). Riproduce l'apertura della pagina /ai-academy/serata
// (stile aia-*): nebulosa, occhiello, titolo, barra a spettro, frase, pulsanti.
// Testi da app/lib/serataAi.js. Generata al build.

export const alt = `${TESTI_SERATA.titolo} ${TESTI_SERATA.occhiello}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BIANCO = "#ffffff";
const GIALLO = "#fbe853";
const INCHIOSTRO = "#0b1240";
const SPETTRO =
  "linear-gradient(90deg, #43287b 0%, #93338a 16%, #d64586 30%, #d8596c 40%, #d5462e 54%, #e07a55 72%, #f5c944 90%, #fbe853 100%)";

// Il titolo va a capo come nella pagina: "Siamo in Champions." / "E tu, in che serie" / "giochi con l'AI?"
function righeTitolo(titolo) {
  const [prima, resto = ""] = titolo.split(". ");
  const parole = resto.split(" ");
  const meta = Math.ceil(parole.length / 2) + 1;
  return [`${prima}.`, parole.slice(0, meta).join(" "), parole.slice(meta).join(" ")].filter(Boolean);
}

export default async function Image() {
  const radice = process.cwd();
  const [sfondo, interBold, interLight] = await Promise.all([
    readFile(join(radice, "public/aia/sfondo-nebulosa.jpg")),
    readFile(join(radice, "assets/fonts/inter-latin-700-normal.woff")),
    readFile(join(radice, "assets/fonts/inter-latin-300-normal.woff")),
  ]);
  const sfondoUrl = `data:image/jpeg;base64,${sfondo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#0433b9",
          fontFamily: "Inter",
          color: BIANCO,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img
          src={sfondoUrl}
          width={1200}
          height={630}
          style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, objectFit: "cover", objectPosition: "0% 100%" }}
        />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", padding: "34px 70px 0" }}>
          <div style={{ display: "flex", fontSize: 13.5, fontWeight: 700, letterSpacing: 1.2 }}>
            {TESTI_SERATA.occhiello.toUpperCase()}
          </div>

          <div style={{ display: "flex", flexDirection: "column", marginTop: 22 }}>
            {righeTitolo(TESTI_SERATA.titolo).map((riga) => (
              <div key={riga} style={{ display: "flex", fontSize: 84, fontWeight: 700, lineHeight: 0.98, letterSpacing: -3 }}>
                {riga}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", marginTop: 26, width: 520, height: 10, borderRadius: 5, backgroundImage: SPETTRO }} />

          <div style={{ display: "flex", flexDirection: "column", marginTop: 24, fontSize: 30, fontWeight: 300, lineHeight: 1.3 }}>
            {TESTI_SERATA.sottotitolo.split(/(?<=\.) /).map((riga) => (
              <div key={riga} style={{ display: "flex" }}>{riga}</div>
            ))}
          </div>
          <div style={{ display: "flex", marginTop: 8, fontSize: 22, fontWeight: 300, opacity: 0.9 }}>
            {TESTI_SERATA.sottotitolo2}
          </div>

          <div style={{ display: "flex", alignItems: "center", marginTop: 24 }}>
            <div
              style={{
                display: "flex",
                padding: "16px 34px",
                borderRadius: 999,
                backgroundColor: GIALLO,
                color: INCHIOSTRO,
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              {TESTI_SERATA.pulsante}
            </div>
            <div
              style={{
                display: "flex",
                marginLeft: 18,
                padding: "10px 20px",
                borderRadius: 999,
                border: "2px solid rgba(255,255,255,0.8)",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              {TESTI_SERATA.dressCode}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: interBold, weight: 700, style: "normal" },
        { name: "Inter", data: interLight, weight: 300, style: "normal" },
      ],
    }
  );
}
