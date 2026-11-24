import bcrypt from "bcrypt";
import User from "../models/user.model";
import Pin from "../models/pin.model";
import Board from "../models/board.model";

const creators = [
  { username: "curator", name: "The Curator", bio: "Collections for a slower, more colourful life.", avatar: "https://picsum.photos/seed/curator-avatar/200/200" },
  { username: "maya", name: "Maya Khan", bio: "Interiors, light and small spaces.", avatar: "https://picsum.photos/seed/maya-avatar/200/200" },
  { username: "noah", name: "Noah Ali", bio: "Travel notes and film photography.", avatar: "https://picsum.photos/seed/noah-avatar/200/200" },
  { username: "aria", name: "Aria Sheikh", bio: "Food, ceramics and everyday rituals.", avatar: "https://picsum.photos/seed/aria-avatar/200/200" },
  { username: "leo", name: "Leo Martin", bio: "Design systems and desk setups.", avatar: "https://picsum.photos/seed/leo-avatar/200/200" },
];

const ideas: Array<{ title: string; category: string; tags: string[] }> = [
  { title: "Slow mornings in Lisbon", category: "Travel", tags: ["travel", "portugal", "slow living"] },
  { title: "Cliffside villages to add to your list", category: "Travel", tags: ["travel", "coast", "summer"] },
  { title: "A quiet weekend in the mountains", category: "Travel", tags: ["travel", "mountains", "weekend"] },
  { title: "Warm minimal living room", category: "Interiors", tags: ["interiors", "minimal", "living room"] },
  { title: "Small kitchen, big character", category: "Interiors", tags: ["interiors", "kitchen", "small space"] },
  { title: "A reading corner worth copying", category: "Interiors", tags: ["interiors", "reading", "cosy"] },
  { title: "Weeknight pasta with lemon", category: "Food", tags: ["food", "pasta", "dinner"] },
  { title: "Coffee and cardamom buns", category: "Food", tags: ["food", "baking", "coffee"] },
  { title: "Summer salad plates", category: "Food", tags: ["food", "salad", "summer"] },
  { title: "Neutral layers for autumn", category: "Fashion", tags: ["fashion", "autumn", "neutral"] },
  { title: "Vintage denim, modern fit", category: "Fashion", tags: ["fashion", "denim", "vintage"] },
  { title: "Everyday gold jewellery", category: "Fashion", tags: ["fashion", "jewellery", "minimal"] },
  { title: "Colour studies for a gallery wall", category: "Art", tags: ["art", "colour", "gallery"] },
  { title: "Sketchbook pages to inspire you", category: "Art", tags: ["art", "sketchbook", "drawing"] },
  { title: "Forest light and deep green", category: "Nature", tags: ["nature", "forest", "green"] },
  { title: "Ocean textures", category: "Nature", tags: ["nature", "ocean", "texture"] },
  { title: "Wildflowers in late summer", category: "Nature", tags: ["nature", "flowers", "summer"] },
  { title: "A clean desk setup", category: "Tech", tags: ["tech", "desk", "workspace"] },
  { title: "Small-space studio ideas", category: "Tech", tags: ["tech", "studio", "small space"] },
  { title: "A note-taking system that sticks", category: "Tech", tags: ["tech", "notes", "productivity"] },
  { title: "Morning stretch routine", category: "Wellness", tags: ["wellness", "morning", "stretch"] },
  { title: "Calm bedroom colours", category: "Wellness", tags: ["wellness", "bedroom", "calm"] },
  { title: "Street shadows and film grain", category: "Photography", tags: ["photography", "street", "film"] },
  { title: "Arched doorways and warm stone", category: "Architecture", tags: ["architecture", "arches", "stone"] },
  { title: "Concrete, light and shadow", category: "Architecture", tags: ["architecture", "concrete", "light"] },
  { title: "A plant shelf that works", category: "Plants", tags: ["plants", "shelf", "home"] },
  { title: "Balcony garden for small homes", category: "Plants", tags: ["plants", "balcony", "garden"] },
  { title: "Bookshop corners", category: "Books", tags: ["books", "bookshop", "reading"] },
  { title: "A reading list for the season", category: "Books", tags: ["books", "reading list", "autumn"] },
  { title: "Golden hour, every day", category: "Photography", tags: ["photography", "golden hour", "light"] },
];

const reels = [
  { title: "Slow motion florals", videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", seed: "reel-flower" },
  { title: "Underwater calm", videoUrl: "https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_1MB.mp4", seed: "reel-jellyfish" },
  { title: "Animated short: Sintel", videoUrl: "https://test-videos.co.uk/vids/sintel/mp4/h264/720/Sintel_720_10s_1MB.mp4", seed: "reel-sintel" },
  { title: "Big Buck Bunny, ten seconds", videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4", seed: "reel-bunny" },
  { title: "A very short adventure", videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4", seed: "reel-adventure" },
];

export const seedDatabase = async () => {
  if ((await Pin.countDocuments()) > 0) return;

  const password = await bcrypt.hash("demo12345", 10);
  const users = await User.insertMany(
    creators.map((creator) => ({
      ...creator,
      email: `${creator.username}@pinterest.local`,
      password,
      cover: `https://picsum.photos/seed/${creator.username}-cover/1200/400`,
    }))
  );

  const pins = ideas.map((idea, index) => {
    const height = [760, 900, 1040, 820, 960][index % 5];
    const seed = encodeURIComponent(`${idea.category.toLowerCase()}-${index + 1}`);
    return {
      ...idea,
      imageUrl: `https://picsum.photos/seed/${seed}/600/${height}`,
      sourceName: "Picsum",
      sourceUrl: "https://picsum.photos",
      createdBy: users[index % users.length]._id,
      width: 600,
      height,
      views: 80 + ((index * 37) % 900),
      commentsCount: index % 4,
    };
  });

  const imagePins = await Pin.insertMany(pins);

  const videoPins = reels.map((reel, index) => ({
    title: reel.title,
    description: "A short, looping idea pin. Tap to pause, save it for later.",
    imageUrl: `https://picsum.photos/seed/${reel.seed}/600/1060`,
    posterUrl: `https://picsum.photos/seed/${reel.seed}/600/1060`,
    videoUrl: reel.videoUrl,
    type: "video",
    category: "Reels",
    tags: ["reels", "video", "inspiration"],
    createdBy: users[(index + 1) % users.length]._id,
    width: 600,
    height: 1060,
    views: 120 + index * 240,
  }));
  await Pin.insertMany(videoPins);

  const boardSets = [
    { name: "Weekend ideas", description: "Small trips, long lunches and slow mornings.", owner: 0, pins: imagePins.slice(0, 8) },
    { name: "Home edit", description: "Warm rooms, useful objects, quiet colours.", owner: 0, pins: imagePins.slice(3, 11) },
    { name: "Recipes to try", description: "Weeknight cooking and weekend baking.", owner: 3, pins: imagePins.slice(6, 9) },
    { name: "Places to go", description: "Coastlines, mountains and city corners.", owner: 1, pins: imagePins.slice(0, 3) },
    { name: "Desk reset", description: "A calmer place to work.", owner: 4, pins: imagePins.slice(17, 20) },
  ];

  for (const set of boardSets) {
    await Board.create({
      name: set.name,
      description: set.description,
      cover: set.pins[0]?.imageUrl || "",
      createdBy: users[set.owner]._id,
      pins: set.pins.map((pin: any) => pin._id),
    });
  }

  console.log(`Seeded ${imagePins.length + videoPins.length} pins and ${boardSets.length} boards`);
};
