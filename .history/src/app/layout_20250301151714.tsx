import { Playfair_Display } from "next/font/google";
import { Inter } from "next/font/google";
import "./Style/global.css";
import "./Style/welcome.css";
import "./Style/login.css";
import "./Style/signup.css";
import "./Style/verification.css";
import "./Style/reset.css";
import "./Style/registration.css";
import "./Style/home.css";
import AuthProvider from "@/providers/AuthProvider";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}


