import { supabase } from "@/app/lib/supabase";
import ProponCorsoForm from "./ProponCorsoForm";

export const metadata = {
  title: "Proponi un Corso – Formazione Como Lago e Valli",
  description:
    "Dicci cosa vorresti imparare. Se raccogliamo abbastanza richieste, organizziamo il corso per te.",
};

export default async function ProponCorsoPage() {
  let categorie = [];

  if (!supabase) {
    console.warn("[proponi-corso] supabase client è null — controlla NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
  } else {
    console.log("[proponi-corso] Fetching categorie_formative...");
    const { data, error } = await supabase
      .from("categorie_formative")
      .select("id, titolo, contatore")
      .eq("attiva", true)
      .order("ordine");

    if (error) {
      console.error("[proponi-corso] Errore query categorie_formative:", JSON.stringify(error));
    } else {
      if (data) categorie = data;
      console.log("[proponi-corso] Categorie caricate:", categorie.length);
    }
  }

  return <ProponCorsoForm categorieIniziali={categorie} />;
}
