export interface PaginateOptions {
  page?: number;
  limit?: number;
  sort?: string | Record<string, 1 | -1>;
  select?: string;
  populate?: string | string[];
  lean?: boolean;
}

export interface PaginateResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
