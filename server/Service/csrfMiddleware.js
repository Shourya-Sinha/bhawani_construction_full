// csrfMiddleware.js
import crypto from "crypto";
import dotenv from 'dotenv';
dotenv.config();

const isProd = process.env.NODE_ENV === "production";
const CSRF_COOKIE_NAME = "csrfToken";
const CSRF_HEADER_NAME = "x-csrf-token";

export function generateCsrfToken(req, res, next) {
  const token = crypto.randomBytes(24).toString("hex");

  res.cookie(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    maxAge: 3600000, // 1 hour
  });

  res.locals.csrfToken = token;
  next();
}

export function verifyCsrfToken(req, res, next) {
    if (process.env.NODE_ENV !== "production") {
    // Disable CSRF check in dev
    return next();
  }
  const tokenFromCookie = req.cookies[CSRF_COOKIE_NAME];
  const tokenFromHeader =
    req.headers["x-csrf-token"] || req.headers["X-CSRF-Token"];

  if (!tokenFromCookie || !tokenFromHeader) {
    return res.status(403).json({ error: "Missing CSRF token" });
  }

  if (tokenFromCookie !== tokenFromHeader) {
    return res.status(403).json({ error: "Invalid CSRF token" });
  }

  next();
}
