import { createContext } from "react";

export type Lang = "KR" | "EN";

export interface LangContextType {
  lang: Lang;
  toggleLang: () => void;
}

export const LangContext = createContext<LangContextType>({
  lang: "KR",
  toggleLang: () => {},
});
