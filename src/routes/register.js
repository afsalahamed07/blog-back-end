import { Router } from "express";
import prisma from "../config/prima.js";
import bcrypt from "bcryptjs";

const router = Router();

router.post("/", async (req, res) => {
  try {
    /** @type {import("@prisma/client").User} */
    const { name, username, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    /** @type {import("@prisma/client").User} */
    const user = await prisma.user.create({
      data: {
        name: name,
        username: username,
        email: email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "User registered successfully", ...user });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});

export { router as registerRouter };
