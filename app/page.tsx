import { Header } from "@/components/storefront/Header";
import { AnnouncementBar, Hero } from "@/components/storefront/Hero";
import { ManualVsAutomated, PainSection } from "@/components/storefront/PainSection";
import { WorkflowShowcase } from "@/components/storefront/WorkflowShowcase";
import { ProductContents } from "@/components/storefront/ProductContents";
import { ProductProof } from "@/components/storefront/ProductProof";
import {
  BeginnerReassurance,
  Benefits,
  BuildVsBuy,
  BuyerFit,
  Requirements,
  ValueJustification,
  WhyThisExists,
} from "@/components/storefront/Journey";
import { SetupJourney } from "@/components/storefront/SetupJourney";
import { FAQ } from "@/components/storefront/FAQ";
import { FinalCTA, Footer, PricingCard, SetupHelp } from "@/components/storefront/Pricing";
import { MobilePurchaseBar } from "@/components/storefront/MobilePurchaseBar";

export default function Home() {
  return (
    <div id="top">
      <AnnouncementBar />
      <Header />
      <main>
        <Hero />
        <PainSection />
        <ManualVsAutomated />
        <WorkflowShowcase />
        <WhyThisExists />
        <Benefits />
        <ProductContents />
        <ProductProof />
        <BuildVsBuy />
        <SetupJourney />
        <BeginnerReassurance />
        <BuyerFit />
        <Requirements />
        <ValueJustification />
        <PricingCard />
        <SetupHelp />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <MobilePurchaseBar />
    </div>
  );
}
