export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL;

export const CLIENT_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  COURSES: "/courses",
  PURCHASE: "/purchase",
  MY_COURSES: "/my-courses",
  MANAGE_REFERRALS: "/manage-referrals",
} as const;
