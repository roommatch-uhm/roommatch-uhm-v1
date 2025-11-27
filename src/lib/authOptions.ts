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
      name: 'Email and Password',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'john@foo.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          console.error('Missing email or password');
          return null;
        }
        // Find user by UHemail
        const user = await prisma.user.findUnique({
          where: { UHemail: credentials.email },
        });
        if (!user) {
          console.error(`User not found: ${credentials.email}`);
          return null;
        }
        // Compare hashed password
        const isPasswordValid = await compare(credentials.password, user.password);
        if (!isPasswordValid) {
          console.error(`Invalid password for: ${credentials.email}`);
          return null;
        }
        // Return user info for session
        return {
          id: `${user.id}`,
          email: user.UHemail,
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
        ...session.user,
        id: token.id,
        role: token.role,
      },
    }),
    jwt: ({ token, user }) => {
      if (user) {
        const u = user as any;
        return {
          ...token,
          id: u.id,
          role: u.role,
        };
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
