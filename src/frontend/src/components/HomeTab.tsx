import { Heart } from "lucide-react";
import { motion } from "motion/react";
import { useGetHome } from "../hooks/useQueries";
import BlobImage from "./BlobImage";

export default function HomeTab() {
  const { data: homeData } = useGetHome();

  const title = homeData?.title || "Amoré";
  const subtitle =
    homeData?.subtitle ||
    "Every moment shared is a treasure. Capture your most precious memories, answer heartfelt questions, and relive your beautiful journey together.";
  const heroImageId = homeData?.heroImageId || "";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 pb-32 pt-8 relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <motion.h1
            className="font-script text-6xl leading-none"
            style={{ color: "oklch(0.50 0.13 5)" }}
            animate={{ scale: [1, 1.04, 1] }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            {title}
          </motion.h1>
          <div className="flex items-center justify-center gap-2 mt-1">
            <div
              className="h-px w-16"
              style={{
                background:
                  "linear-gradient(to right, transparent, oklch(0.50 0.13 5 / 0.5))",
              }}
            />
            <Heart
              size={12}
              fill="oklch(0.50 0.13 5)"
              style={{ color: "oklch(0.50 0.13 5)" }}
            />
            <div
              className="h-px w-16"
              style={{
                background:
                  "linear-gradient(to left, transparent, oklch(0.50 0.13 5 / 0.5))",
              }}
            />
          </div>
        </div>

        {/* Hero image */}
        <div className="glass-panel rounded-3xl overflow-hidden shadow-love-lg mb-6">
          <div className="relative h-72 overflow-hidden">
            {heroImageId ? (
              <BlobImage
                src={heroImageId}
                alt="Hero image"
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src="/assets/generated/hero-couple.dim_600x700.jpg"
                alt="A romantic couple"
                className="w-full h-full object-cover"
              />
            )}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(245,194,204,0.6) 0%, transparent 60%)",
              }}
            />
            <p
              className="absolute bottom-4 left-4 font-script text-3xl"
              style={{ color: "rgba(255,255,255,0.95)" }}
            >
              Together Forever
            </p>
          </div>
        </div>

        {/* Text card */}
        <div className="glass-panel rounded-3xl p-6 shadow-love text-center">
          <h2
            className="font-serif-display text-2xl font-bold uppercase tracking-wider mb-3"
            style={{ color: "oklch(0.14 0.01 5)" }}
          >
            Celebrate Your
            <br />
            Love Story
          </h2>
          <p
            className="font-sans-ui text-sm leading-relaxed mb-5"
            style={{ color: "oklch(0.36 0.03 5)" }}
          >
            {subtitle}
          </p>
        </div>

        {/* Decorative hearts row */}
        <div className="flex justify-center gap-4 mt-6">
          {["💕", "💖", "💗", "💝", "💕"].map((e, i) => (
            <motion.span
              key={e + String(i)}
              className="text-xl"
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 2 + i * 0.3,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            >
              {e}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
