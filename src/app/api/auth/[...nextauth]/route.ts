import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import authOptions from '@/lib/authOptions';

const handler = NextAuth({
  ...authOptions,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        UHemail: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        console.log('authorize called', { credentials });
        if (!credentials?.UHemail || !credentials?.password) {
          console.log('missing credentials');
          return null;
        }

        const user = await prisma.user.findUnique({ where: { UHemail: credentials.UHemail } });
        console.log('found user?', !!user, user?.UHemail);
        if (!user) return null;

        const valid = await compare(credentials.password, user.password);
        console.log('password valid?', valid);
        if (!valid) return null;

        return { id: String(user.id), name: user.username, email: user.UHemail };
      },
    }),
  ],
});

export { handler as GET, handler as POST };
