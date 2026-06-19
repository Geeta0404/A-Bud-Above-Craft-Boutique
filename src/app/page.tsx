import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { FeaturedCollections } from "@/components/home/FeaturedCollections";
import { BestSellers } from "@/components/home/BestSellers";
import { ArtisanSpotlight } from "@/components/home/ArtisanSpotlight";
import { Testimonials } from "@/components/home/Testimonials";
import { Newsletter } from "@/components/home/Newsletter";
import { InstagramGallery } from "@/components/home/InstagramGallery";
import { CallToAction } from "@/components/home/CallToAction";

export const metadata: Metadata = {
  title: "Handcrafted Goods, Canadian Made",
  description:
    "Shop handcrafted candles, pottery, woodwork, textile art, and artisan gifts made by independent Canadian makers.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCollections />
      <BestSellers />
      <ArtisanSpotlight />
      <Testimonials />
      <Newsletter />
      <InstagramGallery />
      <CallToAction />
    </>
  );
}
