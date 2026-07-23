import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Categories } from "@/components/categories";
import { Collection } from "@/components/collection";
import { ShopTheLook } from "@/components/shop-the-look";
import { BundleStudio } from "@/components/bundle-studio";
import { BrandStory, LifestyleBanner, Testimonials } from "@/components/stories";
import { LimitedDrop, Trending } from "@/components/trending";
import { BuildYourCorner } from "@/components/corner";
import { UgcGallery } from "@/components/ugc-gallery";
import { RecentActivityTicker } from "@/components/recent-activity";
import { AiConcierge } from "@/components/ai-concierge";
import { VipLoyaltyModal } from "@/components/vip-loyalty";
import { Footer, NewsletterBlock } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";
import {
  AccountModal,
  CompareBar,
  CompareModal,
  GiftFinder,
  QuickView,
  Toasts,
  WishlistModal,
} from "@/components/overlays";

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Categories />
        <Collection />
        <ShopTheLook />
        <BundleStudio />
        <Trending />
        <LimitedDrop />
        <BrandStory />
        <LifestyleBanner />
        <BuildYourCorner />
        <UgcGallery />
        <Testimonials />
        <NewsletterBlock />
      </main>
      <Footer />

      {/* Luxury Features & Overlays */}
      <AiConcierge />
      <RecentActivityTicker />
      <VipLoyaltyModal />
      <CartDrawer />
      <QuickView />
      <WishlistModal />
      <AccountModal />
      <CompareModal />
      <GiftFinder />
      <CompareBar />
      <Toasts />
    </div>
  );
}
