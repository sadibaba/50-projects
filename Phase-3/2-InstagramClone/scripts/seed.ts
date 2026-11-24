import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User";
import Post from "../models/Post";
import Comment from "../models/Comment";
import Story from "../models/Story";

const people = [
  { username: "demo", name: "Demo User", bio: "Photos, small moments and slow mornings.", avatar: "https://picsum.photos/seed/lumen-demo/240/240" },
  { username: "maya", name: "Maya Khan", bio: "Light, interiors and quiet corners.", avatar: "https://picsum.photos/seed/lumen-maya/240/240" },
  { username: "noah", name: "Noah Ali", bio: "Travel notes and film grain.", avatar: "https://picsum.photos/seed/lumen-noah/240/240" },
  { username: "aria", name: "Aria Sheikh", bio: "Food, ceramics and everyday rituals.", avatar: "https://picsum.photos/seed/lumen-aria/240/240" },
  { username: "leo", name: "Leo Martin", bio: "Desks, design systems and coffee.", avatar: "https://picsum.photos/seed/lumen-leo/240/240" },
];

const posts = [
  { seed: "lumen-1", caption: "A quiet corner, a good book and nowhere to be.", tags: ["interiors", "books", "slowliving"], location: "Home", alt: "A soft reading corner with a chair and lamp" },
  { seed: "lumen-2", caption: "Weekend train, window seat, no plans.", tags: ["travel", "weekend"], location: "Northbound", alt: "A train window with countryside outside" },
  { seed: "lumen-3", caption: "Pasta, lemon, too much parmesan. Correct.", tags: ["food", "pasta"], location: "Kitchen", alt: "A bowl of lemon pasta" },
  { seed: "lumen-4", caption: "Morning light does most of the decorating.", tags: ["interiors", "light"], location: "Living room", alt: "Sunlight falling across a minimal room" },
  { seed: "lumen-5", caption: "The coast was loud and the phone stayed in the bag.", tags: ["travel", "coast"], location: "Coast", alt: "Waves breaking on a rocky coast" },
  { seed: "lumen-6", caption: "Coffee number two. The desk is finally clear.", tags: ["desk", "coffee"], location: "Studio", alt: "A tidy desk with a coffee cup" },
  { seed: "lumen-7", caption: "Plants that survived the winter.", tags: ["plants", "home"], location: "Balcony", alt: "A shelf of green houseplants" },
  { seed: "lumen-8", caption: "A very small adventure.", tags: ["travel", "mountains"], location: "Trail", alt: "A mountain trail in soft light" },
  { seed: "lumen-9", caption: "Sunday baking, no recipe, good outcome.", tags: ["food", "baking"], location: "Kitchen", alt: "Freshly baked bread on a counter" },
  { seed: "lumen-10", caption: "Film grain makes even the bus stop look intentional.", tags: ["photography", "film"], location: "Street", alt: "A street scene with film grain" },
  { seed: "lumen-11", caption: "Colour study for the hallway wall.", tags: ["art", "colour"], location: "Studio", alt: "Abstract colour studies on paper" },
  { seed: "lumen-12", caption: "The quietest room in the city.", tags: ["books", "library"], location: "Library", alt: "Shelves in a quiet library" },
];

const reels = [
  { title: "Slow motion florals", video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", seed: "reel-flower" },
  { title: "Underwater calm", video: "https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_1MB.mp4", seed: "reel-jelly" },
  { title: "A short adventure", video: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4", seed: "reel-bunny" },
  { title: "Animated frames", video: "https://test-videos.co.uk/vids/sintel/mp4/h264/720/Sintel_720_10s_1MB.mp4", seed: "reel-sintel" },
];

async function main() {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is required");
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is required");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");

  if (await Post.countDocuments()) {
    console.log("Seed skipped: posts already exist");
    await mongoose.disconnect();
    return;
  }

  const password = await bcrypt.hash("demo12345", 12);
  const users = await User.insertMany(
    people.map((person, index) => ({
      ...person,
      email: index === 0 ? "demo@lumen.local" : `${person.username}@lumen.local`,
      password,
    }))
  );

  const created = [];
  for (let index = 0; index < posts.length; index += 1) {
    const item = posts[index];
    const height = [760, 900, 1040, 820][index % 4];
    created.push(
      await Post.create({
        author: users[index % users.length]._id,
        imageUrl: `https://picsum.photos/seed/${item.seed}/700/${height}`,
        caption: item.caption,
        altText: item.alt,
        location: item.location,
        tags: item.tags,
        likes: users.slice(0, (index % users.length) + 1).map((user) => user._id),
      })
    );
  }

  for (let index = 0; index < reels.length; index += 1) {
    const reel = reels[index];
    const post = await Post.create({
      author: users[(index + 1) % users.length]._id,
      imageUrl: `https://picsum.photos/seed/${reel.seed}/700/1100`,
      videoUrl: reel.video,
      type: "video",
      caption: reel.title,
      altText: "A short video",
      tags: ["reels", "video"],
      likes: [users[0]._id],
    });
    created.push(post);
  }

  const demo = users[0];
  const following = users.slice(1, 4).map((user) => user._id);
  demo.following = following;
  for (const id of following) {
    const target = users.find((user) => String(user._id) === String(id));
    if (target) target.followers.push(demo._id);
  }
  for (const user of users) await user.save();

  const commentTexts = ["This is beautiful.", "Saving this for later.", "The light here is perfect.", "Where was this taken?"];
  for (let index = 0; index < 8; index += 1) {
    const post = created[index % created.length];
    await Comment.create({
      post: post._id,
      user: users[(index + 1) % users.length]._id,
      text: commentTexts[index % commentTexts.length],
    });
    post.commentsCount += 1;
    await post.save();
  }

  for (let index = 0; index < 4; index += 1) {
    await Story.create({
      user: users[index % users.length]._id,
      imageUrl: `https://picsum.photos/seed/story-${index + 1}/700/1100`,
      caption: index === 0 ? "Morning light" : "",
      expiresAt: new Date(Date.now() + (23 - index) * 60 * 60 * 1000),
    });
  }

  console.log(`Seeded ${users.length} users, ${created.length} posts and 4 stories`);
  console.log("Demo login: demo@lumen.local / demo12345");
  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error.message);
  await mongoose.disconnect();
  process.exit(1);
});
