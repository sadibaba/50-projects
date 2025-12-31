import Card from "./card";

const cardData = [
  {
    name: "Sophia",
    image:
      "https://plus.unsplash.com/premium_photo-1668485966810-cbd0f685f58f?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Discover amazing travel stories and insights from around the world...",
  },
  {
    name: "Liam",
    image:
      "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?q=80&w=465&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Explore breathtaking landscapes and cultural adventures with Liam...",
  },
  {
    name: "Ava",
    image:
      "https://images.unsplash.com/photo-1604004555489-723a93d6ce74?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Join Ava on her journey through hidden gems and local flavors...",
  },
  {
    name: "Noah",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Embark with Noah on thrilling adventures across mountains and seas, capturing stories of courage and discovery..."
  },
  {
  name: "Emma",
  image: "https://images.unsplash.com/photo-1586351012965-861624544334?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  description: "Follow Emma as she uncovers artistic corners of cities and shares creative inspirations..."
},
{
  name: "Oliver",
  image: "https://plus.unsplash.com/premium_photo-1668319914124-57301e0a1850?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  description: "Join Oliver on thrilling treks through forests and mountains, capturing nature’s raw beauty..."
},
{
  name: "Mia",
  image: "https://images.unsplash.com/photo-1601288496920-b6154fe3626a?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  description: "Discover Mia’s culinary adventures as she explores flavors and traditions across cultures..."
},
{
  name: "Ethan",
  image: "https://images.unsplash.com/photo-1615109398623-88346a601842?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  description: "Travel with Ethan through bustling cities and serene villages, finding stories in every corner..."
},
{
  name: "Isabella",
  image: "https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?q=80&w=436&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  description: "Join Isabella as she captures hidden gems and shares heartfelt travel diaries..."
},
{
  name: "James",
  image: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  description: "Explore James’s journey through history, architecture, and cultural wonders around the globe..."
},
{
  name: "Sophia Grace",
  image: "https://images.unsplash.com/photo-1464863979621-258859e62245?q=80&w=386&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  description: "Sophia Grace shares soulful travel experiences, blending storytelling with breathtaking visuals..."
},
{
  name: "Benjamin",
  image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  description: "Embark with Benjamin on cultural explorations, meeting people and traditions across continents..."
},
{
  name: "Charlotte",
  image: "https://images.unsplash.com/photo-1662351997685-57a21379d966?q=80&w=399&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  description: "Charlotte takes you on dreamy escapes, from seaside sunsets to mountain trails..."
},
{
  name: "Lucas",
  image: "https://images.unsplash.com/photo-1508341591423-4347099e1f19?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  description: "Lucas dives into adventure sports and adrenaline-filled journeys, sharing excitement at every step..."
}
];
const CardList = () => (
  <div className="h-screen w-screen flex justify-center items-center flex-wrap">
    {cardData.map((card, index) => (
      <Card key={index} {...card} />
    ))}
  </div>
);

export default CardList;
