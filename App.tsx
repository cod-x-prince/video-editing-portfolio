import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HERO_SUB } from "./constants";
import { Navigation } from "./components/Navigation";
import { ArrowRight, Lock, EyeOff, Check, X } from "lucide-react";
import { ContactModal } from "./components/ContactModal";
import { BookingModal } from "./components/BookingModal";
import { ErrorBoundary } from "./components/ErrorBoundary";
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
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 800; // [FIX #5] Cut from 2000ms
    const intervalTime = 20;
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= 100) {
        setCount(100);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-100 bg-[#FAFAF8] flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="relative w-16 md:w-24 lg:w-22 h-16 md:h-24 lg:h-22">
        {/* Ball Shadow */}
        <motion.div
          initial={{ x: "-50%" }}
          animate={{ 
            x: "-50%",
            scale: [1, 0.3, 1], 
            opacity: [0.7, 0.1, 0.7],
            filter: ["blur(4px)", "blur(12px)", "blur(4px)"]
          }}
          transition={{ repeat: Infinity, duration: 0.9, ease: ["easeOut", "easeIn"] }}
          className="w-14 md:w-20 lg:w-24 h-3 md:h-4 bg-black rounded-[100%] absolute left-1/2 bottom-[-10px] md:bottom-[-16px]"
        />
        {/* Bouncing Ball */}
        <motion.div 
          animate={{ 
            y: [0, -180, 0], 
            scaleY: [0.7, 1.15, 1, 1.15, 0.7], 
            scaleX: [1.3, 0.85, 1, 0.85, 1.3]
          }}
          transition={{ 
            y: { repeat: Infinity, duration: 0.9, ease: ["easeOut", "easeIn"] },
            scaleY: { repeat: Infinity, duration: 0.9, times: [0, 0.15, 0.5, 0.85, 1], ease: "easeInOut" },
            scaleX: { repeat: Infinity, duration: 0.9, times: [0, 0.15, 0.5, 0.85, 1], ease: "easeInOut" }
          }}
          className="w-full h-full rounded-full bg-[#d97706] relative z-10 origin-bottom shadow-lg"
        />
      </div>
      
      <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 flex items-baseline font-syne">
        <span className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold text-[#18181b] tracking-tighter leading-[1.05]">{count}</span>
        <span className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold text-[#d97706] leading-[1.05]">.</span>
      </div>
    </motion.div>
  );
};

const App: React.FC = () => {
  const [initialLoading, setInitialLoading] = useState(true);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    // Simple custom routing for 403 / 404 pages demonstration
    const handleLocationChange = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", handleLocationChange);
    
    // Simulate Initial Custom Loader
    const timer = setTimeout(() => setInitialLoading(false), 800); // [FIX #5]

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

        {/* HERO SECTION */}
        <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden pt-20 pb-10">
          <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch min-h-[400px] md:min-h-[500px]">
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="max-w-xl z-10"
            >
              <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold font-syne tracking-tighter leading-[1.05] mb-8 text-[#18181b]">
                Your viewers don't need to be <SplitWord word="entertained" />, they need to be <SplitWord word="convinced." />
              </h1>
              <p className="text-base md:text-lg text-[#52525b] font-light leading-relaxed mb-10 max-w-md">
                {HERO_SUB}
              </p>

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

            {/* Profile Picture with Tilt and Blend */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="relative flex justify-center md:justify-end perspective z-0"
            >
              <div className="relative w-full h-full rounded-2xl overflow-hidden hero-tilt border border-[#e4e2dc] min-h-[400px] md:min-h-[500px]">
                 {/* Placeholder for Profile */}
                 {/* [FIX #9] Branded fallback instead of random stock photo */}
                 <img
                   src="/profile/IMG_20260214_201237721_HDR_PORTRAIT.jpg"
                   onError={(e) => {
                     const target = e.target as HTMLImageElement;
                     target.style.display = 'none';
                     const fallback = target.parentElement?.querySelector('.avatar-fallback') as HTMLDivElement;
                     if (fallback) fallback.style.display = 'flex';
                   }}
                   alt="Prince — Video Editor"
                   className="w-full h-full object-cover blend-bg"
                 />
                 <div className="avatar-fallback w-full h-full bg-[#faeeda] items-center justify-center text-5xl font-syne font-bold text-[#d97706] absolute inset-0" style={{ display: 'none' }}>P</div>
                 <div className="absolute inset-0 border border-white/20 rounded-2xl pointer-events-none"></div>
              </div>
            </motion.div>

          </div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-[#a1a1aa]"
          >
            <span className="text-[10px] tracking-[0.2em] font-medium uppercase font-syne">
              Scroll
            </span>
          </motion.div>
        </section>

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
              <p className="text-xs uppercase tracking-[0.15em] text-[#71717a] mb-12">50+ reels delivered across 6 niches</p>

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

        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default App;
