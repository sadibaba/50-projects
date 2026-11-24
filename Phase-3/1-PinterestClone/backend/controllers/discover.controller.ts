import { Response } from "express";
import Pin from "../models/pin.model";
import { AsyncRequest } from "../types/authRequest";
import { asyncHandler } from "../utils/http";

const categoryList = ["All", "Travel", "Interiors", "Food", "Fashion", "Art", "Nature", "Tech", "Wellness", "Photography", "Architecture", "Plants", "Books", "Reels"];

export const categories = asyncHandler(async (_req: AsyncRequest, res: Response) => {
  const counts = await Pin.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]);
  const map = new Map(counts.map((item: any) => [item._id, item.count]));
  res.json(categoryList.map((name) => ({ name, count: name === "All" ? counts.reduce((sum: number, item: any) => sum + item.count, 0) : map.get(name) || 0 })));
});

export const freeImages = asyncHandler(async (req: AsyncRequest, res: Response) => {
  const q = String(req.query.q || "inspiration").trim();
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 24, 1), 48);
  const heights = [760, 900, 1040, 820, 960];

  const results = Array.from({ length: limit }, (_, index) => {
    const height = heights[(index + page) % heights.length];
    const seed = encodeURIComponent(`${q}-${page}-${index}`);
    return {
      id: `free-${seed}`,
      title: `${q} inspiration ${index + 1}`,
      alt_description: `${q} inspiration`,
      urls: {
        regular: `https://picsum.photos/seed/${seed}/600/${height}`,
        small: `https://picsum.photos/seed/${seed}/400/${Math.round(height * 0.66)}`,
        thumb: `https://picsum.photos/seed/${seed}/200/300`,
      },
      user: { name: "Lorem Picsum", username: "picsum" },
      sourceName: "Picsum",
      sourceUrl: "https://picsum.photos",
      width: 600,
      height,
      likes: 0,
    };
  });

  res.json({ results, page, hasMore: page < 10, source: "Picsum (no API key required)" });
});
