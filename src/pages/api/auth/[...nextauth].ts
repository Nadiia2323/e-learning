

import clientPromise from "@/utils/mongodb";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from 'next-auth/providers/credentials';
import { verifyPassword } from "@/utils/encryptPassword";
import { UserModel } from '@/models/Schemas';

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text" },
                password:  { label: "Password", type: "password" }
            },
            authorize: async (credentials) => {
                const dbClient = await clientPromise;
                const db = dbClient.db("e-learning");
                const user = await db.collection("users").findOne({ email: credentials.email });

                if (user && await verifyPassword(credentials.password, user.password)) {
                    return { id: user._id, name: user.name, email: user.email };
                } else {
                    return null;
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            const dbClient = await clientPromise;
            const db = dbClient.db("e-learning");
            const existingUser = await db.collection("users").findOne({ email: user.email });
            //!USERMODEL DOESNR WORK

          if (existingUser) {
    await db.collection("users").updateOne(
        { email: user.email },
        { $set: { lastLogin: new Date() } } 
    );
    return true;
} else {
    await db.collection("users").insertOne({
        name: user.name,
        email: user.email,
        image: user.image, 
        lastLogin: new Date(),
    });
    return true;
}
        }
    }
}

export default NextAuth(authOptions);


