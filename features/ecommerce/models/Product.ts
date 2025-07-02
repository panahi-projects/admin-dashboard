import mongoose, { Document } from "mongoose";
import slugify from "slugify";

export interface IProduct extends Document {
  name: string;
  slug: string;
  price: number;
  sku: string;
  description?: string;
  stock: number;
  images?: {
    thumbnail: string;
    large: string[];
  };
  categories: string[];
  isActive: boolean;
}

const ProductSchema = new mongoose.Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
    },
    slug: { type: String, unique: true },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    sku: {
      type: String,
      required: [true, "Product SKU is required"],
      unique: [true, "The SKU has already been used"],
      minlength: [3, "SKU must be at least 3 characters"],
    },
    description: { type: String },
    stock: { type: Number, default: 0, min: 0 },
    images: {
      type: {
        thumbnail: String,
        large: [String],
      },
      default: {},
    },
    categories: {
      type: [String],
      default: [],
      validate: {
        validator: function (categories: string[]) {
          // At least one category required
          return categories.length > 0;
        },
        message: "At least one category is required",
      },
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Generate slug before saving
ProductSchema.pre<IProduct>("save", function (next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export default mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);
