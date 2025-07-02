import { IProduct } from "@/features/ecommerce/models/Product";

// Product query/filtering params (e.g., for API requests)
export interface ProductQueryParams {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  inStock?: boolean;
}

// Product-specific pagination options (extends generic pagination if needed)
export interface ProductPaginationOptions {
  page?: number;
  limit?: number;
  sort?: string;
  lean?: boolean;
}

export type ProductPartialInput = Partial<
  Omit<IProduct, "_id" | "slug" | "createdAt" | "updatedAt" | "deletedAt">
>;
