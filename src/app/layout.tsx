import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/core/providers/AuthProvider";
import { CartProvider } from "@/core/providers/CartProvider";
import { Header } from "@/components/ecommerce/Header";
import { SubHeader } from "@/components/ecommerce/SubHeader";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AG COURT | E-commerce Premium Neo-Brutalista",
  description: "La tienda oficial de zapatillas y equipamiento de básquetbol con un estilo visual disruptivo y de alto impacto.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${outfit.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-neo-bg text-neo-dark selection:bg-neo-lime flex flex-col font-sans">
        <AuthProvider>
          <CartProvider>
            <Header />
            <SubHeader />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

