/* eslint-disable arrow-body-style */
import { compare } from 'bcrypt';
import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';

const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Login with Email or Username and Password',
      credentials: {
        identifier: { label: 'Email/Username', type: 'text', placeholder: 'john or john@hawaii.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials.password) {
          console.error('Missing email/username or password');
          return null;
        }
        // Find user by identifier (email or username)
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { UHemail: credentials.identifier },
              { username: credentials.identifier },
            ],
          },
        });
        if (!user) {
          console.error(`User not found: ${credentials.identifier}`);
          return null;
        }
        // Compare hashed password
        const isPasswordValid = await compare(credentials.password, user.password);
        if (!isPasswordValid) {
          console.error(`Invalid password for: ${credentials.identifier}`);
          return null;
        }
        // Return user info for session
        return {
          id: `${user.id}`,
          email: user.UHemail,
          username: user.username,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    // error: '/auth/error',
    // verifyRequest: '/auth/verify-request',
    // newUser: '/auth/new-user'
  },
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        id: token.id,
        email: session.user?.email,
        username: token.username,
        role: token.role,
      },
    }),
    jwt: ({ token, user }) => {
      if (user) {
        const u = user as any;
        return {
          ...token,
          id: u.id,
          username: u.username,
          role: u.role,
        };
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
