# Kit di stile AI Academy — per la pagina della serata

Questo kit serve a dare alla tua pagina sulla serata lo stesso aspetto della nostra pagina della serata
(le immagini in `riferimento/` mostrano com'è).

## Cosa c'è nella cartella

| File | A cosa serve |
|---|---|
| `stile.css` | Colori, font, dimensioni e le classi pronte (titolo, testo, pulsante, sfondo, badge, scheda docente). |
| `esempio.html` | Una pagina di prova già fatta: aprila nel browser per vedere il risultato e copia da lì il codice. |
| `testi-comuni.txt` | I testi da usare **identici**: titolo, sottotitolo, data e ora, dress code, pulsante. |
| `logo/logo-aiacademy.png` | Il logo, lo stesso file usato dalla nostra pagina (380 × 100 px, fondo trasparente). |
| `immagini/sfondo-nebulosa.jpg` (e `.webp`) | Lo sfondo blu con la sfumatura viola del primo schermo. |
| `riferimento/pagina-telefono.jpg`, `pagina-computer.jpg` | Com'è oggi la nostra pagina della serata, dall'alto in basso, su telefono e su computer. |

Il logo esiste solo in PNG: una versione SVG non ce l'abbiamo.

Tutte le classi iniziano con `aia-` e le variabili con `--aia-`. Il CSS non tocca nient'altro della tua
pagina: menu, piè di pagina e il resto del sito restano come sono.

---

## 1. Caricare il font

Il font è **Inter** (gratuito, di Google). Sui dispositivi Apple la pagina usa Helvetica Neue, già
installato, esattamente come sulla nostra pagina. I titoli usano lo stesso font del testo, in grassetto: non serve altro.

Metti queste tre righe dentro `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap">
```

Link diretto, se ti serve: https://fonts.google.com/specimen/Inter (pesi 300, 400, 500, 700).

## 2. Dove incollare il CSS

**Prima cosa, sempre:** carica sul sito la cartella `immagini/` e il logo. Poi, in `stile.css`, controlla la
riga `background-image: url("immagini/sfondo-nebulosa.jpg");` e scrivi il percorso vero dell'immagine
(per esempio `url("/wp-content/uploads/2026/11/sfondo-nebulosa.jpg")`).

### Sito fatto a mano (HTML)
1. Copia `stile.css` nella cartella del sito.
2. In `<head>`, dopo le righe del font: `<link rel="stylesheet" href="stile.css">`

### WordPress
- **Il modo più semplice:** *Aspetto → Personalizza → CSS aggiuntivo*, incolla tutto il contenuto di
  `stile.css` e pubblica. Con i temi a blocchi: *Aspetto → Editor → Stili → (tre puntini) → CSS aggiuntivo*.
- **Il font:** con un plugin per l'`<head>` (per esempio "WPCode": *Snippet di codice → Aggiungi snippet →
  Header*) incolla le tre righe del punto 1. Molti temi hanno già Inter tra i Google Fonts: in quel caso basta
  sceglierlo lì.
- **L'immagine di sfondo e il logo:** caricali in *Media → Aggiungi nuovo* e copia l'indirizzo del file nel CSS.
- **Le sezioni:** nella pagina aggiungi un blocco **HTML personalizzato** e incolla il codice d'esempio qui sotto.
  In alternativa, in un blocco normale: *Avanzate → Classe/i CSS aggiuntiva/e* e scrivi per esempio
  `aia-pulsante`.

### Next.js (o un sito simile fatto con un framework)
1. Copia `stile.css` in `app/` (o `styles/`) e importalo una volta sola nel layout principale:
   `import "./stile.css";`
2. Metti `sfondo-nebulosa.jpg` e il logo in `public/` e scrivi nel CSS `url("/sfondo-nebulosa.jpg")`.
3. Il font: in `app/layout.tsx` con `next/font/google` (`Inter`, pesi 300/400/500/700) oppure le tre righe
   del punto 1. Nel codice React si scrive `className="aia-pulsante"` invece di `class="aia-pulsante"`.

## 3. Le classi

| Classe | Cosa fa |
|---|---|
| `aia-sezione` | Una fascia della pagina: margini, font, colore del testo, fondo chiaro. Molto spazio sopra e sotto, come sulla nostra pagina. |
| `aia-contenitore` | Tiene il contenuto largo al massimo 1152 px, centrato. |
| `aia-sfondo` + `aia-apertura` | Insieme ad `aia-sezione`: il primo schermo blu con la nebulosa. |
| `aia-sfondo-notte` | Insieme ad `aia-sezione`: fascia blu profondo, senza immagine. |
| `aia-logo` | Il logo all'altezza giusta (36 px su telefono, 48 px su computer). |
| `aia-occhiello` | La riga piccola in maiuscolo sopra il titolo. |
| `aia-titolo` | Il titolo grande del primo schermo (H1): 42 px su telefono, 102 px su computer. |
| `aia-titolo-sezione` | Il titolo di una sezione (H2). Aggiungi `aia-su-chiaro` se sta su fondo chiaro. |
| `aia-barra` | La barra a spettro (viola → magenta → arancio → giallo) sotto i titoli. |
| `aia-sottotitolo`, `aia-sottotitolo-2` | Sottotitolo e riga sotto il sottotitolo del primo schermo. |
| `aia-testo` | Testo delle sezioni, grande e leggero; il `<strong>` va in grassetto pieno. |
| `aia-azioni` | Mette in fila pulsante e badge (uno sotto l'altro su telefono). |
| `aia-pulsante` | Pulsante a pillola giallo. `aia-pulsante aia-pulsante--blu` per quello blu su fondo bianco. |
| `aia-badge` | L'etichetta "Dress code" con il contorno bianco. |
| `aia-nota` | La frase piccola sotto il pulsante. |
| `aia-schede` / `aia-scheda` | Le schede dei docenti, due per riga su computer, una sotto l'altra su telefono. |

Le schede docente hanno ognuna il suo colore, preso dalla barra a spettro. Si sceglie così:
`style="--aia-colore: var(--aia-magenta)"`. Sulla nostra pagina: Stefano Alborghetti `--aia-viola`, Enrico Paracchini
`--aia-magenta`, Michele Borzatta `--aia-rosso`, Fabio Gino Merli `--aia-arancio`.

## 4. Esempio: il primo schermo

```html
<section class="aia-sezione aia-sfondo aia-apertura">
  <div class="aia-contenitore">
    <img class="aia-logo" src="logo-aiacademy.png" alt="AI Academy" width="380" height="100">
    <p class="aia-occhiello">AI Academy Open · Giovedì 26 novembre 2026 · ore 18:00 · Starting Work, Como · Ingresso gratuito · Posti limitati</p>
    <h1 class="aia-titolo">Siamo in Champions. E tu, in che serie giochi con l'AI?</h1>
    <div class="aia-barra" aria-hidden="true"></div>
    <p class="aia-sottotitolo">Giovedì 26 novembre, una serata per alzare il livello. Dal vivo, insieme.</p>
    <p class="aia-sottotitolo-2">Un aperitivo per incontrare la squadra e i programmi.</p>
    <div class="aia-azioni">
      <a class="aia-pulsante" href="#prenota">Prenota il tuo posto</a>
      <span class="aia-badge">Dress code: portate tante domande. Le più scomode.</span>
    </div>
    <p class="aia-nota">Non serve sapere niente. Serve solo la voglia di capire. Anche se l'AI un po' ti spaventa.</p>
  </div>
</section>
```

## 5. Esempio: solo il pulsante

```html
<a class="aia-pulsante" href="#prenota">Prenota il tuo posto</a>
```

**Dove porta il pulsante.** Nel kit il link è generico: `href="#prenota"`. Va collegato al modulo della tua
pagina: se il modulo sta più in basso nella stessa pagina, dagli `id="prenota"` (per esempio
`<div id="prenota">…modulo…</div>`) e il pulsante ci porta lì; se il modulo è su un'altra pagina, sostituisci
`#prenota` con il suo indirizzo.

## 6. Valori, se ti servono a mano

| | |
|---|---|
| Blu del primo schermo | `#0433B9` |
| Blu profondo | `#07188D` |
| Titoli su fondo chiaro | `#0B1240` |
| Testo | `#2B3166` |
| Testo secondario | `#4A5080` |
| Fondo chiaro | `#F6F5FB` |
| Giallo del pulsante | `#FBE853` |
| Barra a spettro | `#43287B → #93338A → #D64586 → #D8596C → #D5462E → #E07A55 → #F5C944 → #FBE853` |
| Raggi | pulsanti a pillola; schede 32 px; riquadri grandi 40 px |
| Ombra del pulsante | `0 6px 24px rgba(2, 10, 61, 0.35)` |
| Titolo H1 | grassetto, interlinea 0,98, spaziatura lettere −3,5% |
| Testo | leggero (300), 20 px su telefono, 24 px su computer, interlinea 1,625 |

## 7. Cosa non fare

- Niente loghi, stemmi, maglie o colori del Como 1907; niente logo, stelle, pallone o nome della UEFA
  Champions League; niente foto di partite o stadi. Il richiamo al calcio sta solo nelle parole del titolo.
- Niente immagini generiche di robot, cervelli luminosi o mani che si toccano.
- I testi di `testi-comuni.txt` vanno usati identici, senza cambiare punteggiatura o maiuscole.
