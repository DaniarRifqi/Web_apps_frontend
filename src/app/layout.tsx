
import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "Identifikasi Kekeringan Buah Apel",
  description: "Landing page identifikasi kekeringan buah apel dengan AI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-white">
        <Navbar />
        <div>{children}</div>
      </body>
    </html>
  );
}
