import { Ads } from "./ads-models";
import { redis } from "../../config/redis";

export const serveAds = async (c: any) => {
  try {
    const { balance, channel = "ATM" } = await c.req.json();

    const getSegment = (balance: number) => {
      if (balance < 50000) return "low";
      if (balance < 200000) return "mass";
      if (balance < 1000000) return "affluent";
      return "hnw";
    };

    const segment = getSegment(balance);

    const cacheKey = `ad:${segment}:${channel}`;

    //Check cache
    const cached = await redis.get(cacheKey);

    if (cached) {
      return c.json(JSON.parse(cached));
    }

    //DB fallback
    const ad = await Ads.findOne({
      segments: segment,
      channels: channel,
      status: "active",
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    }).sort({ priority: -1 });

    if (!ad) {
      return c.json({ message: "No ad available" }, 404);
    }

    const response = {
      adId: ad._id,
      title: ad.title,
      imageUrl: ad.imageUrl,
      videoUrl: ad.videoUrl,
      cta: ad.cta,
    };

    //Cache for 60 seconds
    await redis.set(cacheKey, JSON.stringify(response), "EX", 60);

    return c.json(response);
  } catch (error) {
    return c.json({ error: "Failed to serve ad" }, 500);
  }
};

// Admin endpoint to create ads
export const createAd = async (c: any) => {
  try {
    const body = await c.req.json();
    if (
      !body.title ||
      !body.imageUrl ||
      !body.segments ||
      !body.startDate ||
      !body.endDate
    ) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const ads = await Ads.create(body);

    return c.json({
      message: "Ad created",
      ads,
    });
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to create ad" }, 500);
  }
};

//endpoint for tracking impressions from client side
export const trackImpression = async (c: any) => {
  try {
    const { adId } = await c.req.json();

    if (!adId) {
      return c.json({ error: "adId required" }, 400);
    }

    await Ads.updateOne({ _id: adId }, { $inc: { impressions: 1 } });

    return c.json({ message: "Impression recorded" });
  } catch (error) {
    return c.json({ error: "Failed to track impression" }, 500);
  }
};
