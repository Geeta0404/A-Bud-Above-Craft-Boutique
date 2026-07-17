export type Review = {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  title: string | null;
  body: string | null;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  authorName?: string;
};

export type ReviewInput = {
  productId: number;
  rating: number;
  title?: string | null;
  body?: string | null;
};
