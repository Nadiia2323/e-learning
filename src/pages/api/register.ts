
import { UserModel } from '@/models/Schemas';
import dbConnect from '@/utils/dbConnect';

import { encryptPassword } from '@/utils/encryptPassword';

export default async function registerUser(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  await dbConnect();

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide both email and password.' });
  }

  try {
    
    const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists." });
    }

    
    const hashedPassword = await encryptPassword(password);

   
    const newUser = await UserModel.create({
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    return res.status(200).json({ message: "User registered successfully.", userId: newUser._id });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}



