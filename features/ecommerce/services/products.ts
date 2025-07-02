import { BaseFeatureModel } from "@/models/BaseFeatureModel";
import Product, { IProduct } from "@/features/ecommerce/models/Product";

type ProductCreateInput = Partial<
  Omit<IProduct, "_id" | "slug" | "createdAt" | "updatedAt" | "deletedAt">
>;

export class ProductService extends BaseFeatureModel<IProduct> {
  constructor() {
    super(Product);
  }

  async createProduct(data: ProductCreateInput): Promise<IProduct> {
    return this.create(data);
  }

  async getProductById(id: string): Promise<IProduct | null> {
    return this.findById(id);
  }
}

export const productService = new ProductService();
