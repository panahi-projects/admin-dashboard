import Product from "@/features/ecommerce/models/Product";
import { ProductService } from "@/features/ecommerce/services/products";
import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}
beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
  await mongoose.disconnect();
});

afterEach(async () => {
  await Product.deleteMany({});
});

describe("Product Service", () => {
  const productService = new ProductService();

  //#1
  it("should create a new product", async () => {
    const productData = {
      sku: "TSHIRT-RED-M",
      name: "T-Shirt Red",
      price: 99.99,
      stock: 10,
      categories: ["clothing"],
    };

    const product = await productService.createProduct(productData);

    expect(product).toHaveProperty("_id");
    expect(product.name).toBe(productData.name);
    expect(product.slug).toBeDefined();
  });
});
