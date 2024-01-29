import { encryptPassword } from "@/utils/encryptPassword";
import clientPromise from "@/utils/mongodb";
import userSchema from "./models/userSchema"; 

export default async function registerUser(req, res) {
    if (req.method === "POST") {
        try {
            let { email, password } = req.body;
            email = email.toLowerCase();

          if (!email && !password) {
            res.status(405).json(
              {
                message:'Please,provide your email and password'
              }
            )
          }

            const client = await clientPromise;
            const db = client.db("e-learning");

            const existingUser = await db.collection("users").findOne({ email: email });
            if (existingUser) {
                return res.status(409).json({ message: "Email already exists" });
            }

            const hashedPassword = await encryptPassword(password);

           
            const newUser = {
                ...userSchema,
                
                email: email,
                password: hashedPassword
            };

            await db.collection("users").insertOne(newUser);

            res.status(200).json({ message: "User registered successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}


