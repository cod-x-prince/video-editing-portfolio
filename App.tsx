import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { reels } from "./data/reels";
import { ThreeHero } from "./components/ThreeHero";
import { ReelCard } from "./components/ReelCard";
import { Navigation } from "./components/Navigation";
import { HERO_COPY, PROCESS_STEPS, PRICING_PLANS } from "./constants";
import {
  Play,
  Mail,
  Calendar,
  Upload,
  Check,
  Instagram,
  Linkedin,
  Youtube,
  Twitter,
} from "lucide-react";
import { ContactModal } from "./components/ContactModal";
import { BookingModal } from "./components/BookingModal";
import { AdminDashboard } from "./components/AdminDashboard";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { SOCIAL_LINKS } from "./data/socials";

const iconMap: any = { Instagram, Linkedin, Youtube, Twitter };

const App: React.FC = () => {
  // Smooth scroll behavior setup
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroY = useTransform(scrollY, [0, 500], [0, 100]);

  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminToken, setAdminToken] = useState("");

  useEffect(() => {
    // Check for admin token in URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("admin_token");
    if (token) {
      setAdminToken(token);
      setIsAdminOpen(true);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    // Add smooth scroll to html element
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen bg-neutral-900 text-neutral-100 selection:bg-orange-500/30 selection:text-orange-200">
        <Navigation />

        <ContactModal
          isOpen={isContactOpen}
          onClose={() => setIsContactOpen(false)}
        />
        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
        />
        <AdminDashboard
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          token={adminToken}
        />

        {/* Hero Section */}
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
          {/* 3D Background */}
          <ThreeHero />

          {/* Hero Content */}
          <motion.div
            style={{ opacity: heroOpacity, y: heroY }}
            className="relative z-10 container mx-auto px-6 text-center max-w-4xl"
          >
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-medium text-neutral-400">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                AVAILABLE FOR Q4 2024
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-syne tracking-tight leading-tight mb-8">
              {HERO_COPY.split(" ").map((word, i) => (
                <span
                  key={i}
                  className="inline-block mr-[0.2em] relative group"
                >
                  {word}
                  {/* Subtle underline hover effect */}
                  <span className="absolute bottom-2 left-0 w-0 h-[2px] bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
                </span>
              ))}
            </h1>

            <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto font-inter font-light">
              I craft visuals that hit the rhythm, not just the timeline.
            </p>

            <div className="mt-12 flex justify-center gap-4">
              <a
                href="#reels"
                className="px-8 py-3 bg-white text-black font-medium rounded-full hover:bg-neutral-200 transition-colors duration-300 flex items-center gap-2"
              >
                View Latest Reels
              </a>
              <a
                href="#reels"
                className="px-8 py-3 bg-transparent border border-neutral-700 text-white font-medium rounded-full hover:border-neutral-500 transition-colors duration-300 flex items-center gap-2"
              >
                <Play size={16} fill="currentColor" />
                Showreel (01:15)
              </a>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-neutral-500"
          >
            <span className="text-[10px] tracking-[0.2em] uppercase">
              Scroll
            </span>
          </motion.div>
        </section>

        {/* REELS SECTION (Replaced Selected Works as main showcase) */}
        <section
          id="reels"
          className="py-24 md:py-32 bg-neutral-900 relative z-20"
        >
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12 flex flex-col md:flex-row justify-between items-end border-b border-neutral-800 pb-6"
            >
              <div>
                <h2 className="text-4xl md:text-5xl font-syne font-bold text-white mb-2">
                  Latest Reels
                </h2>
                <p className="text-neutral-400 max-w-xl">
                  Vertical formats designed for social impact. Hover to play.
                </p>
              </div>
              <span className="text-neutral-500 font-mono mt-4 md:mt-0">
                03 / 05
              </span>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {reels.map((reel, index) => (
                <ReelCard key={reel.id} reel={reel} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* PRICING SECTION (New) */}
        <section
          id="pricing"
          className="py-24 bg-black border-t border-neutral-800 relative"
        >
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-syne font-bold text-white mb-6">
                Simple Pricing
              </h2>
              <p className="text-neutral-400 text-lg">
                Clear monthly retainers. No hidden fees. Pause or cancel
                anytime.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {PRICING_PLANS.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative p-8 rounded-2xl border ${plan.highlight ? "bg-neutral-800 border-orange-500/50" : "bg-neutral-900 border-neutral-800"} flex flex-col`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-orange-500 text-black text-xs font-bold uppercase tracking-wider rounded-full">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white mb-2">
                    {plan.title}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-syne font-bold text-white">
                      {plan.price}
                    </span>
                    <span className="text-neutral-500">{plan.period}</span>
                  </div>

                  <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-neutral-300 text-sm"
                      >
                        <Check
                          size={16}
                          className="text-orange-500 mt-0.5 shrink-0"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#contact"
                    className={`w-full py-4 rounded-lg font-bold text-center transition-colors ${plan.highlight ? "bg-white text-black hover:bg-neutral-200" : "bg-neutral-800 text-white hover:bg-neutral-700"}`}
                  >
                    Get Started
                  </a>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 text-center text-sm text-neutral-500 max-w-2xl mx-auto">
              <p className="mb-2">
                Thinking long term?{" "}
                <span className="text-neutral-300 font-medium">
                  Discounts available for 3+ month commitments.
                </span>
              </p>
              <p className="italic opacity-60">
                * Social media management (posting, scheduling, engagement) is
                not included.
              </p>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section
          id="process"
          className="py-24 bg-neutral-900 border-t border-neutral-800"
        >
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4">
                <h2 className="text-4xl md:text-5xl font-syne font-bold mb-6 text-white sticky top-32">
                  The Process
                </h2>
              </div>

              <div className="lg:col-span-8 grid gap-6">
                {PROCESS_STEPS.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: i * 0.05 }}
                    className="group p-6 rounded-xl bg-neutral-800/20 border border-neutral-800 hover:border-neutral-700 transition-all duration-300 flex items-start gap-6"
                  >
                    <span className="text-2xl font-syne font-bold text-neutral-600 group-hover:text-orange-500 transition-colors">
                      {item.step}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">
                        {item.title}
                      </h3>
                      <p className="text-neutral-400 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact / CTA Section */}
        <section
          id="contact"
          className="py-32 relative overflow-hidden bg-black"
        >
          <div className="absolute inset-0 bg-neutral-900 opacity-50"></div>
          {/* Decorative circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="container mx-auto px-6 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="text-4xl md:text-6xl font-syne font-bold mb-8">
                Let's cut to the <span className="text-orange-500">chase</span>.
              </h2>
              <p className="text-xl text-neutral-400 mb-12">
                Currently booking projects for Q4. Looking for high-impact
                narratives and commercial spots.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => setIsContactOpen(true)}
                  className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-neutral-200 transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <Mail size={18} />
                  Email Me
                </button>
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="w-full sm:w-auto px-8 py-4 bg-neutral-800 border border-neutral-700 text-white font-bold rounded-lg hover:bg-neutral-700 transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <Calendar size={18} />
                  Book a Call
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        <footer className="py-8 bg-black border-t border-neutral-900">
          <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-neutral-500">
            <p>&copy; 2024 Addictive Editing. All rights reserved.</p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              {SOCIAL_LINKS.filter((link) => link.isValid).map((link) => {
                const Icon = iconMap[link.icon];
                return (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                    aria-label={link.platform}
                  >
                    {Icon ? <Icon size={18} /> : link.platform}
                  </a>
                );
              })}
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
};

export default App;
