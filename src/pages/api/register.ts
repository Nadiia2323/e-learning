import { encryptPassword } from "@/utils/encryptPassword";
import clientPromise from "@/utils/mongodb"; 

export default async function registerUser(req, res) {
  if (req.method === "POST") {
    try {
        const { name,  password } = req.body;
         let { email } = req.body;
      
      email = email.toLowerCase();
      
      
      const client = await clientPromise;
      const db = client.db("e-learning"); 

      
      const existingUser = await db.collection("users").findOne({ email: email });
      if (existingUser) {
        return res.status(409).json({ message: "Email already exists" });
      }

     
      const hashedPassword = await encryptPassword(password);

     
      await db.collection("users").insertOne({
        name: name,
        email: email,
        password: hashedPassword,
      });

      res.status(200).json({ message: "User registered successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

