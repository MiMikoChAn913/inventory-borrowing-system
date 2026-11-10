import bcrypt from "bcryptjs";
import { config, SESSION_COOKIE } from "./config.js";
import { AppError, forbidden } from "./errors.js";
import { createSessionToken, hashSessionToken } from "./security.js";

const publicUser = (user) => ({
  id: user.id,
  email: user.email,
  displayName: user.displayName,
  role: user.role,
});

export const createAuth = (db) => ({
  async login(email, password) {
    const user = await db.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new AppError(401, "INVALID_CREDENTIALS", "Email or password is incorrect.");
    }

    const token = createSessionToken();
    const expiresAt = new Date(Date.now() + config.sessionTtlHours * 60 * 60 * 1000);
    await db.session.create({
      data: { tokenHash: hashSessionToken(token), userId: user.id, expiresAt },
    });
    return { token, expiresAt, user: publicUser(user) };
  },

  async logout(token) {
    if (!token) return;
    await db.session.deleteMany({ where: { tokenHash: hashSessionToken(token) } });
  },

  async authenticate(token) {
    if (!token) throw new AppError(401, "UNAUTHENTICATED", "Please sign in.");
    const session = await db.session.findUnique({
      where: { tokenHash: hashSessionToken(token) },
      include: { user: true },
    });
    if (!session || session.expiresAt <= new Date()) {
      if (session) await db.session.delete({ where: { id: session.id } });
      throw new AppError(401, "UNAUTHENTICATED", "The session is invalid or expired.");
    }
    return publicUser(session.user);
  },
});

export const requireRole = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) return next(forbidden("Your role cannot perform this operation."));
  next();
};

export const cookieOptions = (expiresAt) => ({
  httpOnly: true,
  sameSite: "lax",
  secure: config.cookieSecure,
  expires: expiresAt,
  path: "/",
});

export const clearCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: config.cookieSecure,
  path: "/",
};

export { SESSION_COOKIE };
