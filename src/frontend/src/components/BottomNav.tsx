import { Heart, Home, MessageCircle, Play } from "lucide-react";
import { motion } from "motion/react";

export type TabId = "home" | "memory" | "question" | "video";

const tabs = [
  { id: "home" as TabId, label: "HOME", icon: Home },
  { id: "memory" as TabId, label: "MEMORY", icon: Heart },
  { id: "question" as TabId, label: "QUESTION", icon: MessageCircle },
  { id: "video" as TabId, label: "VIDEO", icon: Play },
];

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md"
      aria-label="Main navigation"
    >
      <div className="glass-nav rounded-3xl shadow-love flex items-center justify-around px-2 py-2">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              type="button"
              key={id}
              data-ocid={`nav.${id}.link`}
              onClick={() => onTabChange(id)}
              className="relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-colors duration-200 min-w-[58px]"
              style={{
                color: isActive ? "oklch(0.50 0.13 5)" : "oklch(0.45 0.04 5)",
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-active-bg"
                  className="absolute inset-0 rounded-2xl"
                  style={{ background: "rgba(198,106,131,0.18)" }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <motion.div
                animate={{ scale: isActive ? 1.2 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="relative z-10"
              >
                <Icon size={20} />
              </motion.div>
              <span className="relative z-10 font-sans-ui text-[9px] font-semibold tracking-widest uppercase leading-none">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
