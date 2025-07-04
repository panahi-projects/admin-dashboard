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

  //#4
  it("should full update a product by ID", async () => {
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

    //update product:
    const updatedProduct = await productService.updateProductById(product.id, {
      sku: "TSHIRT-BLUE-L",
      name: "T-Shirt Blue",
      price: 79,
      stock: 5,
      categories: ["clothing"],
    });

    expect(updatedProduct).toBeDefined();
    expect(updatedProduct?.sku).toBe("TSHIRT-BLUE-L");
    expect(updatedProduct?.name).toBe("T-Shirt Blue");
    expect(updatedProduct?.price).toBe(79);
  });
});

describe("ProductService finds functionality", () => {
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
      {
        name: "Wireless Earbuds",
        price: 29.99,
        sku: "AUDIO-004",
        stock: 6,
        description: "Wireless earbuds",
        categories: ["electronics", "gadget", "mobile-accessories", "audio"],
      },
    ]);
  });

  //FindAll:
  //#1
  it("should return paginated products", async () => {
    const result = await productService.getProducts({}, { page: 1, limit: 2 });

    expect(result.data.length).toBe(2);
    expect(result.total).toBe(5);
    expect(result.page).toBe(1);
    expect(result.totalPages).toBe(3);
    expect(result.hasNextPage).toBeTruthy();
    expect(result.hasPrevPage).toBeFalsy();
  });

  //#2
  it("should filter by category", async () => {
    const result = await productService.getProducts({ category: "audio" });
    expect(result.data.length).toBe(4);
    expect(result.data.every((p) => p.categories.includes("audio"))).toBe(true);
  });

  //#3
  it("should search by text", async () => {
    const result = await productService.getProducts({ search: "wireless" });
    expect(result.data.length).toBe(2);
    expect(result.data[0].name).toContain("Wireless");
  });

  //#4
  it("should filter by price range", async () => {
    const result = await productService.getProducts({
      minPrice: 50,
      maxPrice: 100,
    });
    expect(result.data.length).toBe(1);
    expect(result.data[0].sku).toBe("AUDIO-003");
  });

  //#5
  it("should filter by stock availability", async () => {
    const inStockResult = await productService.getProducts({ inStock: true });
    expect(inStockResult.data.length).toBe(4);

    const outOfStockResult = await productService.getProducts({
      inStock: false,
    });
    expect(outOfStockResult.data.length).toBe(1);
  });

  //#6
  it("should return lean objects with string _id when requested", async () => {
    // First create a test product
    await Product.create({
      name: "Test Product",
      price: 99.99,
      sku: "TEST-LEAN-1",
      categories: ["Test"],
      stock: 10,
    });

    const result = await productService.getProducts({}, { lean: true });

    // Verify it's a plain object
    expect(result.data[0]).not.toHaveProperty("$isMongooseModelPrototype");

    // Verify _id is now a string
    expect(typeof result.data[0]._id).toBe("string");

    // Verify other fields are present
    expect(result.data[0].name).toBe("Test Product");
    expect(result.data[0].price).toBe(99.99);
  });

  //#7
  it("should combine multiple query to find products", async () => {
    const result = await productService.getProducts(
      {
        search: "wire",
        minPrice: 20,
        inStock: true,
      },
      { page: 1, limit: 10 }
    );

    expect(result).toBeDefined();
    expect(result.data.length).toBe(2);
    expect(result.total).toBe(2);
    expect(result.hasPrevPage).toBeFalsy();
    expect(result.hasNextPage).toBeFalsy();
  });

  //FindOne:
  //#8
  it("should find a product by exact SKU", async () => {
    const product = await productService.getProductByQuery({
      sku: "PHONE-001",
    });

    expect(product).toBeDefined();
    expect(product?.name).toBe("Smartphone X");
    expect(product?.price).toBe(799.99);
  });

  //#9
  it("should find a product by name regex", async () => {
    const product = await productService.getProductByQuery({
      name: "smartphone",
    });

    expect(product).toBeDefined();
    expect(product?.sku).toBe("PHONE-001");
  });

  //#10
  it("should return null when no product matches", async () => {
    const product = await productService.getProductByQuery({
      sku: "NON-EXISTENT",
    });
    expect(product).toBeNull();
  });

  //#11
  it("should find a product by price range", async () => {
    const product = await productService.getProductByQuery({
      minPrice: 50,
      maxPrice: 100,
    });
    expect(product?.sku).toBe("AUDIO-003");
  });

  //#12
  it("should find a product by in-stock", async () => {
    const productInStock = await productService.getProductByQuery({
      inStock: true,
    });
    expect(productInStock?.stock).toBeGreaterThan(0);

    const productNotInStock = await productService.getProductByQuery({
      inStock: false,
    });
    expect(productNotInStock?.stock).toEqual(0);
  });

  //#13
  it("should combine multiple query criteria", async () => {
    const product = await productService.getProductByQuery({
      category: "audio",
      minPrice: 200,
      inStock: true,
    });
    expect(product?.sku).toBe("AUDIO-001"); // Only the headphones match all criteria
  });
});
