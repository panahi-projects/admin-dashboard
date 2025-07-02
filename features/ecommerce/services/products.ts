import { BaseFeatureModel } from "@/models/BaseFeatureModel";
import Product, { IProduct } from "@/features/ecommerce/models/Product";
import { FilterQuery } from "mongoose";
import { PaginateResult } from "@/types";
import {
  ProductPaginationOptions,
  ProductPartialInput,
  ProductQueryParams,
} from "@/features/ecommerce/types";

export class ProductService extends BaseFeatureModel<IProduct> {
  constructor() {
    super(Product);
  }

  async createProduct(data: ProductPartialInput): Promise<IProduct> {
    return this.create(data);
  }

  async getProductById(id: string): Promise<IProduct | null> {
    return this.findById(id);
  }

  async getProducts(
    queryParams: ProductQueryParams = {},
    paginationOptions: ProductPaginationOptions = {}
  ): Promise<PaginateResult<IProduct>> {
    // Build the MongoDB query
    const query: FilterQuery<IProduct> = {};

    if (queryParams.search) {
      query.$or = [
        { name: { $regex: queryParams.search, $options: "i" } },
        { description: { $regex: queryParams.search, $options: "i" } },
        { sku: { $regex: queryParams.search, $options: "i" } },
      ];
    }

    // Price range
    if (
      queryParams.minPrice !== undefined ||
      queryParams.maxPrice !== undefined
    ) {
      query.price = {};
      if (queryParams.minPrice !== undefined) {
        query.price.$gte = queryParams.minPrice;
      }
      if (queryParams.maxPrice !== undefined) {
        query.price.$lte = queryParams.maxPrice;
      }
    }

    // Category filter
    if (queryParams.category) {
      query.category = queryParams.category;
    }

    // Stock availability
    if (queryParams.inStock !== undefined) {
      query.stock = queryParams.inStock ? { $gt: 0 } : { $lte: 0 };
    }

    // Execute query with pagination
    return this.findAll(query, {
      page: paginationOptions.page || 1,
      limit: paginationOptions.limit || 10,
      sort: paginationOptions.sort || "-createdAt",
      lean: paginationOptions.lean || false,
    });
  }
}

export const productService = new ProductService();
