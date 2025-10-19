import { BASE_URL } from './index';

const COURSES_BASE = `${BASE_URL}/api/courses`;

export const COURSE_ROUTES = {
  GET_ALL: COURSES_BASE,
  GET_BY_ID: (id: string) => `${COURSES_BASE}/${id}`,
  GET_LATEST: `${COURSES_BASE}/latest`,
} as const;
