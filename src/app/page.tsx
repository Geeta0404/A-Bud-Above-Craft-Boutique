import type { Metadata } from "next";
import { SITE_TAGLINE } from "@/lib/constants";
import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { FeaturedCollections } from "@/components/home/FeaturedCollections";
import { BestSellers } from "@/components/home/BestSellers";
import { ArtisanSpotlight } from "@/components/home/ArtisanSpotlight";
import { Testimonials } from "@/components/home/Testimonials";
import { Newsletter } from "@/components/home/Newsletter";
import { InstagramGallery } from "@/components/home/InstagramGallery";
import { CallToAction } from "@/components/home/CallToAction";
import { getCategories } from "@/lib/data/categories";

export const metadata: Metadata = {
  title: SITE_TAGLINE,
  description:
    "Shop premium flower, pre-rolls, vaporizers, edibles, concentrates, and more from trusted BC cannabis brands.",
};

export default async function HomePage() {
  const categories = await getCategories();

  return (
    <>
      <Hero />
      <TrustBar />
      <FeaturedCollections categories={categories} />
      <BestSellers />
      <ArtisanSpotlight />
      <Testimonials />
      <Newsletter />
      <InstagramGallery />
      <CallToAction />
    </>
  );
}
