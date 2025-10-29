import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Supporter from "@/models/Supporter";
import dbConnect from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
        const user = await Supporter.findOne({ email: credentials.email });
        if (user && (await bcrypt.compare(credentials.password, user.password))) {
          return { id: user._id.toString(), name: user.name, email: user.email };
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/support/login" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
