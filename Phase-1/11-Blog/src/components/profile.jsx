import { Link, useParams } from "react-router-dom";
import { cardData } from "./cardList";

const Profile = () => {
  const { name } = useParams();
  const profile = cardData.find(
    (card) => card.name.toLowerCase() === String(name).toLowerCase()
  );

  if (!profile) {
    return (
      <div className="rounded-2xl border border-[#dcc7b5] bg-white/80 p-8 text-center">
        <h2 className="text-2xl font-semibold">Story not found</h2>
        <p className="mt-2 text-slate-600">That profile does not exist in this collection.</p>
        <Link
          to="/"
          className="mt-5 inline-flex rounded-full bg-[#8a6448] px-5 py-2 text-sm font-medium text-white hover:bg-[#6f4e37]"
        >
          Back to all stories
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-[#6f4e37] hover:underline"
      >
        <span aria-hidden="true">←</span> Back to all stories
      </Link>

      <header className="mt-6 flex flex-col items-center gap-5 rounded-3xl border border-[#dcc7b5] bg-white/80 p-6 text-center sm:flex-row sm:text-left">
        <img
          src={profile.image}
          alt={`Portrait of ${profile.name}`}
          className="h-28 w-28 rounded-full object-cover ring-4 ring-[#e8d3c1]"
        />
        <div>
          <h1 className="text-3xl font-bold">{profile.name}</h1>
          <p className="mt-2 text-slate-600">{profile.description}</p>
        </div>
      </header>

      <div className="mt-6 rounded-3xl border border-[#dcc7b5] bg-white/80 p-6 sm:p-8">
        <h2 className="text-lg font-semibold">Story</h2>
        <p className="mt-4 whitespace-pre-line text-base leading-8 text-slate-700">
          {profile.story}
        </p>
      </div>
    </article>
  );
};

export default Profile;
