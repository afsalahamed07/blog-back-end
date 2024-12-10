import jsonwebtoken from "jsonwebtoken";
import "dotenv/config";

/**
 * @param {import("@prisma/client").User} user
 */
function generateToken(user) {
  const payload = { id: user.id, username: user.username };
  const secret = process.env.JWT_SECRET;
  const options = { expiresIn: "1h" };
  return jsonwebtoken.sign(payload, secret, options);
}

export default generateToken;
