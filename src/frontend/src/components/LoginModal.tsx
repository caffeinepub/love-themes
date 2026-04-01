import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

function LoginForm({
  label,
  emoji,
  onClose,
}: {
  label: string;
  emoji: string;
  onClose: () => void;
}) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const ok = login(username.trim(), password);
    setLoading(false);
    if (ok) {
      onClose();
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 pt-2">
      <div className="text-center text-3xl mb-1">{emoji}</div>
      <p
        className="text-center font-sans-ui text-xs mb-3"
        style={{ color: "oklch(0.45 0.04 5)" }}
      >
        {label}
      </p>
      <Input
        data-ocid="login.input"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="rounded-xl bg-white/60"
        autoComplete="username"
      />
      <Input
        data-ocid="login.input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="rounded-xl bg-white/60"
        autoComplete="current-password"
      />
      {error && (
        <p
          data-ocid="login.error_state"
          className="font-sans-ui text-xs text-center"
          style={{ color: "oklch(0.50 0.18 25)" }}
        >
          {error}
        </p>
      )}
      <Button
        data-ocid="login.submit_button"
        type="submit"
        disabled={loading || !username || !password}
        className="w-full rounded-full font-sans-ui font-semibold"
        style={{
          background: "oklch(0.56 0.12 5)",
          color: "white",
          border: "none",
        }}
      >
        {loading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            data-ocid="login.modal"
            className="w-full max-w-sm rounded-3xl p-6 shadow-love-lg"
            style={{
              background:
                "linear-gradient(140deg, rgba(246,214,218,0.97) 0%, rgba(243,182,176,0.97) 100%)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                className="font-script text-2xl"
                style={{ color: "oklch(0.50 0.13 5)" }}
              >
                Welcome Back 💕
              </h2>
              <button
                type="button"
                data-ocid="login.close_button"
                onClick={onClose}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/40 transition-colors font-bold text-lg"
                style={{ color: "oklch(0.45 0.04 5)" }}
              >
                ×
              </button>
            </div>

            <Tabs defaultValue="user">
              <TabsList
                className="w-full rounded-full mb-4"
                style={{ background: "rgba(255,255,255,0.4)" }}
              >
                <TabsTrigger
                  data-ocid="login.tab"
                  value="user"
                  className="flex-1 rounded-full font-sans-ui text-sm"
                >
                  👤 User Login
                </TabsTrigger>
                <TabsTrigger
                  data-ocid="login.tab"
                  value="admin"
                  className="flex-1 rounded-full font-sans-ui text-sm"
                >
                  🔑 Admin Login
                </TabsTrigger>
              </TabsList>
              <TabsContent value="user">
                <LoginForm
                  label="Login to view our love story"
                  emoji="💖"
                  onClose={onClose}
                />
              </TabsContent>
              <TabsContent value="admin">
                <LoginForm
                  label="Admin access — full editing permissions"
                  emoji="🛠️"
                  onClose={onClose}
                />
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
