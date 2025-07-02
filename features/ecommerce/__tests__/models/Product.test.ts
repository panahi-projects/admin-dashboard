import Product from "@/features/ecommerce/models/Product";
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

describe("Product Model", () => {
  //#1
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

  //#2
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

  //#3
  it("should require name, price, and sku", async () => {
    const productData = {
      description: "Missing required fields",
    };

    let error: mongoose.Error.ValidationError;
    try {
      await Product.create(productData);
      fail("Expected validation to fail");
    } catch (err) {
      error = err as mongoose.Error.ValidationError;
    }

    expect(error).toBeDefined();
    expect(error.name).toBe("ValidationError");

    expect(error.errors.name).toBeDefined();
    expect(error.errors.name.message).toContain("Product name is required");

    expect(error.errors.price).toBeDefined();
    expect(error.errors.price.message).toContain("Product price is required");

    expect(error.errors.sku).toBeDefined();
    expect(error.errors.sku.message).toContain("Product SKU is required");
  });

  //#4
  it("should validate all required fields and business rules", async () => {
    const testCases = [
      {
        data: { name: "Test", price: -10, sku: "TEST", categories: ["test"] }, // Negative price
        expectedError: "Price cannot be negative",
      },
      {
        data: { name: "", price: 10, sku: "TEST", categories: ["test"] }, // Empty name
        expectedError: "Product name is required",
      },
      {
        data: { name: "Test", price: 10, sku: "A", categories: ["test"] }, // SKU too short
        expectedError: "SKU must be at least 3 characters",
      },
    ];

    for (const testCase of testCases) {
      await expect(Product.create(testCase.data)).rejects.toThrow(
        testCase.expectedError
      );
    }
  });
});
