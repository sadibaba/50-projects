import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const API_KEY = "38399436-3543456350649b24405b09e4c";

function PinterestGallery() {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchImages = async (currentPage) => {
    try {
      const response = await fetch(
        `https://pixabay.com/api/?key=${API_KEY}&q=cars&image_type=photo&page=${currentPage}&per_page=20`
      );
      const data = await response.json();

      if (data.hits.length === 0) {
        setHasMore(false);
        return;
      }

      setImages((prev) => [...prev, ...data.hits]);
      setPage(currentPage + 1);
    } catch (error) {
      console.error("Error fetching images:", error);
      setHasMore(false);
    }
  };

  useEffect(() => {
    fetchImages(page); // initial load
  }, []);

  return (
    <InfiniteScroll
      dataLength={images.length}
      next={() => fetchImages(page)}
      hasMore={hasMore}
      loader={<h4 className="text-center text-white">Loading...</h4>}
      endMessage={<p className="text-center text-white"><b>No more images</b></p>}
      className="bg-blue-950"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        {images.map((img) => (
          <div key={img.id} className="mb-4">
            <img
              src={img.webformatURL}
              alt={img.tags}
              className="w-full h-auto rounded-lg shadow"
            />
          </div>
        ))}
      </div>
    </InfiniteScroll>
  );
}

export default PinterestGallery;