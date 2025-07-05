import { PaginateOptions, PaginateResult } from "@/types";
import mongoose, { Document, FilterQuery } from "mongoose";

export class BaseFeatureModel<T extends Document> {
  constructor(private model: mongoose.Model<T>) {}

  // Common CRUD operations

  // CREATE
  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  // READ - Get by ID
  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  // READ - Get one by query
  async findOne(query: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(query).exec();
  }

  // READ - Get all with pagination
  async findAll(
    query: FilterQuery<T> = {},
    options: PaginateOptions = {}
  ): Promise<PaginateResult<T>> {
    const {
      page = 1,
      limit = 10,
      sort = "-createdAt",
      select,
      populate,
      lean = false,
    } = options;

    const queryBuilder = this.model
      .find(query)
      .select(select || "")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate(populate || "");

    // Apply lean transformation if needed
    if (lean) {
      queryBuilder.lean({
        transform: (doc: any) => {
          if (doc?._id && mongoose.isValidObjectId(doc._id)) {
            doc._id = doc._id.toString();
          }
          return doc;
        },
      });
    }

    // Execute queries
    const [data, total] = await Promise.all([
      queryBuilder.exec(),
      this.model.countDocuments(query),
    ]);

    return {
      data: data as T[], // Type assertion here
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    };
  }

  // UPDATE - Full update (replaces entire document)
  async updateById(id: string, data: Partial<T>): Promise<T | null> {
    // First get the existing document
    const existing = await this.model.findById(id).exec();
    if (!existing) return null;

    // Create a new document with merged data
    const updatedDoc = existing.set(data);

    // Explicitly check for undefined required fields
    const schema = this.model.schema;
    const requiredPaths = Object.keys(schema.paths).filter(
      (path) => schema.paths[path].isRequired
    );

    for (const path of requiredPaths) {
      // Type-safe way to check if the field exists in the data
      if (data[path as keyof Partial<T>] === undefined) {
        throw new Error(`Field "${path}" is required`);
      }
    }

    // Validate before saving
    await updatedDoc.validate();

    // Save the changes
    return updatedDoc.save();
  }

  // UPDATE - Partial update (only updates specified fields)
  async patchById(id: string, data: Partial<T>): Promise<T | null> {
    // For partial updates, we'll let Mongoose handle the validation
    // of only the fields that are being updated
    return this.model
      .findByIdAndUpdate(
        id,
        { $set: data },
        {
          new: true,
          runValidators: true,
          context: "query",
          setDefaultsOnInsert: false,
        }
      )
      .exec();
  }
}
