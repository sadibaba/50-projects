import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../api/api";

gsap.registerPlugin(ScrollTrigger);

/* ═══════ TUNING ═══════ */
const SCROLL_PER_POST = 70; // vh of scrolling per post (zyada = slow)
const TOP_OFFSET = 120; // px — navbar ke neeche se card shuru
const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=800";

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const PostOrbitalWheel = ({ posts }) => {
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const wheelRef = useRef(null);
  const triggerRef = useRef(null);
  const prevActiveRef = useRef(-1);
  const titleTrackRef = useRef(null);
  const titleViewportRef = useRef(null);
  const titleStartRef = useRef(null);
  const titleEndRef = useRef(null);
  const titleXToRef = useRef(null);
  const navigate = useNavigate();

  const [activeIndex, setActiveIndex] = useState(0);
  const [size, setSize] = useState({ w: 1200, h: 800 });

  const n = posts.length;

  /* viewport size (zoom in/out par bhi update hota hai) */
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const update = () =>
      setSize({ w: vp.clientWidth || 1200, h: vp.clientHeight || 800 });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(vp);
    return () => ro.disconnect();
  }, [n]);

  /* Layout — sab kuch screen height/width se nikalta hai, isliye zoom pe bhi fit */
  const itemHeight = clamp(size.h * 0.42, 240, 380);
  const itemWidth = clamp(itemHeight * 0.74, 170, 280);
  const radius = clamp(size.w * 0.85, 480, 1300);
  const stepAngle = (itemWidth * 1.12) / radius; // radians between neighbours
  const centerY = TOP_OFFSET + itemHeight / 2;

  const labels = useMemo(
    () => posts.map((p, i) => p.title || p.category || `Post ${i + 1}`),
    [posts],
  );

  /* ═══════ Main scroll animation ═══════ */
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const wheel = wheelRef.current;
    if (!section || !wheel || n === 0) return;

    const ctx = gsap.context(() => {
      const cards = Array.from(wheel.querySelectorAll(".pow-item"));
      const state = { pos: 0 };

      const render = (pos) => {
        cards.forEach((card, i) => {
          const off = i - pos;
          const d = Math.abs(off);

          // door ke cards render hi nahi karte (fast + clean)
          if (d > 4.6) {
            gsap.set(card, { autoAlpha: 0 });
            return;
          }

          const a = off * stepAngle;
          const x = Math.sin(a) * radius;
          const y = (1 - Math.cos(a)) * radius;
          const dd = Math.min(d, 2);

          gsap.set(card, {
            x,
            y,
            xPercent: -50,
            yPercent: -50,
            rotate: (a * 180) / Math.PI,
            scale: 1 - dd * 0.07,
            autoAlpha: clamp(1 - (d - 2.5) / 2, 0, 1),
            filter:
              dd < 0.05
                ? "none"
                : `blur(${dd * 2.2}px) brightness(${100 - dd * 26}%)`,
            zIndex: 100 - Math.round(d * 10),
          });
        });

        const idx = clamp(Math.round(pos), 0, n - 1);
        if (idx !== prevActiveRef.current) {
          prevActiveRef.current = idx;
          setActiveIndex(idx);
        }
      };

      render(0);
      if (n < 2) return;

      // scrub: 0.7 = scroll ke baad thora smooth catch-up (seamless feel)
      const tween = gsap.to(state, {
        pos: n - 1,
        ease: "none",
        onUpdate: () => render(state.pos),
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.7,
          snap: {
            snapTo: 1 / (n - 1),
            duration: { min: 0.2, max: 0.6 },
            delay: 0.08,
            ease: "power2.out",
          },
        },
      });
      triggerRef.current = tween.scrollTrigger;
    }, sectionRef);

    // layout settle hone ke baad positions dobara calculate
    const t = setTimeout(() => ScrollTrigger.refresh(), 350);

    return () => {
      clearTimeout(t);
      triggerRef.current = null;
      ctx.revert();
    };
  }, [n, radius, stepAngle]);

  /* ═══════ Title pills auto-center ═══════ */
  useLayoutEffect(() => {
    const vp = titleViewportRef.current;
    const track = titleTrackRef.current;
    if (!vp || !track || labels.length === 0) return;

    if (!titleXToRef.current) {
      titleXToRef.current = gsap.quickTo(track, "x", {
        duration: 0.6,
        ease: "power4.out",
        overwrite: true,
      });
    }

    const first = track.querySelector('[data-idx="0"]');
    const last = track.querySelector(`[data-idx="${labels.length - 1}"]`);
    const active = track.querySelector(`[data-idx="${activeIndex}"]`);
    if (!active || !first || !last) return;

    const vw = vp.clientWidth;
    if (titleStartRef.current)
      titleStartRef.current.style.width = `${Math.round(Math.max(0, vw / 2 - first.offsetWidth / 2))}px`;
    if (titleEndRef.current)
      titleEndRef.current.style.width = `${Math.round(Math.max(0, vw / 2 - last.offsetWidth / 2))}px`;

    const activeCenter = active.offsetLeft + active.offsetWidth / 2;
    let targetX = Math.round(vw / 2 - activeCenter);
    if (track.scrollWidth <= vw) {
      targetX = Math.round((vw - track.scrollWidth) / 2);
    } else {
      targetX = Math.round(clamp(targetX, vw - track.scrollWidth, 0));
    }
    titleXToRef.current(targetX);
  }, [activeIndex, labels, size.w]);

  /* Pill / side-card click → us post pe smooth scroll */
  const goTo = (index) => {
    const st = triggerRef.current;
    if (!st || n < 2) {
      setActiveIndex(index);
      return;
    }
    const to = st.start + (index / (n - 1)) * (st.end - st.start);
    const proxy = { s: st.scroll() };
    gsap.to(proxy, {
      s: to,
      duration: 0.9,
      ease: "power3.inOut",
      overwrite: true,
      onUpdate: () => st.scroll(proxy.s),
    });
  };

  if (n === 0) return null;

  const sectionHeight = 100 + (n - 1) * SCROLL_PER_POST; // vh

  return (
    <section
      ref={sectionRef}
      className="relative"
      // full-bleed: parent container se bahar nikal ke poori screen width
      style={{
        height: `${sectionHeight}vh`,
        width: "100vw",
        marginLeft: "calc(50% - 50vw)",
      }}
    >
      {/* sticky tabhi kaam karta hai jab koi ancestor overflow:hidden na ho */}
      <div
        ref={viewportRef}
        className="sticky top-0 h-screen w-full overflow-hidden"
      >
        {/* soft glow peeche focused card ke */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl"
          style={{
            top: centerY,
            width: itemWidth * 2.2,
            height: itemHeight * 1.2,
          }}
        />

        {/* Cards */}
        <div
          ref={wheelRef}
          className="absolute left-1/2 w-0"
          style={{ top: centerY, height: 0 }}
        >
          {posts.map((post, i) => (
            <figure
              key={post.id}
              className="pow-item absolute left-0 top-0 m-0 cursor-pointer overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/40"
              style={{
                width: itemWidth,
                height: itemHeight,
                willChange: "transform",
              }}
              onClick={() =>
                i === activeIndex ? navigate(`/blog/${post.id}`) : goTo(i)
              }
            >
              {/* <img
                src={post.image || FALLBACK_IMG}
                alt={post.title}
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_IMG;
                }}
              /> */}
              <img
                src={getImageUrl(post.image) || FALLBACK_IMG}
                alt={post.title}
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_IMG;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/25 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="inline-block rounded-full bg-accent/20 px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-accent backdrop-blur-sm">
                  {post.category}
                </span>
                <h3 className="mt-1.5 line-clamp-2 font-display text-lg leading-tight text-text-primary">
                  {post.title}
                </h3>
              </div>
            </figure>
          ))}
        </div>

        {/* Caption + pills + CTA */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[7vh] z-[200] flex flex-col items-center gap-3">
          <p className="text-xs tracking-[0.25em] text-text-secondary">
            {activeIndex + 1} / {n} · {posts[activeIndex]?.category}
          </p>

          <div
            ref={titleViewportRef}
            className="pointer-events-auto mx-auto w-[min(92vw,900px)] overflow-hidden py-1"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
              maskImage:
                "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
            }}
          >
            <div ref={titleTrackRef} className="flex w-max items-center">
              <span
                ref={titleStartRef}
                aria-hidden
                className="block h-px shrink-0"
              />
              {labels.map((label, i) => {
                const d = Math.abs(i - activeIndex);
                const opacity =
                  d === 0 ? 1 : d === 1 ? 0.55 : d === 2 ? 0.3 : 0.15;
                return (
                  <button
                    key={`${label}-${i}`}
                    data-idx={i}
                    onClick={() => goTo(i)}
                    style={{
                      opacity,
                      transform: `scale(${d === 0 ? 1 : 0.95})`,
                    }}
                    className={`mr-3 inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full border px-6 py-2 text-sm font-medium transition-all duration-300 ${
                      i === activeIndex
                        ? "border-accent/60 bg-accent/10 text-text-primary"
                        : "border-secondary/50 text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
              <span
                ref={titleEndRef}
                aria-hidden
                className="block h-px shrink-0"
              />
            </div>
          </div>

          <button
            onClick={() => navigate(`/blog/${posts[activeIndex]?.id}`)}
            className="pointer-events-auto mt-1 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-xs font-bold text-primary transition-all hover:scale-105 hover:bg-amber-300"
          >
            Read Story
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>

          {n > 1 && activeIndex === 0 && (
            <p className="animate-bounce text-[11px] text-text-secondary/70">
              ✦ scroll karo, posts ghoomengi ✦
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PostOrbitalWheel;
