export interface Course {
  _id: string;
  title: string;
  description: string;
  author: string;
  price: number;
  imageUrl: string;
  category?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CoursesResponse {
  courses: Course[];
  pagination: Pagination;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  totalCourses?: number;
  limit?: number;
  itemsPerPage?: number;
  hasNextPage: boolean;
  hasPreviousPage?: boolean;
  hasPrevPage?: boolean;
}
