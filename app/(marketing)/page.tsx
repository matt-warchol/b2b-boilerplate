import { FolioProductTour } from "@/components/folio-landing";
import {
  Closing,
  DemoOptions,
  MarketingFooter,
  MarketingHeader,
  ProductFeatures,
  ProductHero,
  ProductStory,
  Questions,
} from "@/components/marketing/blocks";

export default function LandingPage() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <MarketingHeader />
      <main id="main" className="folidock-landing" tabIndex={-1}>
        <ProductHero />
        <ProductStory />
        <ProductFeatures />
        <FolioProductTour />
        <DemoOptions />
        <Questions />
        <Closing />
      </main>
      <MarketingFooter />
    </>
  );
}
