import { useQuery, apiRequest } from '@/hooks';
import { COURSE_ROUTES } from '@/routes/courseRoutes';
import { Course, CoursesResponse } from '@/types';

export function useCourse(id: string) {
  return useQuery<Course>({
    queryKey: ['course', id],
    queryFn: async () => {
      const response = await apiRequest<{ data: Course }>({
        method: 'GET',
        url: COURSE_ROUTES.GET_BY_ID(id),
      });
      return response.data;
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}

export function useCourses(page: number = 1, limit: number = 9, category?: string) {
  return useQuery<CoursesResponse>({
    queryKey: ['courses', page, limit, category],
    queryFn: async () => {
      const response = await apiRequest<{ data: CoursesResponse }>({
        method: 'GET',
        url: COURSE_ROUTES.GET_ALL,
        params: { page, limit, category },
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useLatestCourses(limit: number = 6) {
  return useQuery<Course[]>({
    queryKey: ['courses', 'latest', limit],
    queryFn: async () => {
      const response = await apiRequest<{ data: Course[] }>({
        method: 'GET',
        url: COURSE_ROUTES.GET_LATEST,
        params: { limit },
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}