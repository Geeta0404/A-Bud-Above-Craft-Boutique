import { getAllProducts } from "@/lib/data/products";
import { WishlistPageClient } from "@/components/wishlist/WishlistPageClient";

export default async function WishlistPage() {
  const products = await getAllProducts();
  return <WishlistPageClient products={products} />;
}
