import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts, products } from "@/lib/data/products";
import { Gallery } from "@/components/product/Gallery";
import { AddToCartForm } from "@/components/product/AddToCartForm";
import { Reviews } from "@/components/product/Reviews";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { RecentlyViewed } from "@/components/product/RecentlyViewed";
import { TrackView } from "@/components/product/TrackView";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";
import { JsonLd } from "@/components/shared/JsonLd";
import { CAD, SITE_URL } from "@/lib/constants";
import { categories } from "@/lib/data/categories";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: { images: [product.images[0]] },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product);
  const category = categories.find((c) => c.slug === product.category);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <TrackView slug={product.slug} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          image: product.images,
          description: product.description,
          sku: product.slug,
          offers: {
            "@type": "Offer",
            url: `${SITE_URL}/shop/${product.slug}`,
            priceCurrency: "CAD",
            price: product.price,
            availability: product.inStock
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          },
        }}
      />
      <PageBreadcrumbs
        items={[
          { label: "Shop", href: "/shop" },
          ...(category ? [{ label: category.name, href: `/categories/${category.slug}` }] : []),
          { label: product.name },
        ]}
      />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <Gallery images={product.images} name={product.name} />

        <div>
          <p className="text-sm uppercase tracking-wide text-muted-foreground">{product.artisan}</p>
          <h1 className="mt-1 font-heading text-3xl font-medium">{product.name}</h1>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-2xl font-semibold">{CAD(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-lg text-muted-foreground line-through">{CAD(product.compareAtPrice)}</span>
            )}
          </div>
          <p className="mt-4 text-muted-foreground">{product.description}</p>

          <div className="mt-6">
            <AddToCartForm product={product} />
          </div>

          <Tabs defaultValue="details" className="mt-8">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="materials">Materials</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="text-sm text-muted-foreground">
              {product.longDescription}
            </TabsContent>
            <TabsContent value="materials">
              <ul className="list-inside list-disc text-sm text-muted-foreground">
                {product.materials.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="reviews">
              <Reviews reviews={product.reviews} rating={product.rating} count={product.reviewCount} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <RelatedProducts products={related} />
      <RecentlyViewed excludeSlug={product.slug} />
    </div>
  );
}
