import Product from "@/features/ecommerce/models/Product";
import mongoose from "mongoose";

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/nextauth");
});

afterAll(async () => {
  await mongoose.disconnect();
});

afterEach(async () => {
  await Product.deleteMany({});
});

describe("Product Model", () => {
  it("should create a new product", async () => {
    const productData = {
      sku: "TSHIRT-RED-M",
      name: "T-Shirt Red",
      price: 99.99,
      stock: 10,
      categories: ["clothing"],
    };

    const product = await Product.create(productData);
    expect(product._id).toBeDefined();
    expect(product.name).toBe(productData.name);
    expect(product.price).toBe(productData.price);
    expect(product.sku).toBe(productData.sku);
    expect(product.stock).toBe(productData.stock);
    expect(product.slug).toBe("t-shirt-red"); // Test slug generation
    expect(product.categories).toEqual(["clothing"]);
  });

  it("should fails if the categories is empty", async () => {
    const productData = {
      sku: "TSHIRT-RED-M",
      name: "T-Shirt Red",
      price: 99.99,
      stock: 10,
      categories: [],
    };

    await expect(Product.create(productData)).rejects.toThrow(
      "At least one category is required"
    );
  });
});
