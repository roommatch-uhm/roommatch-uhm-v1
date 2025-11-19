import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';

/**
 * Redirects to the login page if the user is not logged in.
 */
export const loggedInProtectedPage = (
  session: { user: { email: string; id: string; role: Role } } | null,
  // optional path to return to after signin (e.g. '/create')
  callbackPath?: string,
) => {
  if (!session) {
    const callback = callbackPath ? `?callbackUrl=${encodeURIComponent(callbackPath)}` : '';
    redirect(`/auth/signin${callback}`);
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
