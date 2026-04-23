import "./globals.css";
import Providers from "./providers";
import { Nav } from "../components/nav";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <main className="mx-auto min-h-screen max-w-6xl p-6">
            <h1 className="text-3xl font-bold">Sports Platform</h1>
            <p className="text-zinc-400">Games, players, turfs, tournaments, billing, and shop.</p>
            <Nav />
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
