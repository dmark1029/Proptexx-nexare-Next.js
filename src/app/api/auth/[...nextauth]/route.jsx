import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handler = (req, res) => NextAuth(req, res, {
	providers: [
		GoogleProvider({
			clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT,
			clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET,
		}),
	],
})
export { handler as GET, handler as POST };
