import "./globals.css";
import Providers from "./providers";
import { Nav } from "../components/nav";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <main className="app-shell">
            <section className="topbar">
              <h1 className="title">Sports Platform Control Center</h1>
              <p className="subtitle">Host games, book turfs, run tournaments, split bills, and manage gear sales.</p>
              <Nav />
            </section>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
