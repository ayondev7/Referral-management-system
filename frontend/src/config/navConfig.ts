import { CLIENT_ROUTES } from '@/routes';

export interface NavLink {
  href: string;
  label: string;
}

export const NAV_LINKS: NavLink[] = [
  { href: CLIENT_ROUTES.DASHBOARD, label: 'Dashboard' },
  { href: CLIENT_ROUTES.COURSES, label: 'Courses' },
  { href: CLIENT_ROUTES.MY_COURSES, label: 'My Courses' },
  { href: CLIENT_ROUTES.MANAGE_REFERRALS, label: 'Manage Referrals' },
];
