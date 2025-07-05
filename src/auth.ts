import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { connectToDatabase } from "./app/lib/mongodb";
import User from "@/app/models/user";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await connectToDatabase();
          
          // Find user by email
          let dbUser = await User.findOne({ email: user.email });
          if (!dbUser) {
            // Create user if not exists
            dbUser = await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              googleId: account.providerAccountId,
            });
          } else {
            // Update Google ID if missing
            if (!dbUser.googleId && account.providerAccountId) {
              dbUser.googleId = account.providerAccountId;
              await dbUser.save();
            }
          }
          return true;
        } catch (error) {
          console.error("Database error during sign in:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session }) {
      if (session.user?.email) {
        try {
          await connectToDatabase();
          const dbUser = await User.findOne({ email: session.user.email });
          if (dbUser) {
            session.user.id = dbUser._id.toString();
            session.user.role = dbUser.role || "user";
            session.user.name = dbUser.name;
            session.user.image = dbUser.image;
          }
        } catch (error) {
          console.error("Database error during session:", error);
        }
      }
      return session;
    },
  },
}); 