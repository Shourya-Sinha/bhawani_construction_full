import express from "express";

const router = express.Router();
// Static Method
export const RPOST = (routePath, ...controller) => {
  router.post(`/${routePath}`, ...controller);
};

export const RPUT = (routePath, ...controller) => {
  router.put(`/${routePath}`, ...controller);
};

export const RGET = (routePath, ...controller) => {
  router.get(`/${routePath}`, ...controller);
};

export const RDELETE = (routePath, ...controller) => {
  router.delete(`/${routePath}`, ...controller);
};

export default router;