export interface OperatorsDTO<T> {
  ne?: T;
  in?: T[];
  or?: T[];
  gt?: T;
  lt?: T;
  lte?: T;
  gte?: T;
}

export interface PaginatedDTO<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    count: number;
    pages: number;
  };
}
