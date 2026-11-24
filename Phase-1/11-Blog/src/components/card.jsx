import { Link } from "react-router-dom";

const Card = ({ name, image, description }) => (
  <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#dcc7b5] bg-white/80 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
    <img
      src={image}
      alt={`Portrait of ${name}`}
      loading="lazy"
      className="h-48 w-full object-cover sm:h-52"
    />
    <div className="flex flex-1 flex-col p-5">
      <h2 className="text-xl font-semibold">{name}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      <Link
        to={`/profile/${encodeURIComponent(name)}`}
        className="mt-5 inline-flex w-fit items-center rounded-full bg-[#8a6448] px-5 py-2 text-sm font-medium text-white hover:bg-[#6f4e37]"
      >
        Read story
      </Link>
    </div>
  </article>
);

export default Card;
