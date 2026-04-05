import { Lilita_One, Montserrat, Noto_Sans, Outfit, Patrick_Hand } from "next/font/google";

export const handwritten = Patrick_Hand({ subsets: ["latin"], weight: "400" });
export const montserrat = Montserrat({ subsets: ["latin"] });
export const lilita = Lilita_One({ subsets: ["latin"], weight: "400" });
export const outfit = Outfit({ subsets: ["latin", "latin-ext"], variable: "--font-outfit" });
export const notosans = Noto_Sans({
    subsets: ["latin", "latin-ext"],
    variable: "--font-noto-sans"
});