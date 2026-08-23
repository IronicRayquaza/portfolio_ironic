import { Blotter } from "@/components/Blotter";
import { CaseLog } from "@/components/CaseLog";
import { Contact } from "@/components/Contact";
import { Evidence } from "@/components/Evidence";
import { Footer } from "@/components/Footer";
import { FrontPage } from "@/components/FrontPage";
import { LabReport } from "@/components/LabReport";
import { Masthead } from "@/components/Masthead";
import { Nav } from "@/components/Nav";

export default function Home() {
  return (
    <>
      <Masthead />
      <Nav />
      <main id="main">
        <FrontPage />
        <Evidence />
        <LabReport />
        <CaseLog />
        <Blotter />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
