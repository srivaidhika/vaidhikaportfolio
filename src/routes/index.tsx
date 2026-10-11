import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import movieImg from "@/assets/movie.jpg";
import shopImg from "@/assets/shop.jpg";
import newsImg from "@/assets/news.jpg";
import indiaImg from "@/assets/india.jpg";
import { LINKS, SKILLS } from "@/components/portfolio/data";
import { Block, CaseStudy } from "@/components/portfolio/CaseStudy";

const Sculpture = lazy(() => import("@/components/portfolio/Sculpture"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sri Vaidhika Kotha — Software Developer, CSE (AI & ML)" },
      { name: "description", content: "Portfolio of Sri Vaidhika Kotha — Java, Spring Boot and Flutter developer and CSE (AI & ML) student building software where engineering meets experience." },
      { property: "og:title", content: "Sri Vaidhika Kotha — Creative Engineering Lab" },
      { property: "og:description", content: "Backend APIs, Flutter interfaces and AI projects by Sri Vaidhika Kotha." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const CHAPTERS = [
  ["00", "Index", "top"],
  ["01", "About", "about"],
  ["02", "Experience", "experience"],
  ["03", "Work", "work"],
  ["04", "Map", "skills"],
  ["05", "Lab", "lab"],
  ["06", "Contact", "contact"],
] as const;

function Index() {
  const root = useRef<HTMLDivElement>(null);
  const [chapter, setChapter] = useState(0);
  const [progress, setProgress] = useState(0);

  // scroll choreography
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ctx: { revert: () => void } | undefined;
    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        CHAPTERS.forEach(([, , id], i) => {
          ScrollTrigger.create({ trigger: `#${id}`, start: "top 50%", end: "bottom 50%", onToggle: (s) => s.isActive && setChapter(i) });
        });
        ScrollTrigger.create({ start: 0, end: "max", onUpdate: (s) => setProgress(s.progress) });
        if (reduce) return;
        const mm = gsap.matchMedia();

        // hero type drift
        gsap.to("[data-hero-a]", { xPercent: -12, scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: true } });
        gsap.to("[data-hero-b]", { xPercent: 14, scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: true } });
        gsap.to("[data-hero-obj]", { scale: 0.7, yPercent: 30, scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: true } });
        gsap.utils.toArray<HTMLElement>("[data-hero-label]").forEach((el, i) => {
          gsap.fromTo(el, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, scrollTrigger: { trigger: "#top", start: `${8 + i * 6}% top`, end: `${16 + i * 6}% top`, scrub: true } });
        });

        // parallax type
        gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((el) => {
          gsap.to(el, { yPercent: Number(el.dataset["speed"]) * -40, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
        });

        // line reveals
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.from(el.children, { yPercent: 110, duration: 1.1, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: el, start: "top 85%" } });
        });

        // mask reveals + mono -> color
        gsap.utils.toArray<HTMLElement>("[data-mask]").forEach((el) => {
          gsap.fromTo(el, { clipPath: "inset(40% 20% 40% 20%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.out", scrollTrigger: { trigger: el, start: "top 90%", end: "top 30%", scrub: true } });
          const img = el.querySelector("img");
          if (img && el.dataset["mask"] === "color") gsap.fromTo(img, { filter: "grayscale(1)", scale: 1.2 }, { filter: "grayscale(0)", scale: 1, scrollTrigger: { trigger: el, start: "top 80%", end: "center 40%", scrub: true } });
        });

        // annotations
        gsap.utils.toArray<HTMLElement>("[data-note]").forEach((el) => {
          gsap.fromTo(el, { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, scrollTrigger: { trigger: el, start: "top 80%", end: "top 20%", toggleActions: "play reverse play reverse" } });
        });

        // timeline draw
        gsap.fromTo("[data-tl-line]", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: "#experience", start: "top 60%", end: "bottom 70%", scrub: true } });
        gsap.utils.toArray<HTMLElement>("[data-tl-node]").forEach((el) => {
          gsap.from(el, { scale: 0, duration: 0.6, ease: "back.out(3)", scrollTrigger: { trigger: el, start: "top 70%" } });
        });

        // seat grid lights
        gsap.from("[data-seat]", { opacity: 0.1, stagger: { each: 0.01, from: "random" }, scrollTrigger: { trigger: "#p01", start: "top 60%", end: "center center", scrub: true } });

        // horizontal panels (desktop only)
        mm.add("(min-width: 1024px)", () => {
          const track = document.querySelector<HTMLElement>("[data-htrack]");
          if (!track) return;
          gsap.to(track, {
            x: () => -(track.scrollWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: { trigger: "#p02", start: "top top", end: () => `+=${track.scrollWidth - window.innerWidth}`, pin: true, scrub: 0.6, invalidateOnRefresh: true },
          });
        });
      }, root);
    })();
    return () => ctx?.revert();
  }, []);

  return (
    <div ref={root} className="relative overflow-x-clip">
      <Cursor />
      <Nav chapter={chapter} progress={progress} />
      <Hero />
      <About />
      <Experience />
      <Work />
      <Skills />
      <Lab />
      <Contact />
    </div>
  );
}

/* ---------------- chrome ---------------- */

function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setOn(true);
    const pos = { x: -100, y: -100 }, cur = { x: -100, y: -100 };
    let raf = 0;
    const move = (e: PointerEvent) => {
      pos.x = e.clientX; pos.y = e.clientY;
      const t = e.target as HTMLElement;
      ref.current?.classList.toggle("is-hover", !!t.closest("a,button,summary,[data-hover]"));
    };
    const loop = () => {
      cur.x += (pos.x - cur.x) * 0.2; cur.y += (pos.y - cur.y) * 0.2;
      if (ref.current) ref.current.style.transform = `translate(${cur.x}px, ${cur.y}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move);
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", move); };
  }, []);
  return on ? <div ref={ref} className="cursor-dot" aria-hidden /> : null;
}

function Nav({ chapter, progress }: { chapter: number; progress: number }) {
  const [n, label] = CHAPTERS[chapter] ?? CHAPTERS[0];
  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 mix-blend-difference text-paper">
        <div className="flex items-start justify-between px-5 py-5 md:px-10">
          <a href="#top" className="pointer-events-auto meta">S·V·K / Lab</a>
          <nav className="pointer-events-auto hidden gap-6 md:flex">
            {CHAPTERS.slice(1).map(([num, l, id]) => (
              <a key={id} href={`#${id}`} className="meta link-underline"><span className="opacity-50">{num}</span> {l}</a>
            ))}
          </nav>
          <div className="meta text-right tabular-nums">
            <div className="text-2xl font-[family-name:var(--font-display)] tracking-tight normal-case">{n}</div>
            <div className="opacity-60">{label}</div>
          </div>
        </div>
      </header>
      <div className="fixed bottom-0 left-0 z-50 h-[2px] bg-volt" style={{ width: `${progress * 100}%` }} aria-hidden />
      <a href="#top" aria-label="Back to top" className={`meta fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full border border-current bg-background transition-all duration-500 md:right-10 ${progress > 0.08 ? "opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}>
        ↑ <span className="sr-only">Top</span>
      </a>
    </>
  );
}

function Magnetic({ children, href, download, external }: { children: React.ReactNode; href: string; download?: boolean; external?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  return (
    <a
      ref={ref}
      href={href}
      download={download}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        ref.current!.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
      }}
      onPointerLeave={() => { if (ref.current) ref.current.style.transform = ""; }}
      className="inline-flex items-center gap-3 rounded-full border border-current px-6 py-3 meta transition-[transform,background-color,color] duration-300 ease-out hover:bg-foreground hover:text-background"
    >
      {children}
    </a>
  );
}

/* ---------------- 00 hero ---------------- */

function Hero() {
  return (
    <section id="top" className="grain relative min-h-[100svh] overflow-hidden">
      <div className="grid-lines absolute inset-0 opacity-50 [mask-image:radial-gradient(circle_at_70%_40%,black,transparent_70%)]" aria-hidden />
      <div data-hero-obj className="absolute right-[-15%] top-[8%] h-[70vh] w-[70vh] md:right-[2%] md:top-[6%] md:h-[78vh] md:w-[78vh]">
        <Suspense fallback={null}><Sculpture className="h-full w-full" /></Suspense>
        <span data-hero-label className="meta absolute left-[8%] top-[20%] text-muted-foreground">↳ obj.icosa / n=162</span>
        <span data-hero-label className="meta absolute right-[10%] top-[48%] text-volt">◉ core.octa — rotating</span>
        <span data-hero-label className="meta absolute bottom-[18%] left-[22%] text-muted-foreground">x:0.42 y:-1.08 z:2.30</span>
      </div>

      <div className="relative flex min-h-[100svh] flex-col justify-end px-5 pb-10 pt-28 md:px-10">
        <div className="meta mb-6 grid max-w-md grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-muted-foreground">
          <span>[a]</span><span>Computer Science &amp; Engineering</span>
          <span>[b]</span><span>Artificial Intelligence &amp; Machine Learning</span>
          <span>[c]</span><span>Software Development</span>
        </div>
        <h1 className="font-[family-name:var(--font-display)] font-extrabold uppercase leading-[0.82] tracking-[-0.055em]">
          <span data-hero-a className="block text-[18vw] md:text-[14.5vw]">Sri Vaidhika</span>
          <span data-hero-b className="block pl-[8vw] text-[18vw] md:pl-[22vw] md:text-[14.5vw]">
            Kotha<span className="text-volt">.</span>
          </span>
        </h1>
        <div className="mt-8 flex flex-col justify-between gap-6 border-t border-border pt-5 md:flex-row md:items-end">
          <p className="max-w-lg font-[family-name:var(--font-serif)] text-3xl leading-tight md:text-4xl">
            I build software where <em className="text-volt">engineering</em> meets experience.
          </p>
          <a href="#about" className="meta group flex items-center gap-3">
            <span className="relative block h-10 w-[1px] overflow-hidden bg-border">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.6s_ease-in-out_infinite] bg-foreground" />
            </span>
            Scroll to explore
          </a>
        </div>
      </div>
      <style>{`@keyframes scrollcue{0%{transform:translateY(-100%)}100%{transform:translateY(200%)}}`}</style>
    </section>
  );
}

/* ---------------- 01 about ---------------- */

function About() {
  const facts = [
    ["Education", "B.Tech, CSE — AI & ML"],
    ["Institution", "Vignan's Institute of Management and Technology for Women (JNTUH)"],
    ["Graduation", "Expected 2027 · CGPA 8.25"],
    ["Current role", "Developer Intern, Cyberlearnix Pvt. Ltd."],
    ["Based in", "Hyderabad, India"],
  ];
  return (
    <section id="about" className="relative px-5 py-32 md:px-10 md:py-48">
      <p className="meta mb-16 text-muted-foreground">01 — About / the human behind the code</p>
      <div className="grid gap-16 md:grid-cols-12">
        <div className="md:col-span-7">
          <h2 data-reveal className="overflow-hidden font-[family-name:var(--font-display)] text-6xl font-bold leading-[0.9] tracking-[-0.04em] md:text-[7.5vw]">
            <span className="block">Curious by nature.</span>
            <span className="block font-[family-name:var(--font-serif)] font-normal italic text-volt">Practical by design.</span>
          </h2>
          <p className="mt-12 max-w-xl text-lg leading-relaxed md:ml-[16%]">
            I’m Sri Vaidhika Kotha, a Computer Science and Engineering student specializing in Artificial Intelligence and Machine Learning. My interests span backend engineering, frontend experiences, and AI-driven applications — from REST APIs in Spring Boot and PostgreSQL to Flutter interfaces and small machine-learning systems. I like understanding how things work underneath, then making them feel simple on the surface.
          </p>
        </div>
        <div className="relative md:col-span-5">
          <AbstractPortrait />
          <dl className="mt-10 divide-y divide-border border-y border-border">
            {facts.map(([k, v]) => (
              <div key={k} data-note className="grid grid-cols-[7rem_1fr] gap-4 py-3">
                <dt className="meta pt-1 text-muted-foreground">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <div data-speed="1.5" className="pointer-events-none absolute -right-10 bottom-10 select-none font-[family-name:var(--font-display)] text-[22vw] font-extrabold leading-none tracking-tighter text-foreground/[0.04]" aria-hidden>
        SVK
      </div>
    </section>
  );
}

function AbstractPortrait() {
  return (
    <figure className="relative aspect-[4/5] overflow-hidden bg-ink" data-mask>
      <svg viewBox="0 0 400 500" className="absolute inset-0 h-full w-full text-silver" aria-hidden>
        {Array.from({ length: 28 }).map((_, i) => (
          <ellipse key={i} cx="200" cy="230" rx={20 + i * 6} ry={28 + i * 8} fill="none" stroke="currentColor" strokeOpacity={0.08 + (i % 4) * 0.05} transform={`rotate(${i * 3} 200 230)`} />
        ))}
        <circle cx="200" cy="230" r="6" className="fill-volt" />
        <line x1="0" y1="230" x2="400" y2="230" stroke="currentColor" strokeOpacity=".2" strokeDasharray="2 6" />
        <line x1="200" y1="0" x2="200" y2="500" stroke="currentColor" strokeOpacity=".2" strokeDasharray="2 6" />
      </svg>
      <figcaption className="meta absolute bottom-4 left-4 right-4 flex justify-between text-silver">
        <span>fig.01 — self, abstracted</span><span>17.38°N 78.48°E</span>
      </figcaption>
    </figure>
  );
}

/* ---------------- 02 experience ---------------- */

function Experience() {
  const items = [
    {
      n: "E.01", org: "Cyberlearnix Pvt. Ltd.", role: "Developer Intern", when: "May 2026 — Present", project: "Movie Booking System",
      tech: ["Java", "Spring Boot", "Hibernate", "JPA", "PostgreSQL", "REST APIs", "Postman"],
      body: "Built the backend for a movie booking application: RESTful endpoints with full CRUD operations for movies and bookings, entity mapping and persistence through JPA/Hibernate on PostgreSQL. Tested and validated the APIs with Postman and debugged issues along the way, collaborating with the team through Git/GitHub within an SDLC process.",
      tag: "backend / persistence",
    },
    {
      n: "E.02", org: "Customer Super App", role: "Frontend → Full-stack Development", when: "Ongoing", project: "Unified shopping application",
      tech: ["Flutter", "Dart", "Spring Boot", "PostgreSQL", "REST APIs"],
      body: "Building the customer-facing mobile app for a unified shopping experience, based on customer requirements. I develop the Flutter (Dart) interface — authentication, product browsing and search, cart, orders and profile flows are in progress — and integrate it with the Spring Boot backend using responsive UI and clean-architecture practices.",
      tag: "interface / integration",
    },
  ];
  return (
    <section id="experience" className="env-dark grain relative px-5 py-32 md:px-10 md:py-48">
      <div className="flex items-end justify-between">
        <p className="meta text-muted-foreground">02 — Experience / schematic</p>
        <p className="meta hidden text-muted-foreground md:block">scale 1:1 · rev. 2026</p>
      </div>
      <h2 data-reveal className="mt-10 overflow-hidden font-[family-name:var(--font-display)] text-5xl font-bold tracking-[-0.04em] md:text-8xl">
        <span className="block">Show the work,</span>
        <span className="block font-[family-name:var(--font-serif)] font-normal italic text-muted-foreground">not just the title.</span>
      </h2>
      <div className="relative mt-24 md:ml-[12%]">
        <div data-tl-line className="absolute bottom-0 left-[7px] top-0 w-px origin-top bg-primary" aria-hidden />
        {items.map((it, i) => (
          <article key={it.n} className={`relative grid gap-8 pb-24 pl-12 md:grid-cols-12 ${i % 2 ? "md:pl-[18%]" : ""}`}>
            <span data-tl-node className="absolute left-0 top-2 grid h-[15px] w-[15px] place-items-center rounded-full border border-primary bg-background" aria-hidden>
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            <span data-note className="meta absolute -top-6 left-12 text-primary">{it.n} · {it.tag}</span>
            <div className="md:col-span-5">
              <p className="meta text-muted-foreground">{it.when}</p>
              <h3 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold uppercase tracking-tight md:text-4xl">{it.org}</h3>
              <p className="mt-1 font-[family-name:var(--font-serif)] text-2xl italic">{it.role}</p>
              <p className="meta mt-4 text-muted-foreground">Project → {it.project}</p>
            </div>
            <div className="md:col-span-7">
              <p className="max-w-xl text-lg leading-relaxed">{it.body}</p>
              <p className="meta mt-6 text-muted-foreground">{it.tech.join("  ·  ")}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------------- 03 work ---------------- */

function ProjectHead({ n, title, role, tech, className = "" }: { n: string; title: React.ReactNode; role: string; tech: string; className?: string }) {
  return (
    <div className={className}>
      <p className="meta opacity-70">Project {n} / {role}</p>
      <h3 className="mt-4 font-[family-name:var(--font-display)] font-extrabold uppercase leading-[0.85] tracking-[-0.04em]">{title}</h3>
      <p className="meta mt-5 opacity-70">{tech}</p>
    </div>
  );
}

function Work() {
  return (
    <section id="work" className="relative">
      <div className="px-5 pb-16 pt-32 md:px-10 md:pt-48">
        <p className="meta text-muted-foreground">03 — Selected work / five case studies</p>
        <h2 data-reveal className="mt-8 overflow-hidden font-[family-name:var(--font-display)] text-[17vw] font-extrabold uppercase leading-[0.8] tracking-[-0.06em] md:text-[12vw]">
          <span className="block">Built,</span>
          <span className="block pl-[20vw] font-[family-name:var(--font-serif)] font-normal normal-case italic tracking-[-0.03em] text-volt">tested, shipped.</span>
        </h2>
      </div>
      <P01 />
      <P02 />
      <P03 />
      <P04 />
      <P05 />
      <div className="border-t border-border px-5 py-10 md:px-10">
        <p className="meta text-muted-foreground">Also built — AI-Based Smart Helmet System for Rider Safety (Jan–Apr 2026): IoT + Arduino with IR and alcohol sensors, and a Python ML model for accident-risk prediction with emergency alerts.</p>
      </div>
    </section>
  );
}

function P01() {
  const rows = 8, cols = 14;
  return (
    <article id="p01" className="env-dark relative overflow-hidden px-5 py-28 md:px-10 md:py-40">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <ProjectHead n="01" role="Backend developer" tech="Java · Spring Boot · Hibernate · JPA · PostgreSQL · REST" title={<span className="text-6xl md:text-8xl">Movie<br />Booking<br /><span className="text-primary">System</span></span>} />
          <p className="mt-8 max-w-md text-lg leading-relaxed">A backend-focused booking system — the engine behind choosing a film, a show and a seat. Built during my internship with Java and Spring Boot.</p>
          <div className="mt-10" aria-hidden>
            <div className="meta mb-3 text-center text-muted-foreground">— screen —</div>
            <div className="mx-auto mb-5 h-1 w-3/4 rounded-full bg-primary/70 shadow-[0_0_40px_var(--color-primary)]" />
            <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
              {Array.from({ length: rows * cols }).map((_, i) => (
                <span key={i} data-seat className={`aspect-square rounded-[2px] ${[17, 18, 33, 47, 48, 49, 61, 76, 90].includes(i) ? "bg-primary" : "bg-muted-foreground/30"} ${i % cols === 3 || i % cols === 10 ? "mr-2" : ""}`} />
              ))}
            </div>
            <div className="meta mt-3 flex justify-between text-muted-foreground"><span>■ booked</span><span>POST /api/bookings</span></div>
          </div>
        </div>
        <div className="lg:col-span-7">
          <figure data-mask="color" className="relative aspect-[16/10] overflow-hidden">
            <img src={movieImg} alt="Dark cinema with rows of red seats under a projector beam" loading="lazy" width={1600} height={1008} className="h-full w-full object-cover" />
            <pre className="meta absolute bottom-4 left-4 hidden bg-background/80 p-4 normal-case leading-relaxed tracking-normal backdrop-blur md:block">{`@Entity class Booking {
  @Id @GeneratedValue Long id;
  @ManyToOne Movie movie;
  String seat; LocalDateTime show;
}`}</pre>
          </figure>
          <CaseStudy>
            <Block label="Objective">Provide a reliable backend for a movie booking application: manage movies and bookings through clean, consistent APIs.</Block>
            <Block label="Architecture">Spring Boot REST layer → service logic → JPA/Hibernate repositories → PostgreSQL.</Block>
            <Block label="My responsibilities">Designing RESTful endpoints with full CRUD for movies and bookings, entity mapping and persistence, testing and validating every endpoint with Postman, and debugging issues.</Block>
            <Block label="Stack">Java, Spring Boot, Hibernate, JPA, PostgreSQL, REST APIs, Postman, Git/GitHub.</Block>
          </CaseStudy>
        </div>
      </div>
    </article>
  );
}

function P02() {
  const panels = [
    { k: "Requirement", v: "One app for many shopping needs — designed from customer requirements." },
    { k: "Structure", v: "Auth → browse/search → product → cart → orders → profile." },
    { k: "Responsive", v: "Flutter layouts that adapt across phone sizes and orientations." },
    { k: "Integration", v: "Dart frontend wired to Spring Boot + PostgreSQL REST APIs." },
  ];
  return (
    <article id="p02" className="relative overflow-hidden bg-card lg:h-screen">
      <div data-htrack className="flex flex-col gap-10 px-5 py-24 md:px-10 lg:h-full lg:w-max lg:flex-row lg:items-center lg:gap-16 lg:py-0">
        <div className="lg:w-[34vw] lg:shrink-0">
          <ProjectHead n="02" role="Flutter developer · ongoing" tech="Flutter · Dart · Spring Boot · PostgreSQL" title={<span className="text-6xl md:text-[6.5vw]">Customer<br /><span className="font-[family-name:var(--font-serif)] font-normal normal-case italic text-volt">Super App</span></span>} />
          <p className="mt-6 max-w-md text-lg leading-relaxed">Frontend development for a unified shopping application that brings multiple shopping needs into a single customer experience.</p>
          <p className="meta mt-6 hidden text-muted-foreground lg:block">scroll → panels move sideways</p>
        </div>
        <figure data-mask className="relative aspect-[16/10] overflow-hidden lg:h-[70vh] lg:w-auto lg:shrink-0">
          <img src={shopImg} alt="Editorial arrangement of shopping products on off-white paper" loading="lazy" width={1600} height={1008} className="h-full w-full object-cover" />
        </figure>
        {panels.map((p, i) => (
          <div key={p.k} className="flex flex-col justify-between border border-border bg-background p-8 lg:h-[56vh] lg:w-[24vw] lg:shrink-0" style={{ marginTop: i % 2 ? "8vh" : 0 }}>
            <span className="meta text-muted-foreground">0{i + 1} / {p.k}</span>
            <PhoneSketch i={i} />
            <p className="text-lg leading-snug">{p.v}</p>
          </div>
        ))}
        <div className="lg:w-[30vw] lg:shrink-0 lg:pr-[10vw]">
          <CaseStudy>
            <Block label="Objective">Bring several shopping needs into one consistent customer app.</Block>
            <Block label="My role">Building the Flutter (Dart) interface end to end and integrating it with the Spring Boot backend.</Block>
            <Block label="In progress">Authentication, product browsing/search, cart, order and profile management. Work is ongoing; nothing here is claimed as finished.</Block>
            <Block label="Practices">Responsive UI, clean architecture, REST integration, Git collaboration.</Block>
          </CaseStudy>
        </div>
      </div>
    </article>
  );
}

function PhoneSketch({ i }: { i: number }) {
  return (
    <div className="mx-auto my-6 h-40 w-24 rounded-[14px] border border-foreground/60 p-2" aria-hidden>
      <div className="mb-2 h-2 w-8 rounded-full bg-foreground/20" />
      {i === 0 && <><div className="mt-6 h-3 rounded-sm bg-foreground/15" /><div className="mt-2 h-3 rounded-sm bg-foreground/15" /><div className="mt-4 h-4 rounded-sm bg-volt" /></>}
      {i === 1 && <div className="grid grid-cols-2 gap-1">{Array.from({ length: 6 }).map((_, k) => <div key={k} className={`h-7 rounded-sm ${k === 2 ? "bg-volt" : "bg-foreground/15"}`} />)}</div>}
      {i === 2 && <><div className="h-14 rounded-sm bg-foreground/15" /><div className="mt-2 h-2 w-2/3 rounded-sm bg-foreground/20" /><div className="mt-1 h-2 w-1/2 rounded-sm bg-foreground/20" /><div className="mt-5 h-4 rounded-sm bg-volt" /></>}
      {i === 3 && <div className="space-y-1.5 pt-2">{["GET", "POST", "PUT", "DEL"].map((m) => <div key={m} className="meta flex justify-between text-[7px]"><span className="text-volt">{m}</span><span>/api</span></div>)}</div>}
    </div>
  );
}

function P03() {
  return (
    <article className="relative px-5 py-28 md:px-10 md:py-40">
      <div className="border-y-4 border-double border-foreground py-3 text-center">
        <p className="meta">Vol. 03 · The Classifier Gazette · Aug–Sep 2025</p>
      </div>
      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h3 className="font-[family-name:var(--font-serif)] text-6xl leading-[0.92] tracking-tight md:text-[7vw]">
            Real or fake? <em className="text-volt">Reading</em> the news with a model.
          </h3>
          <p className="meta mt-6 text-muted-foreground">Project 03 / ML + web developer · Python · Multinomial Naive Bayes · NLP · Flask · SQLite</p>
          <div className="mt-10 columns-1 gap-8 text-[1.02rem] leading-relaxed md:columns-2">
            <p className="first-letter:float-left first-letter:mr-2 first-letter:font-[family-name:var(--font-serif)] first-letter:text-6xl first-letter:leading-none">
              An end-to-end NLP web application that classifies a news article as likely real or likely fake. Text goes through preprocessing and vectorization, then a Multinomial Naive Bayes model produces a prediction. A Flask interface accepts input, and SQLite stores prediction history and user activity.
            </p>
            <p className="mt-4">Like any statistical model, it estimates likelihoods learned from its training data — it can be wrong, and it is a study in classification rather than a final arbiter of truth.</p>
          </div>
          <div className="mt-10 space-y-3" aria-label="Illustrative classification indicators">
            {[["Article A", 0.82, "likely real"], ["Article B", 0.31, "likely fake"]].map(([l, v, t]) => (
              <div key={l as string} className="grid grid-cols-[6rem_1fr_6rem] items-center gap-4">
                <span className="meta">{l}</span>
                <span className="h-[3px] bg-border"><span className="block h-full bg-foreground" style={{ width: `${(v as number) * 100}%` }} /></span>
                <span className="meta text-muted-foreground">{t}</span>
              </div>
            ))}
            <p className="meta text-muted-foreground">↑ illustrative output, not measured accuracy</p>
          </div>
          <CaseStudy>
            <Block label="Workflow">Input text → cleaning & tokenization → vectorization → Multinomial Naive Bayes → real/fake label → stored in SQLite.</Block>
            <Block label="Interface">Interactive Flask web pages with prediction history and user activity tracking.</Block>
          </CaseStudy>
        </div>
        <figure data-mask className="relative overflow-hidden lg:col-span-5">
          <img src={newsImg} alt="Stack of folded newspapers in black and white" loading="lazy" width={1200} height={1504} className="h-full w-full object-cover object-bottom grayscale contrast-125" />
          <figcaption className="meta absolute left-3 top-3 bg-background px-2 py-1">input.corpus</figcaption>
        </figure>
      </div>
    </article>
  );
}

function P04() {
  return (
    <article className="relative overflow-hidden bg-saffron text-ink">
      <div className="grid lg:grid-cols-2">
        <figure data-mask="color" className="relative min-h-[70vh] overflow-hidden">
          <img src={indiaImg} alt="Silk saree with gold border beside laddoos, jalebi and marigolds" loading="lazy" width={1200} height={1504} className="absolute inset-0 h-full w-full object-cover" />
        </figure>
        <div className="flex flex-col justify-center px-5 py-20 md:px-14">
          <p className="meta">Project 04 / Web developer · Feb–Jun 2025</p>
          <h3 className="mt-6 font-[family-name:var(--font-serif)] text-6xl leading-[0.9] md:text-8xl">
            Traditional<br /><span className="italic">Culture</span> of India
          </h3>
          <p className="meta mt-5">HTML · CSS · JavaScript · Responsive web</p>
          <p className="mt-8 max-w-md text-lg leading-relaxed">An interactive, responsive platform showcasing India’s traditional sweets, textiles and fashion — structured navigation and multimedia that put product presentation and cultural identity first.</p>
          <ul className="mt-10 grid grid-cols-3 border-t border-ink/30 text-center">
            {["Sweets", "Textiles", "Fashion"].map((c) => (
              <li key={c} className="border-r border-ink/30 py-5 font-[family-name:var(--font-serif)] text-2xl italic last:border-r-0">{c}</li>
            ))}
          </ul>
          <CaseStudy>
            <Block label="Focus">Product presentation, cultural visual identity and an easy browsing experience across devices.</Block>
            <Block label="Built">Category-based navigation, multimedia sections, responsive layouts.</Block>
          </CaseStudy>
        </div>
      </div>
    </article>
  );
}

function P05() {
  return (
    <article className="relative overflow-hidden px-5 py-28 md:px-10 md:py-40">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <ProjectHead n="05" role="Designer & developer" tech="React · TanStack Start · GSAP ScrollTrigger · Three.js · Tailwind" title={<span className="text-6xl md:text-7xl">This<br />Portfolio<span className="text-volt">*</span></span>} />
          <p className="mt-6 text-lg leading-relaxed">A self-referential case study: the site you are scrolling right now, treated as an engineered object.</p>
          <p className="meta mt-6 text-muted-foreground">* you are here</p>
        </div>
        <div className="relative lg:col-span-8">
          <div className="border border-foreground bg-background p-3 shadow-[16px_16px_0_var(--color-foreground)]">
            <div className="meta mb-3 flex gap-2 text-muted-foreground"><span>●●●</span><span>svk.lab / index</span></div>
            <div className="grid-lines relative aspect-[16/9] overflow-hidden bg-card p-6">
              <div className="font-[family-name:var(--font-display)] text-[6vw] font-extrabold uppercase leading-[0.8] tracking-tighter lg:text-[4.4vw]">Sri Vaidhika<br /><span className="pl-[20%]">Kotha.</span></div>
              <div className="absolute right-6 top-6 h-1/2 w-1/3 rounded-full border border-dashed border-volt" />
              <span data-note className="meta absolute right-6 top-[58%] text-volt">← three.js sculpture</span>
              <span data-note className="meta absolute bottom-6 left-6 text-muted-foreground">type: Bricolage / Instrument Serif / JetBrains Mono</span>
            </div>
          </div>
          <CaseStudy repo={LINKS.github}>
            <Block label="Design">Editorial grid with oversized type, a warm paper / graphite palette and a single electric-blue accent; light and dark sections alternate for rhythm.</Block>
            <Block label="Motion">GSAP ScrollTrigger drives parallax type, mask reveals, the timeline and a pinned horizontal sequence (desktop only). Native scrolling is kept for accessibility.</Block>
            <Block label="3D">A lazily loaded Three.js wireframe with an SVG fallback when WebGL isn’t available.</Block>
            <Block label="Care">Respects reduced-motion, custom cursor only on fine pointers, no fake forms.</Block>
          </CaseStudy>
        </div>
      </div>
    </article>
  );
}

/* ---------------- 04 skills ---------------- */

function Skills() {
  const [active, setActive] = useState<{ g: string; name: string; note: string } | null>(null);
  return (
    <section id="skills" className="env-dark grain relative overflow-hidden px-5 py-32 md:px-10 md:py-48">
      <p className="meta text-muted-foreground">04 — Technical map / no progress bars</p>
      <h2 data-reveal className="mt-8 overflow-hidden font-[family-name:var(--font-display)] text-5xl font-bold tracking-[-0.04em] md:text-8xl">
        <span className="block">A constellation</span>
        <span className="block font-[family-name:var(--font-serif)] font-normal italic text-muted-foreground">of tools I’ve used.</span>
      </h2>

      <div className="relative mt-16 hidden aspect-[16/9] lg:block">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          {SKILLS.map((a, i) => SKILLS.slice(i + 1).map((b) => (
            <line key={a.id + b.id} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="currentColor" strokeOpacity={active && (SKILLS.find((s) => s.title === active.g)?.id === a.id || SKILLS.find((s) => s.title === active.g)?.id === b.id) ? 0.5 : 0.1} strokeWidth="0.1" vectorEffect="non-scaling-stroke" strokeDasharray="4 4" />
          )))}
        </svg>
        {SKILLS.map((g) => (
          <div key={g.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${g.x}%`, top: `${g.y}%` }}>
            <p className="meta mb-2 text-primary">◉ {g.title}</p>
            <ul className="space-y-0.5">
              {g.items.map((s) => (
                <li key={s.name}>
                  <button onMouseEnter={() => setActive({ g: g.title, ...s })} onFocus={() => setActive({ g: g.title, ...s })} className={`text-left font-[family-name:var(--font-display)] text-xl transition-colors ${active?.name === s.name ? "text-primary" : "hover:text-primary"}`}>
                    {s.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="absolute left-1/2 top-1/2 w-72 -translate-x-1/2 -translate-y-1/2 border border-border bg-background/80 p-5 backdrop-blur" aria-live="polite">
          <p className="meta text-muted-foreground">{active ? active.g : "hover a node"}</p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold">{active ? active.name : "—"}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{active ? active.note : "Each skill links back to where I actually used it."}</p>
        </div>
      </div>

      <div className="mt-12 space-y-10 lg:hidden">
        {SKILLS.map((g) => (
          <div key={g.id}>
            <p className="meta mb-3 text-primary">◉ {g.title}</p>
            {g.items.map((s) => (
              <details key={s.name} className="border-b border-border py-2">
                <summary className="cursor-pointer font-[family-name:var(--font-display)] text-xl">{s.name}</summary>
                <p className="py-2 text-sm text-muted-foreground">{s.note}</p>
              </details>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- 05 lab ---------------- */

function Lab() {
  return (
    <section id="lab" className="relative px-5 py-32 md:px-10 md:py-40">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="meta text-muted-foreground">05 — Playground / optional</p>
          <h2 className="mt-8 font-[family-name:var(--font-display)] text-5xl font-bold tracking-[-0.04em] md:text-6xl">Grab the object.</h2>
          <p className="mt-6 text-lg leading-relaxed">Drag to spin it; each press sends a ripple through its vertices.</p>
          <p className="meta mt-8 leading-relaxed text-muted-foreground normal-case tracking-normal">
            How it works — an icosahedron (subdivided twice, 162 vertices) is re-computed every frame. Pointer drag adds angular velocity, and a press injects a “distortion” value that decays by 4% per frame, scaling each vertex along its normal with a sine offset. Built with Three.js, loaded only when needed.
          </p>
        </div>
        <div className="relative aspect-square border border-border lg:col-span-8 lg:aspect-[16/10]">
          <div className="grid-lines absolute inset-0 opacity-60" aria-hidden />
          <Suspense fallback={null}><Sculpture interactive className="absolute inset-0 h-full w-full" /></Suspense>
          <span className="meta pointer-events-none absolute left-4 top-4 text-muted-foreground">lab.01 — drag · press</span>
        </div>
      </div>
    </section>
  );
}

/* ---------------- 06 contact ---------------- */

function Contact() {
  return (
    <section id="contact" className="env-dark grain relative flex min-h-[100svh] flex-col justify-between px-5 pb-8 pt-32 md:px-10">
      <p className="meta text-muted-foreground">06 — Contact / end of file</p>
      <div>
        <h2 data-reveal className="overflow-hidden font-[family-name:var(--font-display)] text-[15vw] font-extrabold uppercase leading-[0.82] tracking-[-0.06em] md:text-[11vw]">
          <span className="block">Good ideas</span>
          <span className="block font-[family-name:var(--font-serif)] font-normal normal-case italic tracking-[-0.03em] text-primary">deserve to be built.</span>
        </h2>
        <p className="mt-10 max-w-xl text-lg leading-relaxed text-muted-foreground">Interested in software development, intelligent applications, and opportunities to create useful digital experiences.</p>
        <a href={`mailto:${LINKS.email}`} className="link-underline mt-10 inline-block font-[family-name:var(--font-serif)] text-3xl italic md:text-5xl">{LINKS.email}</a>
        <div className="mt-10 flex flex-wrap gap-3">
          <Magnetic href={LINKS.linkedin} external>LinkedIn ↗</Magnetic>
          <Magnetic href={LINKS.github} external>GitHub ↗</Magnetic>
          <Magnetic href={LINKS.resume} download>Download résumé ↓</Magnetic>
        </div>
      </div>
      <div className="meta mt-20 flex flex-col justify-between gap-2 border-t border-border pt-5 text-muted-foreground md:flex-row">
        <span>© 2026 Sri Vaidhika Kotha</span>
        <span>Hyderabad · Designed &amp; built as a creative engineering lab</span>
      </div>
    </section>
  );
}
