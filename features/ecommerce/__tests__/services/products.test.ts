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

    if (!product) {
      throw new Error("Product creation failed");
    }

    expect(product).toHaveProperty("_id");
    expect(product.name).toBe(productData.name);
    expect(product.slug).toBeDefined();
  });

  //#2
  it("should throw error for duplicate SKU", async () => {
    const productData = {
      name: "Test Product",
      price: 99.99,
      sku: "DUPLICATE123",
      categories: ["test"],
    };

    await productService.createProduct(productData);

    await expect(
      productService.createProduct({
        ...productData,
        name: "Different Name",
      })
    ).rejects.toThrow("The SKU has already been used");
  });

  //#3
  it("should return product by Id", async () => {
    const productData = {
      name: "Test Product",
      price: 99.99,
      sku: "DUPLICATE123",
      categories: ["test"],
    };

    const product = await productService.createProduct(productData);

    if (!product) {
      throw new Error("Product creation failed");
    }

    expect(product).toHaveProperty("_id");
    const productId = product._id as string;

    const foundProduct = await productService.getProductById(productId);

    expect(foundProduct).toBeDefined();
    expect(foundProduct?.name).toBe(productData.name);
    expect(foundProduct?.sku).toBe(productData.sku);
  });
});

describe("ProductService.getProducts()", () => {
  const productService = new ProductService();
  beforeEach(async () => {
    await Product.deleteMany({});
    // Seed test data
    await Product.create([
      {
        name: "Premium Wireless Headphones",
        price: 299.99,
        sku: "AUDIO-001",
        stock: 50,
        description: "High-quality wireless headphones with noise cancellation",
        categories: ["electronics", "gadget", "mobile-accessories", "audio"],
      },
      {
        name: "Budget Wired Earbuds",
        price: 19.99,
        sku: "AUDIO-002",
        stock: 0,
        description: "Affordable wired earbuds",
        categories: ["electronics", "gadget", "mobile-accessories", "audio"],
      },
      {
        name: "Bluetooth Speaker",
        price: 89.99,
        sku: "AUDIO-003",
        stock: 25,
        categories: ["electronics", "gadget", "audio"],
      },
      {
        name: "Smartphone X",
        price: 799.99,
        sku: "PHONE-001",
        stock: 10,
        categories: ["electronics", "mobile"],
      },
    ]);
  });

  //#1
  it("should return paginated products", async () => {
    const result = await productService.getProducts({}, { page: 1, limit: 2 });

    expect(result.data.length).toBe(2);
    expect(result.total).toBe(4);
    expect(result.page).toBe(1);
    expect(result.totalPages).toBe(2);
    expect(result.hasNextPage).toBeTruthy();
    expect(result.hasPrevPage).toBeFalsy();
  });

  //#2
  it("should filter by category", async () => {
    const result = await productService.getProducts({ category: "audio" });
    expect(result.data.length).toBe(3);
    expect(result.data.every((p) => p.categories.includes("audio"))).toBe(true);
  });

  //#3
  it("should search by text", async () => {
    const result = await productService.getProducts({ search: "wireless" });
    expect(result.data.length).toBe(1);
    expect(result.data[0].name).toContain("Wireless");
  });
});
