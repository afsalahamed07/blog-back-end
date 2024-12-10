import { Router } from "express";
import generateToken from "../config/auth.js";
import prisma from "../config/prima.js";
import bcrypt from "bcryptjs";

const router = Router();

// Login a user
router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user);

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

export { router as loginRouter };
