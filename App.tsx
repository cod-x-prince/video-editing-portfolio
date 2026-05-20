import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ENABLE_3D_REEL_CAROUSEL, HERO_SUB } from "./constants";
import { Navigation } from "./components/Navigation";
import { ArrowRight, Lock, EyeOff, Check, X } from "lucide-react";
import { ContactModal } from "./components/ContactModal";
import { BookingModal } from "./components/BookingModal";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ExperimentalReelCarouselSection } from "./components/sections/ExperimentalReelCarouselSection";
import { ReelsSection } from "./components/sections/ReelsSection";
import { ProcessSection } from "./components/sections/ProcessSection";
import { Footer } from "./components/sections/Footer";
import { CustomCursor } from "./components/animations/CustomCursor";
import { SplitWord } from "./components/animations/SplitWord";

const ForbiddenPage = () => (
  <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center p-6 text-center">
    <Lock size={64} className="text-[#a32d2d] mb-6" />
    <h1 className="text-4xl font-syne font-bold text-[#18181b] mb-4">403 Forbidden</h1>
    <p className="text-[#52525b] max-w-md">You do not have permission to view this directory or page using the credentials that you supplied.</p>
    <a href="/" className="mt-8 px-6 py-3 bg-[#18181b] text-white rounded-lg hover:bg-[#3f3f46] transition-colors">Return Home</a>
  </div>
);

const NotFoundPage = () => (
  <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center p-6 text-center">
    <EyeOff size={64} className="text-[#52525b] mb-6" />
    <h1 className="text-4xl font-syne font-bold text-[#18181b] mb-4">404 Not Found</h1>
    <p className="text-[#52525b] max-w-md">The page you're looking for doesn't exist or has been moved.</p>
    <a href="/" className="mt-8 px-6 py-3 bg-[#18181b] text-white rounded-lg hover:bg-[#3f3f46] transition-colors">Return Home</a>
  </div>
);

const MainLoader = () => {
  const [blobSize, setBlobSize]           = useState(0);
  const [glowOn, setGlowOn]               = useState(false);
  const [logoOn, setLogoOn]               = useState(false);
  const [bigWordOn, setBigWordOn]         = useState(false);
  const [stmtOn, setStmtOn]               = useState(false);
  const [activeTick, setActiveTick]       = useState(-1);

  // Respect prefers-reduced-motion
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (reducedMotion) return; // App timer will handle unmount

    const t: ReturnType<typeof setTimeout>[] = [];

    // Beat 1 — Warmth (80ms)
    t.push(setTimeout(() => { setLogoOn(true);  setActiveTick(0); }, 80));

    // Beat 2 — Cursor bloom (300ms)
    t.push(setTimeout(() => { setBlobSize(72); setGlowOn(true); setActiveTick(1); }, 300));

    // Beat 3 — One word (650ms)
    t.push(setTimeout(() => { setBigWordOn(true); setActiveTick(2); }, 650));

    // Blob pulse
    t.push(setTimeout(() => setBlobSize(88), 960));
    t.push(setTimeout(() => setBlobSize(72), 1120));

    // Beat 4 — Statement (1150ms)
    t.push(setTimeout(() => { setStmtOn(true); setActiveTick(3); }, 1150));



    return () => t.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.7, ease: 'easeInOut' } }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#FAFAF8', overflow: 'hidden',
        WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale',
      }}
    >
      {/* Corner logo — Prince. */}
      <div style={{
        position: 'fixed', top: '28px', left: '32px',
        fontFamily: "'Syne', sans-serif",
        fontSize: 'clamp(1.25rem, 2vw, 1.6rem)',
        fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1,
        color: '#18181b',
        opacity: logoOn ? 1 : 0,
        transition: 'opacity 0.7s ease',
        userSelect: 'none', zIndex: 10000,
      }}>
        Prince<span style={{ color: '#d97706' }}>.</span>
      </div>

      {/* Ambient amber glow */}
      <div style={{
        position: 'absolute', width: '380px', height: '380px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(217,119,6,0.10) 0%, transparent 70%)',
        opacity: glowOn ? 1 : 0,
        transition: 'opacity 1.4s ease',
        pointerEvents: 'none',
      }} />

      {/* Blob */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: `${blobSize}px`, height: `${blobSize}px`, borderRadius: '50%',
        background: '#d97706', mixBlendMode: 'multiply',
        transform: 'translate(-50%, -50%)',
        transition: 'width 0.75s cubic-bezier(0.34,1.56,0.64,1), height 0.75s cubic-bezier(0.34,1.56,0.64,1)',
        opacity: 0.45, filter: 'blur(2px)', pointerEvents: 'none',
      }} />

      {/* Text stack */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: '16px', textAlign: 'center', padding: '0 24px', pointerEvents: 'none',
      }}>
        {/* "Convinced." */}
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 'clamp(3.2rem, 6.5vw, 5.5rem)',
          fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.05,
          color: '#18181b',
          opacity: bigWordOn ? 1 : 0,
          transform: bigWordOn ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(8px)',
          transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34,1.2,0.64,1)',
        }}>
          Convinced.
        </div>

        {/* Statement line */}
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
          fontWeight: 300, letterSpacing: '0.01em', lineHeight: 1.6,
          color: '#71717a',
          opacity: stmtOn ? 1 : 0,
          transform: stmtOn ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          display: 'flex', alignItems: 'center', flexWrap: 'wrap',
          justifyContent: 'center', gap: '6px',
        }}>
          <span>Most editors</span>
          <span style={{
            textDecoration: 'line-through', textDecorationColor: '#d4d2cc',
            textDecorationThickness: '1px', color: '#a1a1aa',
          }}>entertain.</span>
          <span>I</span>
          <span style={{ color: '#d97706', fontWeight: 500 }}>convince.</span>
        </div>


      </div>

      {/* Progress dots */}
      <div style={{
        position: 'fixed', bottom: '28px', left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', gap: '7px', zIndex: 10000,
      }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            width: '5px', height: '5px', borderRadius: '50%',
            background: activeTick === i ? '#d97706' : '#e4e2dc',
            transform: activeTick === i ? 'scale(1.4)' : 'scale(1)',
            transition: 'background 0.3s ease, transform 0.3s ease',
          }} />
        ))}
      </div>
    </motion.div>
  );
};

const App: React.FC = () => {
  const [initialLoading, setInitialLoading] = useState(true);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const heroRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroTextY = useSpring(
    useTransform(heroProgress, [0, 1], [0, prefersReducedMotion ? 0 : 88]),
    { stiffness: 120, damping: 24, mass: 0.3 }
  );
  const heroVisualY = useSpring(
    useTransform(heroProgress, [0, 1], [0, prefersReducedMotion ? 0 : -72]),
    { stiffness: 120, damping: 22, mass: 0.35 }
  );
  const heroFrameY = useSpring(
    useTransform(heroProgress, [0, 1], [0, prefersReducedMotion ? 0 : -34]),
    { stiffness: 120, damping: 24, mass: 0.4 }
  );
  const heroGlowY = useSpring(
    useTransform(heroProgress, [0, 1], [0, prefersReducedMotion ? 0 : 120]),
    { stiffness: 110, damping: 24, mass: 0.45 }
  );
  const heroGlowX = useSpring(
    useTransform(heroProgress, [0, 1], [0, prefersReducedMotion ? 0 : -46]),
    { stiffness: 110, damping: 24, mass: 0.45 }
  );
  const heroTextOpacity = useTransform(heroProgress, [0, 0.8], [1, 0.78]);
  const heroVisualRotate = useTransform(
    heroProgress,
    [0, 1],
    [0, prefersReducedMotion ? 0 : -2]
  );

  useEffect(() => {
    // Simple custom routing for 403 / 404 pages demonstration
    const handleLocationChange = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", handleLocationChange);
    
    // Simulate Initial Custom Loader
    const timer = setTimeout(() => setInitialLoading(false), 1650); // Faster exit since counter beat is removed

    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      document.documentElement.style.scrollBehavior = "auto";
      clearTimeout(timer);
    };
  }, []);

  if (currentPath === "/forbidden" || currentPath === "/403") return <ForbiddenPage />;
  if (currentPath !== "/" && currentPath !== "") return <NotFoundPage />;

  return (
    <ErrorBoundary>
      <AnimatePresence>
        {initialLoading && <MainLoader />}
      </AnimatePresence>

      <div className="relative min-h-screen bg-[#FAFAF8] text-[#18181b] selection:bg-[#faeeda] selection:text-[#633806] font-inter">
        <CustomCursor />
        <Navigation />

        <ContactModal
          isOpen={isContactOpen}
          onClose={() => setIsContactOpen(false)}
          onOpenBooking={() => setIsBookingOpen(true)}
        />
        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
        />

        <main id="main-content">
        {/* HERO SECTION */}
        <section ref={heroRef} className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden pt-20 pb-10">
          <motion.div
            aria-hidden="true"
            style={{ y: heroGlowY, x: heroGlowX }}
            className="pointer-events-none absolute -left-48 top-[16%] h-112 w-md rounded-full bg-[radial-gradient(circle,rgba(217,119,6,0.14)_0%,rgba(217,119,6,0.04)_35%,transparent_72%)] blur-3xl"
          />
          <motion.div
            aria-hidden="true"
            style={{ y: heroVisualY }}
            className="pointer-events-none absolute -right-32 top-[12%] h-88 w-88 rounded-full bg-[radial-gradient(circle,rgba(24,24,27,0.08)_0%,transparent_72%)] blur-3xl"
          />
          <motion.div
            aria-hidden="true"
            style={{ y: heroFrameY }}
            className="pointer-events-none absolute inset-x-[8%] top-[24%] hidden h-px bg-linear-to-r from-transparent via-[#d97706]/30 to-transparent md:block"
          />
          <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch min-h-[400px] md:min-h-[500px]">
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              style={{ y: heroTextY, opacity: heroTextOpacity }}
              className="max-w-xl z-10"
            >
              <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold font-syne tracking-tighter leading-[1.05] mb-8 text-[#18181b]">
                Your viewers don't need to be <SplitWord word="entertained" />, they need to be <SplitWord word="convinced." />
              </h1>
              <p className="text-base md:text-lg text-[#52525b] font-light leading-relaxed mb-10 max-w-md">
                {HERO_SUB}
              </p>

              <div className="flex flex-wrap gap-2 mb-10">
                <span className="px-3 py-1.5 rounded-full bg-[#f5f3ee] border border-[#e4e2dc] text-[10px] font-bold uppercase tracking-[0.22em] text-[#444441]">
                  Hooks that hold attention
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#18181b] text-[#FAFAF8] text-[10px] font-bold uppercase tracking-[0.22em]">
                  Edits built to convert
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#faeeda] border border-[#f3d6a5] text-[10px] font-bold uppercase tracking-[0.22em] text-[#9a5808]">
                  Personal brand storytelling
                </span>
              </div>

              {/* [FIX #1] Hero CTA buttons */}
              <div className="flex flex-wrap gap-3">
                <a href="#reels" className="px-6 py-3 bg-[#18181b] text-white text-sm font-medium rounded-lg hover:bg-[#3f3f46] transition-colors flex items-center gap-2 cursor-pointer">
                  See My Work <ArrowRight size={14} />
                </a>
                <a href="#contact" className="px-6 py-3 border border-[#e4e2dc] text-[#18181b] text-sm font-medium rounded-lg hover:bg-[#f5f3ee] transition-colors cursor-pointer">
                  Start a Project
                </a>
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
                 <motion.div
                   animate={{ y: [0, -10, 0], rotate: [0, 1, 0] }}
                   transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                   className="absolute -top-2 right-[2%] z-30 hidden rounded-2xl border border-[#18181b]/10 bg-[#18181b] px-4 py-3 text-[#FAFAF8] shadow-2xl md:block"
                 >
                   <div className="text-[10px] uppercase tracking-[0.22em] text-white/60">Current Mode</div>
                   <div className="mt-1 font-syne text-xl font-bold leading-none">Cut. Hook. Sell.</div>
                 </motion.div>

                 <motion.div
                   animate={{ y: [0, 12, 0] }}
                   transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                   className="absolute bottom-[12%] -left-2 z-30 hidden rounded-2xl border border-[#f3d6a5] bg-[#faeeda] px-4 py-4 shadow-xl md:block"
                 >
                   <div className="text-[10px] uppercase tracking-[0.22em] text-[#9a5808]">Identity</div>
                   <div className="mt-2 font-syne text-2xl font-bold tracking-tight text-[#18181b]">Prince.</div>
                   <div className="text-sm text-[#52525b]">Editor for brands that want response, not noise.</div>
                 </motion.div>

                 <div className="absolute left-[10%] top-[10%] hidden h-[72%] w-[72%] rounded-4xl border border-[#18181b]/10 bg-white/40 shadow-[0_45px_100px_rgba(24,24,27,0.08)] md:block" />

                 <div className="absolute right-[8%] top-[16%] hidden h-[70%] w-[68%] rounded-4xl border border-[#d97706]/20 bg-linear-to-br from-[#fff7ed] via-[#FAFAF8] to-[#f5f3ee] shadow-[0_30px_70px_rgba(217,119,6,0.12)] md:block" />

                 <div className="absolute left-[4%] top-[20%] z-20 hidden h-[52%] w-12 items-center justify-center rounded-full border border-[#e4e2dc] bg-[#FAFAF8]/90 text-[10px] font-bold uppercase tracking-[0.32em] text-[#71717a] md:flex">
                   <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
                     Cinematic Retention Conversion
                   </span>
                 </div>

                 <div className="absolute inset-x-[10%] bottom-[8%] z-30 hidden flex-wrap gap-2 md:flex">
                   <span className="rounded-full border border-[#18181b]/10 bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#18181b] backdrop-blur-md">
                     Short-form editor
                   </span>
                   <span className="rounded-full border border-[#18181b]/10 bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#18181b] backdrop-blur-md">
                     Strategy-led cuts
                   </span>
                   <span className="rounded-full border border-[#d97706]/25 bg-[#faeeda]/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#9a5808] backdrop-blur-md">
                     Premium pacing
                   </span>
                 </div>

                 <div className="absolute inset-[6%] z-10 overflow-hidden rounded-[2.25rem] border border-[#18181b]/10 bg-[#18181b] shadow-[0_50px_120px_rgba(24,24,27,0.22)] md:inset-[10%]">
                   <div className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.8'/%3E%3C/svg%3E")`, backgroundSize: '200px' }}></div>
                   <div className="absolute inset-y-0 left-0 z-20 w-20 bg-linear-to-r from-[#18181b] via-[#18181b]/40 to-transparent pointer-events-none" />
                   <div className="absolute inset-x-0 bottom-0 z-20 h-32 bg-linear-to-t from-[#18181b] via-[#18181b]/30 to-transparent pointer-events-none" />

                   <motion.img
                     src="/profile/IMG_20260214_201237721_HDR_PORTRAIT.jpg"
                     variants={{
                       initial: { filter: "grayscale(1) brightness(1.02) contrast(1.1)", opacity: 0.92, scale: 1.02 },
                       hover: { filter: "grayscale(0) saturate(1) brightness(1) contrast(1)", opacity: 1, scale: 1.08 }
                     }}
                     initial="initial"
                     whileHover="hover"
                     transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                     alt="Prince — Video Editor"
                     className="h-full w-full object-cover mix-blend-luminosity"
                     onError={(e) => {
                       const target = e.target as HTMLImageElement;
                       target.style.display = 'none';
                       const fallback = target.parentElement?.querySelector('.avatar-fallback') as HTMLDivElement;
                       if (fallback) fallback.style.display = 'flex';
                     }}
                   />
                   <div className="absolute inset-0 bg-linear-to-tr from-[#d97706]/18 via-transparent to-transparent z-10 pointer-events-none" />
                   <div className="absolute left-6 top-6 z-20 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#FAFAF8] backdrop-blur-md">
                     Video Editor
                   </div>
                   <div className="absolute right-6 top-6 z-20 rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white backdrop-blur-md">
                     Personal Brands
                   </div>
                   <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-8">
                     <div className="text-[10px] font-bold uppercase tracking-[0.32em] text-white/60">Built for retention and response</div>
                     <div className="mt-3 font-syne text-4xl md:text-5xl font-bold leading-none tracking-tight text-[#FAFAF8]">
                       PRINCE<span className="text-[#d97706]">.</span>
                     </div>
                     <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/75">
                       I turn raw footage into persuasive short-form edits that feel premium before they ever feel loud.
                     </p>
                   </div>

                   <div className="avatar-fallback absolute inset-0 items-center justify-center bg-[#faeeda] text-5xl font-syne font-bold text-[#d97706]" style={{ display: 'none' }}>P</div>
                 </div>
              </div>
            </motion.div>

          </div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-[#71717a]"
          >
            <span className="text-[10px] tracking-[0.2em] font-medium uppercase font-syne">
              Scroll
            </span>
          </motion.div>
        </section>

        {ENABLE_3D_REEL_CAROUSEL && <ExperimentalReelCarouselSection />}
        <ReelsSection />
        <ProcessSection />

        {/* FIT SECTION (Client Filter) */}
        <section id="fit" className="py-24 bg-[#FAFAF8] border-t border-[#e4e2dc]">
           <div className="container mx-auto px-6 max-w-4xl">
              <div className="text-center mb-16">
                 <h2 className="text-3xl md:text-5xl font-syne font-bold text-[#18181b] tracking-tight mb-4">Who I work with</h2>
                 <p className="text-lg text-[#52525b] font-light max-w-md mx-auto">A quiet filter. We value alignment over volume.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                 <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-[#f5f3ee] border border-[#e4e2dc] rounded-2xl p-10 hover:shadow-sm transition-shadow duration-300"
                 >
                    <div className="text-xs font-bold tracking-[0.2em] uppercase text-[#18181b] mb-8 pb-4 border-b border-[#e4e2dc]">We're a fit if...</div>
                    <ul className="space-y-6">
                       <li className="flex items-start text-sm text-[#3f3f46]">
                          <Check className="w-4 h-4 mr-4 mt-0.5 text-[#18181b] shrink-0" />
                          <span className="leading-relaxed">You view editing as revenue infrastructure.</span>
                       </li>
                       <li className="flex items-start text-sm text-[#3f3f46]">
                          <Check className="w-4 h-4 mr-4 mt-0.5 text-[#18181b] shrink-0" />
                          <span className="leading-relaxed">You have a clear audience and offer.</span>
                       </li>
                       <li className="flex items-start text-sm text-[#3f3f46]">
                          <Check className="w-4 h-4 mr-4 mt-0.5 text-[#18181b] shrink-0" />
                          <span className="leading-relaxed">You prioritize business impact over trendy transitions.</span>
                       </li>
                    </ul>
                 </motion.div>
                 <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: 0.2 }}
                    className="bg-[#18181b] rounded-2xl p-10 shadow-xl"
                 >
                    <div className="text-xs font-bold tracking-[0.2em] uppercase text-[#FAFAF8] mb-8 pb-4 border-b border-white/10">We're NOT a fit if...</div>
                    <ul className="space-y-6">
                       <li className="flex items-start text-sm text-[#a1a1aa]">
                          <X className="w-4 h-4 mr-4 mt-0.5 text-[#FAFAF8] shrink-0" />
                          <span className="leading-relaxed">You lead with budget before we've talked about what you're building.</span>
                       </li>
                       <li className="flex items-start text-sm text-[#a1a1aa]">
                          <X className="w-4 h-4 mr-4 mt-0.5 text-[#FAFAF8] shrink-0" />
                          <span className="leading-relaxed">You just want someone to blindly cut clips to trending audio.</span>
                       </li>
                       <li className="flex items-start text-sm text-[#a1a1aa]">
                          <X className="w-4 h-4 mr-4 mt-0.5 text-[#FAFAF8] shrink-0" />
                          <span className="leading-relaxed">You are not clear on who you're speaking to.</span>
                       </li>
                    </ul>
                 </motion.div>
              </div>
           </div>
        </section>

        {/* START / CTA SECTION */}
        <section id="contact" className="py-32 bg-[#18181b] relative overflow-hidden">
          <div className="container mx-auto px-6 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="text-4xl md:text-7xl font-syne font-bold mb-6 text-[#FAFAF8] tracking-tighter leading-tight">
                Before we talk numbers...
              </h2>
              <p className="text-xl text-[#d4d4d8] mb-4">
                tell me what you're building.
              </p>
              {/* [FIX #7] One honest stat — not testimonials */}
              <p className="text-xs uppercase tracking-[0.15em] text-[#a1a1aa] mb-12">50+ reels delivered across 6 niches</p>

              <div className="flex flex-col items-center justify-center">
                <button
                  onClick={() => setIsContactOpen(true)}
                  className="px-8 py-4 bg-[#FAFAF8] text-[#18181b] font-bold rounded-lg hover:bg-white transition-transform active:scale-95 flex items-center justify-center gap-3 text-sm tracking-wide"
                >
                  Start the Conversation <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          </div>
        </section>
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default App;
