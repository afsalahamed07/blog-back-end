import express, { json } from "express";
import "dotenv/config";
import { loginRouter } from "./routes/login.js";
import { registerRouter } from "./routes/register.js";
import passport from "./config/passport-config.js";

const app = new express();

app.use(json());

// Middleware to protect routes globally, except for login and register
app.use((req, res, next) => {
  const publicRoutes = ["/login", "/register", "/error"]; // Add your public routes here
  if (publicRoutes.includes(req.path)) {
    return next(); // Skip authentication for public routes
  }
  // Authenticate user using Passport
  return passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) return next(err); // Forward errors
    if (!user) {
      // If authentication fails
      return res.status(401).json({ message: "Unauthorized" });
    }
    // Attach user to the request and proceed
    req.user = user;
    return next();
  })(req, res, next);
});

app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.get("/protected", (req, res) => res.status(200).json(req.user));

const PORT = process.env.PORT;
app.listen(PORT, function (err) {
  if (err) console.log("Error in server setup");
  console.log("Server listening on Port", PORT);
});
