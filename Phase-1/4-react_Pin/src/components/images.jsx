import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const API_KEY = import.meta.env.VITE_PIXABAY_API_KEY;

export default function ImageGallery() {
  const [query, setQuery] = useState("cars");
  const [searchTerm, setSearchTerm] = useState("cars");
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchImages = async (nextPage, term) => {
    if (!API_KEY) {
      setError("Add VITE_PIXABAY_API_KEY to a .env file to load images.");
      setHasMore(false);
      setLoading(false);
      return;
    }

    try {
      setError("");
      const response = await fetch(
        `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(term)}&image_type=photo&page=${nextPage}&per_page=20`
      );

      if (!response.ok) throw new Error("The image service did not respond.");

      const data = await response.json();
      const hits = Array.isArray(data.hits) ? data.hits : [];

      if (hits.length === 0) {
        setHasMore(false);
      } else {
        setImages((current) => {
          const seen = new Set(current.map((image) => image.id));
          return [...current, ...hits.filter((image) => !seen.has(image.id))];
        });
        setPage(nextPage + 1);
      }
    } catch (err) {
      setError(err.message || "Could not load images.");
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setImages([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
    fetchImages(1, query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleSearch = (event) => {
    event.preventDefault();
    const value = searchTerm.trim() || "cars";
    setQuery(value);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h1 className="text-xl font-semibold sm:text-2xl">Image Gallery</h1>
            <p className="text-sm text-slate-400">Photo search powered by Pixabay.</p>
          </div>

          <form onSubmit={handleSearch} className="flex w-full gap-2 sm:w-auto">
            <label htmlFor="search" className="sr-only">Search photos</label>
            <input
              id="search"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search photos"
              className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm outline-none focus:border-sky-400 sm:w-64"
            />
            <button
              type="submit"
              className="rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-400"
            >
              Search
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {error && (
          <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            {error}
          </div>
        )}

        {loading && images.length === 0 && (
          <p className="py-16 text-center text-slate-400">Loading images...</p>
        )}

        {!loading && images.length === 0 && !error && (
          <p className="py-16 text-center text-slate-400">No images found for this search.</p>
        )}

        <InfiniteScroll
          dataLength={images.length}
          next={() => fetchImages(page, query)}
          hasMore={hasMore}
          loader={<p className="py-6 text-center text-slate-400">Loading more...</p>}
          endMessage={
            images.length > 0 && (
              <p className="py-6 text-center text-slate-500">End of results.</p>
            )
          }
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {images.map((image) => (
              <figure
                key={image.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
              >
                <img
                  src={image.webFormatURL}
                  alt={image.tags || "Pixabay photo"}
                  loading="lazy"
                  className="h-48 w-full object-cover transition duration-300 hover:scale-105 sm:h-56"
                />
                <figcaption className="truncate px-3 py-2 text-xs text-slate-400">
                  {image.user ? `Photo by ${image.user}` : "Pixabay"}
                </figcaption>
              </figure>
            ))}
          </div>
        </InfiniteScroll>
      </main>
    </div>
  );
}
