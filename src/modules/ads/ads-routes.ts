import { Hono } from "hono";
import { createAd, serveAds, trackImpression } from "./ads-controllers";
// import { authenticate } from "../../common/middleware/auth-middleware";
import { apiKeyAuth } from "../../common/middleware/apikey-auth";

const adsRoutes = new Hono();

// POST /ads/serve
adsRoutes.post("/serve", serveAds);
adsRoutes.post("/create", apiKeyAuth, createAd);
adsRoutes.post("/impression", apiKeyAuth, trackImpression);

export default adsRoutes;
