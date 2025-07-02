import mongoose, { Document, FilterQuery } from "mongoose";

export class BaseFeatureModel<T extends Document> {
  constructor(private model: mongoose.Model<T>) {}

  // Common CRUD operations

  // CREATE
  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }
}
