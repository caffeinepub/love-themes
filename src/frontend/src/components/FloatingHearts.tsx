import { useEffect, useState } from "react";

interface Heart {
  id: number;
  left: number;
  duration: number;
  delay: number;
  size: number;
  emoji: string;
}

export default function FloatingHearts() {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    const emojis = ["❤️", "💕", "💖", "💗", "💝", "🌸", "✨"];
    const initial: Heart[] = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: Math.random() * 95,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 10,
      size: 0.8 + Math.random() * 1.2,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }));
    setHearts(initial);
  }, []);

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    >
      {hearts.map((h) => (
        <span
          key={h.id}
          className="heart-float"
          style={{
            left: `${h.left}%`,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
            fontSize: `${h.size}rem`,
            opacity: 0,
          }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  );
}
