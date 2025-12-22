'use client';

import { Inter, Roboto, Open_Sans, Lato, Montserrat, Merriweather, Playfair_Display, Roboto_Mono } from "next/font/google";
import "./globals.css";
import "../styles/pdf-export.css";
import Navbar from "@/components/Navbar";

// Load all fonts used in CV templates with Czech character support
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-roboto",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-open-sans",
  display: "swap",
});

const lato = Lato({
  weight: ["400", "700"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-lato",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  variable: "--font-montserrat",
  display: "swap",
});

const merriweather = Merriweather({
  weight: ["400", "700"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-merriweather",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-playfair-display",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-roboto-mono",
  display: "swap",
});

export default function RootLayout({ children }) {
    return (
    <html lang="cs">
      <body
        className={`
          ${inter.variable} 
          ${roboto.variable} 
          ${openSans.variable} 
          ${lato.variable} 
          ${montserrat.variable} 
          ${merriweather.variable} 
          ${playfairDisplay.variable} 
          ${robotoMono.variable} 
          antialiased
        `}
      >
        {<Navbar />}
        {children}
      </body>
    </html>
  );
}
