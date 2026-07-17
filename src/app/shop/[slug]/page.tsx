import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProducts, getProductBySlug, getRelatedProducts } from "@/lib/data/products";
import { Gallery } from "@/components/product/Gallery";
import { AddToCartForm } from "@/components/product/AddToCartForm";
import { Reviews } from "@/components/product/Reviews";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { RecentlyViewed } from "@/components/product/RecentlyViewed";
import { TrackView } from "@/components/product/TrackView";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";
import { JsonLd } from "@/components/shared/JsonLd";
import { CAD, SITE_URL } from "@/lib/constants";
import { getCategories } from "@/lib/data/categories";
import { formatCbd, formatThc, hasPotencyInfo } from "@/lib/cannabis";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: { images: [product.images[0]] },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, allProducts, categories] = await Promise.all([
    getRelatedProducts(product),
    getAllProducts(),
    getCategories(),
  ]);
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
          <p className="text-sm uppercase tracking-wide text-muted-foreground">{product.brand}</p>
          <h1 className="mt-1 font-heading text-3xl font-medium">{product.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant="outline">{product.strainType}</Badge>
            <span className="text-sm text-muted-foreground">{product.size}</span>
            {hasPotencyInfo(product) && (
              <span className="text-sm text-muted-foreground">
                {formatThc(product)} · {formatCbd(product)}
              </span>
            )}
          </div>
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
              <TabsTrigger value="strain-info">Strain Info</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="text-sm text-muted-foreground">
              {product.longDescription}
            </TabsContent>
            <TabsContent value="strain-info">
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>Strain type: {product.strainType}</li>
                {hasPotencyInfo(product) && (
                  <>
                    <li>{formatThc(product)}</li>
                    <li>{formatCbd(product)}</li>
                  </>
                )}
                <li>Size: {product.size}</li>
              </ul>
            </TabsContent>
            <TabsContent value="reviews">
              <Reviews reviews={product.reviews} rating={product.rating} count={product.reviewCount} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <RelatedProducts products={related} />
      <RecentlyViewed products={allProducts} excludeSlug={product.slug} />
    </div>
  );
}
