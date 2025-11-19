import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';

/**
 * Redirects to the login page if the user is not logged in.
 */
export const loggedInProtectedPage = (session: { user: { email: string; id: string; role: Role } } | null) => {
  if (!session) {
    redirect('/auth/signin');
  }
};

/**
 * Redirects to the login page if the user is not logged in.
 * Redirects to the not-authorized page if the user is not an admin.
 */
export const adminProtectedPage = (session: { user: { email: string; id: string; role: Role } } | null) => {
  loggedInProtectedPage(session);
  if (session && session.user.role !== Role.ADMIN) {
    redirect('/not-authorized');
  }
};
