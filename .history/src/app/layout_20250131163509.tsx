import { Playfair_Display } from "next/font/google"
import "@/Style/global.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={playfair.variable}>
      <body>{children}</body>
    </html>
  )
}

