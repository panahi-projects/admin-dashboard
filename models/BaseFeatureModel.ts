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
}
