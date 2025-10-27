import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          const responseData = await res.json();

          if (!res.ok || responseData.status !== "SUCCESSFUL") {
            throw new Error(responseData.message || "Invalid credentials");
          }
          const user = {
            id: responseData.data.userId,
            email: responseData.data.email,
            name: `${responseData.data.firstName} ${responseData.data.lastName}`,
            image: responseData.data.profilePictureUrl,
            accessToken: responseData.data.accessToken,
            refreshToken: responseData.data.refreshToken,
          };

          return user;
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Authentication failed";
          console.error("Authorize Error:", message);
          throw new Error(message);
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.accessToken = token.accessToken;
        session.user.refreshToken = token.refreshToken;
      }
      return session;
    },
  },
};
