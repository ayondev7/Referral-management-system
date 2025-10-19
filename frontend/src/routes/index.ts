export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL;

export const CLIENT_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  COURSES: "/courses",
  PURCHASE: "/purchase",
} as const;
