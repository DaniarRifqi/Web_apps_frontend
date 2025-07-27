import { LanguageProvider } from "./components/LanguageContext";
import HomePage from "./dashboard/home/page";
import ScanPage from "./dashboard/scan/page";
import PengertianPage from "./dashboard/pengertian/page";
import SettingsPage from "./dashboard/settings/page";

export default function LandingPage() {
  return (
    <LanguageProvider>
      <main className="bg-white">
        <section id="home"><HomePage /></section>
        <section id="scan"><ScanPage /></section>
        <section id="pengertian"><PengertianPage /></section>
        <section id="settings"><SettingsPage /></section>
      </main>
    </LanguageProvider>
  );
}