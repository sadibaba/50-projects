import { useParams } from "react-router-dom";
import { cardData } from "./cardList";

const profile = () => {
  const { name } = useParams();
   const profile = cardData.find(
    card => card.name.toLowerCase() === name.toLowerCase()
  );

  if (!profile)
    return (
      <div className="text-3xl font-extrabold text-white mt-20">
        Profile Not found
      </div>
    );
  return (
    <div className=" mt-44 flex flex-col items-center justify-center bg-[#d6a68d] p-8">
      <img
        src={profile.image}
        alt={profile.name}
        className="w-64 h-64 object-cover rounded-full mb-6 mt-6"
      />
      <h1 className="text-3xl font-bold mb-4">{profile.name}</h1>
      <p className="text-lg  max-w-xl text-center bg-gray-700 rounded-3xl">{profile.description}</p>
      <p className="text-md  max-w-2xl text-justify leading-relaxed bg-gray-500 rounded ">
        {profile.story}
      </p>
    </div>
  );
};

export default profile;
