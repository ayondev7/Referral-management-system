export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Centralized client-side routes (used across the frontend)
export const CLIENT_ROUTES = {
	HOME: '/',
	LOGIN: '/login',
	REGISTER: '/register',
	DASHBOARD: '/dashboard',
		COURSES: '/courses',
		PURCHASE: '/purchase',
} as const;
