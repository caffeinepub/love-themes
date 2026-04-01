import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Home,
  Image,
  ImagePlus,
  LogOut,
  MessageSquare,
  Palette,
  Users,
  Video,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import HomeEditor from "./HomeEditor";
import MemoriesManager from "./MemoriesManager";
import QuestionsManager from "./QuestionsManager";
import ThemeEditor from "./ThemeEditor";
import UsersManager from "./UsersManager";
import VideosManager from "./VideosManager";

type AdminSection =
  | "theme"
  | "home"
  | "memories"
  | "questions"
  | "videos"
  | "users";

const NAV_ITEMS: {
  id: AdminSection;
  label: string;
  icon: React.FC<{ size?: number; className?: string }>;
}[] = [
  { id: "theme", label: "Theme Editor", icon: Palette },
  { id: "home", label: "Home Editor", icon: Home },
  { id: "memories", label: "Memories", icon: Image },
  { id: "questions", label: "Questions", icon: MessageSquare },
  { id: "videos", label: "Videos", icon: Video },
  { id: "users", label: "Users", icon: Users },
];

function AdminLogin() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const ok = login(username.trim(), password);
    if (!ok) {
      setError("Invalid credentials. Admin username and password required.");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #F6D6DA 0%, #F1C3B2 100%)",
      }}
    >
      <div className="bg-white/80 backdrop-blur rounded-3xl shadow-love-lg p-10 max-w-sm w-full mx-4">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🔐</div>
          <h1
            className="font-serif-display text-2xl font-bold mb-1"
            style={{ color: "oklch(0.14 0.01 5)" }}
          >
            Admin Panel
          </h1>
          <p
            className="font-sans-ui text-sm"
            style={{ color: "oklch(0.45 0.04 5)" }}
          >
            Login with your admin credentials to access the dashboard.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label className="font-sans-ui text-sm">Username</Label>
            <Input
              data-ocid="admin.login.input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="rounded-xl"
              autoComplete="username"
            />
          </div>
          <div className="space-y-1">
            <Label className="font-sans-ui text-sm">Password</Label>
            <Input
              data-ocid="admin.login.input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="rounded-xl"
              autoComplete="current-password"
            />
          </div>
          {error && (
            <p
              data-ocid="admin.login.error_state"
              className="font-sans-ui text-xs text-center"
              style={{ color: "oklch(0.50 0.18 25)" }}
            >
              {error}
            </p>
          )}
          <Button
            data-ocid="admin.login.submit_button"
            type="submit"
            disabled={!username || !password}
            className="w-full rounded-full font-sans-ui font-semibold"
            style={{
              background: "oklch(0.56 0.12 5)",
              color: "white",
              border: "none",
            }}
          >
            Login to Admin
          </Button>
        </form>
        <a
          href="/"
          className="block mt-4 font-sans-ui text-sm underline text-center"
          style={{ color: "oklch(0.50 0.13 5)" }}
        >
          ← Back to Site
        </a>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { isAdmin, username, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<AdminSection>("theme");

  if (!isAdmin) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#faf5f6" }}>
      {/* Sidebar */}
      <aside
        className="w-64 shrink-0 bg-white border-r flex flex-col"
        style={{ borderColor: "oklch(0.88 0.04 5)" }}
      >
        <div
          className="p-6 border-b"
          style={{ borderColor: "oklch(0.88 0.04 5)" }}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">💝</span>
            <div>
              <p
                className="font-serif-display font-bold text-sm"
                style={{ color: "oklch(0.14 0.01 5)" }}
              >
                Love Themes
              </p>
              <p
                className="font-sans-ui text-xs"
                style={{ color: "oklch(0.56 0.12 5)" }}
              >
                Admin: {username}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1" aria-label="Admin navigation">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              data-ocid={`admin.${id}.link`}
              onClick={() => setActiveSection(id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left font-sans-ui text-sm font-medium transition-all ${
                activeSection === id
                  ? "text-white shadow-love"
                  : "hover:bg-pink-50"
              }`}
              style={{
                background:
                  activeSection === id ? "oklch(0.56 0.12 5)" : "transparent",
                color: activeSection === id ? "white" : "oklch(0.36 0.03 5)",
              }}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        <div
          className="p-4 border-t space-y-2"
          style={{ borderColor: "oklch(0.88 0.04 5)" }}
        >
          <a
            href="/"
            data-ocid="admin.home.link"
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-sans-ui text-sm hover:bg-pink-50 transition-colors"
            style={{ color: "oklch(0.45 0.04 5)" }}
          >
            <ImagePlus size={16} /> View Site
          </a>
          <button
            type="button"
            data-ocid="admin.logout.button"
            onClick={() => {
              logout();
            }}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-xl font-sans-ui text-sm hover:bg-red-50 transition-colors"
            style={{ color: "oklch(0.45 0.04 5)" }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-8">
        {activeSection === "theme" && <ThemeEditor />}
        {activeSection === "home" && <HomeEditor />}
        {activeSection === "memories" && <MemoriesManager />}
        {activeSection === "questions" && <QuestionsManager />}
        {activeSection === "videos" && <VideosManager />}
        {activeSection === "users" && <UsersManager />}
      </main>
    </div>
  );
}
