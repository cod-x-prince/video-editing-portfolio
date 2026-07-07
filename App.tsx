import { useEffect, useRef, useState, lazy, Suspense } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { HERO_SUB } from "./constants";
import { Navigation } from "./components/Navigation";
import { MusicWaveBackground } from "./components/animations/MusicWaveBackground";
import { AudioWaveform } from "./components/AudioWaveform";
import { ArrowRight, Lock, EyeOff, Check, X } from "lucide-react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { IntroLoader } from "./components/IntroLoader";
import { MusicPlayer } from "./components/MusicPlayer";
import { Chatbot } from "./components/Chatbot";
import { ReelsSection } from "./components/sections/ReelsSection";
import { ProcessSection } from "./components/sections/ProcessSection";
import { Footer } from "./components/sections/Footer";
import { WhoIWorkWithSection } from "./components/sections/WhoIWorkWithSection";
import { ContactSection } from "./components/sections/ContactSection";
import { CustomCursor } from "./components/animations/CustomCursor";
import { SplitWord } from "./components/animations/SplitWord";

// Lazy load modals for better code splitting
const ContactModal = lazy(() =>
  import("./components/ContactModal").then((mod) => ({
    default: mod.ContactModal,
  }))
);
const BookingModal = lazy(() =>
  import("./components/BookingModal").then((mod) => ({
    default: mod.BookingModal,
  }))
);

const ModalLoading = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
  </div>
);

const ForbiddenPage = () => (
  <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center p-6 text-center">
    <Lock size={64} className="text-[#a32d2d] mb-6" />
    <h1 className="font-brand text-4xl font-bold text-[#18181b] mb-4">
      403 Forbidden
    </h1>
    <p className="text-[#52525b] max-w-md">
      You do not have permission to view this directory or page using the
      credentials that you supplied.
    </p>
    <a
      href="/"
      className="mt-8 px-6 py-3 bg-[#18181b] text-white rounded-lg hover:bg-[#3f3f46] transition-colors"
    >
      Return Home
    </a>
  </div>
);

const NotFoundPage = () => (
  <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center p-6 text-center">
    <EyeOff size={64} className="text-[#52525b] mb-6" />
    <h1 className="font-brand text-4xl font-bold text-[#18181b] mb-4">
      404 Not Found
    </h1>
    <p className="text-[#52525b] max-w-md">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <a
      href="/"
      className="mt-8 px-6 py-3 bg-[#18181b] text-white rounded-lg hover:bg-[#3f3f46] transition-colors"
    >
      Return Home
    </a>
  </div>
);

const App: React.FC = () => {
  const [initialLoading, setInitialLoading] = useState(true);
  const [introPhase, setIntroPhase] = useState<"hello" | "player">("hello");
  const [musicPlayerVisible, setMusicPlayerVisible] = useState(false);
  const [musicPlayerDocked, setMusicPlayerDocked] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const heroRef = useRef<HTMLElement>(null);
  const heroMusicDockRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroTextY = useSpring(
    useTransform(heroProgress, [0, 1], [0, prefersReducedMotion ? 0 : 88]),
    { stiffness: 120, damping: 24, mass: 0.3 },
  );
  const heroVisualY = useSpring(
    useTransform(heroProgress, [0, 1], [0, prefersReducedMotion ? 0 : -72]),
    { stiffness: 120, damping: 22, mass: 0.35 },
  );
  const heroFrameY = useSpring(
    useTransform(heroProgress, [0, 1], [0, prefersReducedMotion ? 0 : -34]),
    { stiffness: 120, damping: 24, mass: 0.4 },
  );
  const heroGlowY = useSpring(
    useTransform(heroProgress, [0, 1], [0, prefersReducedMotion ? 0 : 120]),
    { stiffness: 110, damping: 24, mass: 0.45 },
  );
  const heroGlowX = useSpring(
    useTransform(heroProgress, [0, 1], [0, prefersReducedMotion ? 0 : -46]),
    { stiffness: 110, damping: 24, mass: 0.45 },
  );
  const heroTextOpacity = useTransform(heroProgress, [0, 0.8], [1, 0.78]);
  const heroVisualRotate = useTransform(
    heroProgress,
    [0, 1],
    [0, prefersReducedMotion ? 0 : -2],
  );
  const finishIntro = () => {
    setIntroPhase("player");
    setMusicPlayerVisible(true);
    setInitialLoading(false);
    setMusicPlayerDocked(true);
    window.dispatchEvent(new CustomEvent("portfolio:start-music"));
  };

  useEffect(() => {
    const handleLocationChange = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", handleLocationChange);

    const timers: ReturnType<typeof setTimeout>[] = [];
    const introToPlayerDelay = prefersReducedMotion ? 180 : 1700;
    const playerBirthDelay = prefersReducedMotion ? 260 : 2000;
    const heroRevealDelay = prefersReducedMotion ? 540 : 2350;
    const playerDockDelay = prefersReducedMotion ? 720 : 2700;

    timers.push(setTimeout(() => setIntroPhase("player"), introToPlayerDelay));
    timers.push(
      setTimeout(() => setMusicPlayerVisible(true), playerBirthDelay),
    );
    timers.push(
      setTimeout(() => {
        setInitialLoading(false);
        window.dispatchEvent(new CustomEvent("portfolio:start-music"));
      }, heroRevealDelay),
    );
    timers.push(setTimeout(() => setMusicPlayerDocked(true), playerDockDelay));

    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      document.documentElement.style.scrollBehavior = "auto";
      timers.forEach(clearTimeout);
    };
  }, [prefersReducedMotion]);

  if (currentPath === "/forbidden" || currentPath === "/403")
    return <ForbiddenPage />;
  if (currentPath !== "/" && currentPath !== "") return <NotFoundPage />;

  return (
    <ErrorBoundary>
      <AnimatePresence>
        {initialLoading && (
          <IntroLoader phase={introPhase} onSkip={finishIntro} />
        )}
      </AnimatePresence>

      <MusicPlayer
        visible={musicPlayerVisible}
        docked={musicPlayerDocked}
        dockTargetRef={heroMusicDockRef}
      />

      <MusicWaveBackground />
      <AudioWaveform />
      <Chatbot />
      <CustomCursor />
      <div className="relative z-10 min-h-screen bg-transparent text-[#18181b] selection:bg-[#faeeda] selection:text-[#633806] font-body">
        <Navigation onOpenContact={() => setIsContactOpen(true)} />

        <Suspense fallback={null}>
          <ContactModal
            isOpen={isContactOpen}
            onClose={() => setIsContactOpen(false)}
            onOpenBooking={() => setIsBookingOpen(true)}
          />
        </Suspense>
        <Suspense fallback={null}>
          <BookingModal
            isOpen={isBookingOpen}
            onClose={() => setIsBookingOpen(false)}
          />
        </Suspense>

        <main id="main-content">
          {/* HERO SECTION */}
          <section
            ref={heroRef}
            className="designer-hero relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden pt-20 pb-10"
          >
            <motion.div
              aria-hidden="true"
              style={{ y: heroGlowY, x: heroGlowX }}
              className="pointer-events-none absolute -left-48 top-[16%] h-112 w-md rounded-full bg-[radial-gradient(circle,rgba(217,119,6,0.08)_0%,rgba(217,119,6,0.02)_35%,transparent_72%)] blur-3xl"
            />
            <motion.div
              aria-hidden="true"
              style={{ y: heroVisualY }}
              className="pointer-events-none absolute -right-32 top-[12%] h-88 w-88 rounded-full bg-[radial-gradient(circle,rgba(24,24,27,0.05)_0%,transparent_72%)] blur-3xl"
            />
            <motion.div
              aria-hidden="true"
              style={{ y: heroFrameY }}
              className="pointer-events-none absolute inset-x-[8%] top-[24%] hidden h-px bg-linear-to-r from-transparent via-[#c4871f]/30 to-transparent md:block"
            />
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch min-h-[400px] md:min-h-[500px]">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                style={{ y: heroTextY, opacity: heroTextOpacity }}
                className="max-w-xl z-10"
              >

                <h1 className="font-display text-[2.75rem] md:text-[4rem] lg:text-[5rem] font-semibold tracking-[-0.035em] leading-[1.08] mb-4 md:mb-7 text-[#18181b]">
                  Your viewers don't need to be <SplitWord word="entertained" />
                  , they need to be <SplitWord word="convinced." />
                </h1>
                <p className="text-[0.95rem] md:text-base text-[#52525b] font-normal leading-[1.6] md:leading-[1.7] mb-6 md:mb-9 max-w-[26rem]">
                  {HERO_SUB}
                </p>

                <div className="hidden md:flex flex-wrap gap-1.5 mb-9">
                  <span className="px-2.5 py-1 rounded-full bg-[#f5f3ee] border border-[#e5dfd5] text-[9px] font-semibold uppercase tracking-[0.14em] text-[#5a5650]">
                    Hooks that hold attention
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#18181b] text-[#f5f3ee] text-[9px] font-semibold uppercase tracking-[0.14em]">
                    Edits built to convert
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#faeeda] border border-[#e8c888] text-[9px] font-semibold uppercase tracking-[0.14em] text-[#7a4d0a]">
                    Personal brand storytelling
                  </span>
                </div>

                {/* [FIX #1] Hero CTA buttons */}
                <div className="flex flex-wrap gap-2.5">
                  <a
                    href="#reels"
                    className="px-5 py-2.5 bg-[#18181b] text-white text-[0.8rem] font-medium rounded-lg hover:bg-[#27272a] transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
                  >
                    See My Work <ArrowRight size={13} />
                  </a>
                  <button
                    type="button"
                    onClick={() => setIsContactOpen(true)}
                    className="rounded-lg border border-[#d5d0c7] px-5 py-2.5 text-[0.8rem] font-medium text-[#3f3f46] transition-all hover:bg-[#f5f3ee] hover:border-[#c4871f]/30"
                  >
                    Start a Project
                  </button>
                </div>

                <div className="hero-metrics hidden md:grid" aria-label="Editing proof points">
                  <div>
                    <strong>50+</strong>
                    <span>reels delivered</span>
                  </div>
                  <div>
                    <strong>Finance · SaaS</strong>
                    <span>coaching · property</span>
                  </div>
                  <div>
                    <strong>3-5d</strong>
                    <span>typical delivery</span>
                  </div>
                </div>
              </motion.div>

              {/* [IMPLEMENTATION] The Architectural Overlap */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover="hover"
                transition={{ delay: 0.5, duration: 0.8 }}
                style={{ y: heroVisualY, rotate: heroVisualRotate }}
                className="relative flex justify-center md:justify-end z-0 md:ml-[-10%] md:w-[110%] h-full min-h-[400px] md:min-h-[600px]"
              >
                <div className="relative w-full h-full overflow-visible px-4 md:px-0">
                  <div className="designer-mode-pill absolute -top-2 right-[2%] z-30 hidden rounded-2xl border border-[#18181b]/10 bg-[#18181b] px-4 py-3 text-[#FAFAF8] shadow-2xl md:block">
                    <div className="text-[10px] uppercase tracking-[0.22em] text-white/60">
                      Current Mode
                    </div>
                    <div className="mt-1 font-brand text-xl font-bold leading-none">
                      Retention → Revenue
                    </div>
                  </div>

                  <motion.div
                    animate={{ y: [0, 12, 0] }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.6,
                    }}
                    className="hidden"
                  >
                    <div className="text-[10px] uppercase tracking-[0.22em] text-[#9a5808]">
                      Identity
                    </div>
                    <div className="mt-2 font-brand text-2xl font-bold tracking-tight text-[#18181b]">
                      Parmbeer.
                    </div>
                    <div className="text-sm text-[#52525b]">
                      Editor for brands that want response, not noise.
                    </div>
                  </motion.div>

                  <div className="absolute left-[10%] top-[10%] hidden h-[72%] w-[72%] border border-[#18181b]/8 bg-white/35 shadow-[0_45px_100px_rgba(24,24,27,0.07)] md:block" />

                  <div className="absolute right-[8%] top-[16%] hidden h-[70%] w-[68%] border border-[#c4871f]/14 bg-linear-to-br from-[#fff7ed] via-[#FAFAF8] to-[#f5f3ee] shadow-[0_30px_70px_rgba(196,135,31,0.08)] md:block" />

                  <div className="absolute left-[4%] top-[20%] z-20 hidden h-[52%] w-12 items-center justify-center rounded-full border border-[#e4e2dc] bg-[#FAFAF8]/90 text-[10px] font-bold uppercase tracking-[0.32em] text-[#71717a] md:flex">
                    <span
                      style={{
                        writingMode: "vertical-rl",
                        transform: "rotate(180deg)",
                      }}
                    >
                      Cinematic Retention Conversion
                    </span>
                  </div>

                  <div
                    ref={heroMusicDockRef}
                    className="hero-portrait-ink designer-portrait-frame absolute inset-[6%] z-10 overflow-hidden border border-[#18181b]/10 bg-[#18181b] shadow-[0_50px_120px_rgba(24,24,27,0.18)] md:inset-[10%]"
                  >
                    <div className="ink-wash" aria-hidden="true" />
                    <div
                      className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-overlay"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.8'/%3E%3C/svg%3E")`,
                        backgroundSize: "200px",
                      }}
                    ></div>
                    <div className="absolute inset-y-0 left-0 z-20 w-20 bg-linear-to-r from-[#18181b] via-[#18181b]/40 to-transparent pointer-events-none" />
                    <div className="absolute inset-x-0 bottom-0 z-20 h-32 bg-linear-to-t from-[#18181b] via-[#18181b]/30 to-transparent pointer-events-none" />

                    <motion.img
                      src="/profile/IMG_20260214_201237721_HDR_PORTRAIT.jpg"
                      loading="lazy"
                      decoding="async"
                      variants={{
                        initial: {
                          filter: "grayscale(1) brightness(1.02) contrast(1.1)",
                          opacity: 0.92,
                          scale: 1.02,
                        },
                        hover: {
                          filter:
                            "grayscale(0) saturate(1) brightness(1) contrast(1)",
                          opacity: 1,
                          scale: 1.08,
                        },
                      }}
                      initial="initial"
                      whileHover="hover"
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                      alt="Parmbeer — Video Editor"
                      className="h-full w-full object-cover mix-blend-luminosity"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const fallback = target.parentElement?.querySelector(
                          ".avatar-fallback",
                        ) as HTMLDivElement;
                        if (fallback) fallback.style.display = "flex";
                      }}
                    />
                    <div className="absolute inset-0 bg-linear-to-tr from-[#c4871f]/12 via-transparent to-transparent z-10 pointer-events-none" />
                    <div className="absolute left-5 top-5 z-20 rounded-full border border-white/8 bg-white/8 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#FAFAF8]/90 backdrop-blur-md">
                      Video Editor
                    </div>
                    <div className="absolute right-5 top-5 z-20 rounded-full border border-white/8 bg-black/20 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur-md">
                      Personal Brands
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 z-20 p-5 md:p-7">
                      <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/50">
                        Built for retention and response
                      </div>
                      <div className="mt-2.5 font-brand text-3xl md:text-4xl font-bold leading-none tracking-tight text-[#FAFAF8]">
                        PARMBEER<span className="text-[#c4871f]">.</span>
                      </div>
                      <p className="mt-2.5 max-w-sm text-[0.82rem] leading-relaxed text-white/65">
                        I turn raw footage into persuasive short-form edits that
                        feel premium before they ever feel loud.
                      </p>
                    </div>

                    <div
                      className="avatar-fallback absolute inset-0 items-center justify-center bg-[#faeeda] text-5xl font-brand font-bold text-[#c4871f]"
                      style={{ display: "none" }}
                    >
                      P
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-[#71717a]"
            >
              <span className="text-[10px] tracking-[0.2em] font-medium uppercase font-brand">
                Scroll
              </span>
            </motion.div>
          </section>

          <ReelsSection onOpenContact={() => setIsContactOpen(true)} />
          <ProcessSection onOpenContact={() => setIsContactOpen(true)} />
          <WhoIWorkWithSection onOpenContact={() => setIsContactOpen(true)} />
          <ContactSection onOpenContact={() => setIsContactOpen(true)} />
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default App;
