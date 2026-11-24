const mainImage = document.querySelector("#mainImage");
const caption = document.querySelector("#caption");
const search = document.querySelector("#search");
const empty = document.querySelector("#empty");
const prevButton = document.querySelector("#prev");
const nextButton = document.querySelector("#next");
const thumbnails = () => [...document.querySelectorAll(".thumb")];

let activeIndex = 0;

function visibleThumbnails() {
  return thumbnails().filter((thumb) => !thumb.hidden);
}

function selectThumb(thumb) {
  const visible = visibleThumbnails();
  activeIndex = Math.max(visible.indexOf(thumb), 0);

  mainImage.src = thumb.dataset.src;
  mainImage.alt = thumb.dataset.alt;
  caption.textContent = `${thumb.dataset.title} · ${thumb.dataset.location}`;

  thumbnails().forEach((item) => {
    item.classList.toggle("border-pink-400", item === thumb);
    item.classList.toggle("border-transparent", item !== thumb);
  });
}

function step(direction) {
  const visible = visibleThumbnails();
  if (visible.length === 0) return;
  activeIndex = (activeIndex + direction + visible.length) % visible.length;
  selectThumb(visible[activeIndex]);
}

thumbnails().forEach((thumb) => {
  thumb.addEventListener("click", () => selectThumb(thumb));
});

prevButton.addEventListener("click", () => step(-1));
nextButton.addEventListener("click", () => step(1));

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") step(-1);
  if (event.key === "ArrowRight") step(1);
});

search.addEventListener("input", () => {
  const query = search.value.trim().toLowerCase();

  thumbnails().forEach((thumb) => {
    const haystack = `${thumb.dataset.title} ${thumb.dataset.location} ${thumb.dataset.alt}`.toLowerCase();
    thumb.hidden = Boolean(query) && !haystack.includes(query);
  });

  const visible = visibleThumbnails();
  empty.classList.toggle("hidden", visible.length > 0);

  if (visible.length > 0 && !visible.includes(thumbnails()[activeIndex])) {
    activeIndex = 0;
    selectThumb(visible[0]);
  }
});
