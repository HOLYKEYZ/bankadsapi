import { Hono } from "hono";
import { createAd, serveAds, trackImpression } from "./ads-controllers";
import { authenticate } from "../../common/middleware/auth-middleware";

const adsRoutes = new Hono();

// POST /ads/serve
adsRoutes.post("/serve", serveAds);
adsRoutes.post("/create", authenticate, createAd);
adsRoutes.post("/impression", trackImpression);

export default adsRoutes;
