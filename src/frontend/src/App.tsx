import { Toaster } from "@/components/ui/sonner";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import AdminPage from "./admin/AdminPage";
import BottomNav, { type TabId } from "./components/BottomNav";
import FloatingHearts from "./components/FloatingHearts";
import HomeTab from "./components/HomeTab";
import LoginModal from "./components/LoginModal";
import MemoryTab from "./components/MemoryTab";
import QuestionTab from "./components/QuestionTab";
import VideoTab from "./components/VideoTab";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { useGetTheme } from "./hooks/useQueries";

function useThemeLoader() {
  const { data: theme } = useGetTheme();
  useEffect(() => {
    if (!theme) return;
    const root = document.documentElement;
    root.style.setProperty("--primary-color", theme.primaryColor || "#D9A0A8");
    root.style.setProperty("--accent-color", theme.accentColor || "#E6B5BC");
    root.style.setProperty(
      "--background-color",
      theme.backgroundColor || "#F6D6DA",
    );
    root.style.setProperty("--font-style", theme.fontStyle || "Poppins");
  }, [theme]);
}

function TopRightAuth() {
  const { isLoggedIn, isAdmin, username, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  if (isLoggedIn) {
    return (
      <>
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          <span
            className="font-sans-ui text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{
              background: "rgba(255,255,255,0.7)",
              color: "oklch(0.45 0.04 5)",
              backdropFilter: "blur(8px)",
            }}
          >
            {isAdmin ? `${username} 🔑` : `Hi, ${username} 👤`}
          </span>
          {isAdmin && (
            <a
              href="/admin"
              data-ocid="nav.admin.link"
              className="font-sans-ui text-xs font-semibold px-3 py-1.5 rounded-full transition-opacity hover:opacity-80"
              style={{
                background: "oklch(0.56 0.12 5)",
                color: "white",
              }}
            >
              ⚙️ Admin
            </a>
          )}
          <button
            type="button"
            data-ocid="nav.logout.button"
            onClick={logout}
            className="font-sans-ui text-xs font-semibold px-3 py-1.5 rounded-full transition-opacity hover:opacity-80"
            style={{
              background: "rgba(255,255,255,0.7)",
              color: "oklch(0.45 0.04 5)",
              backdropFilter: "blur(8px)",
            }}
          >
            Logout
          </button>
        </div>
        <LoginModal open={false} onClose={() => {}} />
      </>
    );
  }

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <button
          type="button"
          data-ocid="nav.login.button"
          onClick={() => setShowLogin(true)}
          className="font-sans-ui text-xs font-semibold px-4 py-2 rounded-full shadow-love transition-all hover:shadow-love-lg"
          style={{
            background: "oklch(0.56 0.12 5)",
            color: "white",
          }}
        >
          Login 💕
        </button>
      </div>
      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}

function PublicSite() {
  const [activeTab, setActiveTab] = useState<TabId>("home");

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Background image layer */}
      <div className="love-bg fixed inset-0 -z-10" aria-hidden="true" />
      {/* Gradient overlay */}
      <div
        className="fixed inset-0 -z-10"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(160deg, rgba(246,194,204,0.55) 0%, rgba(243,182,176,0.45) 40%, rgba(183,160,199,0.55) 100%)",
        }}
      />

      <FloatingHearts />
      <TopRightAuth />

      <main className="relative z-10 max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {activeTab === "home" && <HomeTab />}
            {activeTab === "memory" && <MemoryTab />}
            {activeTab === "question" && <QuestionTab />}
            {activeTab === "video" && <VideoTab />}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      <footer className="relative z-10 text-center pb-24 pt-2">
        <p
          className="font-sans-ui text-xs"
          style={{ color: "oklch(0.45 0.04 5)" }}
        >
          &copy; {new Date().getFullYear()}. Built with{" "}
          <span className="animate-pulse-heart inline-block">❤️</span> using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-80 transition-opacity"
            style={{ color: "oklch(0.50 0.13 5)" }}
          >
            caffeine.ai
          </a>
        </p>
      </footer>

      <Toaster />
    </div>
  );
}

function AppInner() {
  useThemeLoader();
  const isAdmin = window.location.pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <>
        <AdminPage />
        <Toaster />
      </>
    );
  }

  return <PublicSite />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
