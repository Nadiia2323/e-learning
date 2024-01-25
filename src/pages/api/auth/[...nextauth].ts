

// pages/api/auth/[...nextauth].ts
import clientPromise from "@/utils/mongodb";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        // ...add more providers here
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            const dbClient = await clientPromise;
            const db = dbClient.db("e-learning");

            if (account.provider === "google") {
                // Check if user exists in your DB
                const existingUser = await db.collection("users").findOne({ email: user.email });
        
                if (existingUser) {
                    // Update user data if needed
                } else {
                    // Insert new user
                    await db.collection("users").insertOne({
                        name: user.name,
                        email: user.email,
                        image: user.image,
                    });
                }
            }
        }
    }
}

export default NextAuth(authOptions);

