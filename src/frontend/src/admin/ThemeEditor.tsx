import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useGetTheme, useSaveTheme } from "../hooks/useQueries";

const FONT_OPTIONS = [
  { value: "Poppins", label: "Poppins" },
  { value: "Inter", label: "Inter" },
  { value: "Georgia", label: "Georgia" },
  { value: "Playfair Display", label: "Playfair Display" },
];

export default function ThemeEditor() {
  const { data: theme, isLoading } = useGetTheme();
  const saveTheme = useSaveTheme();

  const [form, setForm] = useState({
    primaryColor: "#D9A0A8",
    accentColor: "#E6B5BC",
    backgroundColor: "#F6D6DA",
    fontStyle: "Poppins",
  });

  useEffect(() => {
    if (theme) {
      setForm({
        primaryColor: theme.primaryColor || "#D9A0A8",
        accentColor: theme.accentColor || "#E6B5BC",
        backgroundColor: theme.backgroundColor || "#F6D6DA",
        fontStyle: theme.fontStyle || "Poppins",
      });
    }
  }, [theme]);

  const handleSave = async () => {
    try {
      await saveTheme.mutateAsync(form);
      document.documentElement.style.setProperty(
        "--primary-color",
        form.primaryColor,
      );
      document.documentElement.style.setProperty(
        "--accent-color",
        form.accentColor,
      );
      document.documentElement.style.setProperty(
        "--background-color",
        form.backgroundColor,
      );
      document.documentElement.style.setProperty(
        "--font-style",
        form.fontStyle,
      );
      toast.success("Theme saved successfully!");
    } catch {
      toast.error("Failed to save theme");
    }
  };

  if (isLoading) {
    return (
      <div
        data-ocid="theme.loading_state"
        className="flex items-center justify-center h-40"
      >
        <Loader2
          className="animate-spin"
          style={{ color: "oklch(0.56 0.12 5)" }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <h2
        className="font-serif-display text-2xl font-bold mb-1"
        style={{ color: "oklch(0.14 0.01 5)" }}
      >
        Theme Editor
      </h2>
      <p
        className="font-sans-ui text-sm mb-6"
        style={{ color: "oklch(0.45 0.04 5)" }}
      >
        Customize the colors and typography of your love site.
      </p>

      <div className="bg-white rounded-2xl shadow-love p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="font-sans-ui text-sm font-semibold">
              Primary Color
            </Label>
            <div className="flex items-center gap-2">
              <input
                data-ocid="theme.primary_color.input"
                type="color"
                value={form.primaryColor}
                onChange={(e) =>
                  setForm((p) => ({ ...p, primaryColor: e.target.value }))
                }
                className="w-10 h-10 rounded-lg border cursor-pointer"
                style={{ borderColor: "oklch(0.88 0.04 5)" }}
              />
              <span
                className="font-sans-ui text-xs"
                style={{ color: "oklch(0.45 0.04 5)" }}
              >
                {form.primaryColor}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="font-sans-ui text-sm font-semibold">
              Accent Color
            </Label>
            <div className="flex items-center gap-2">
              <input
                data-ocid="theme.accent_color.input"
                type="color"
                value={form.accentColor}
                onChange={(e) =>
                  setForm((p) => ({ ...p, accentColor: e.target.value }))
                }
                className="w-10 h-10 rounded-lg border cursor-pointer"
                style={{ borderColor: "oklch(0.88 0.04 5)" }}
              />
              <span
                className="font-sans-ui text-xs"
                style={{ color: "oklch(0.45 0.04 5)" }}
              >
                {form.accentColor}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="font-sans-ui text-sm font-semibold">
              Background Color
            </Label>
            <div className="flex items-center gap-2">
              <input
                data-ocid="theme.background_color.input"
                type="color"
                value={form.backgroundColor}
                onChange={(e) =>
                  setForm((p) => ({ ...p, backgroundColor: e.target.value }))
                }
                className="w-10 h-10 rounded-lg border cursor-pointer"
                style={{ borderColor: "oklch(0.88 0.04 5)" }}
              />
              <span
                className="font-sans-ui text-xs"
                style={{ color: "oklch(0.45 0.04 5)" }}
              >
                {form.backgroundColor}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-sans-ui text-sm font-semibold">
            Font Style
          </Label>
          <Select
            value={form.fontStyle}
            onValueChange={(v) => setForm((p) => ({ ...p, fontStyle: v }))}
          >
            <SelectTrigger
              data-ocid="theme.font_style.select"
              className="w-48 rounded-xl"
            >
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              {FONT_OPTIONS.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div
          className="rounded-xl p-4"
          style={{ background: `${form.backgroundColor}33` }}
        >
          <p
            className="text-xs font-sans-ui uppercase tracking-widest mb-2"
            style={{ color: "oklch(0.45 0.04 5)" }}
          >
            Preview
          </p>
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full"
              style={{ background: form.primaryColor }}
            />
            <div
              className="w-8 h-8 rounded-full"
              style={{ background: form.accentColor }}
            />
            <div
              className="w-8 h-8 rounded-full border-2"
              style={{
                background: form.backgroundColor,
                borderColor: form.primaryColor,
              }}
            />
            <span
              style={{ fontFamily: form.fontStyle, color: form.primaryColor }}
              className="font-semibold"
            >
              Love Themes
            </span>
          </div>
        </div>

        <Button
          data-ocid="theme.save_button"
          onClick={handleSave}
          disabled={saveTheme.isPending}
          className="rounded-full px-8 font-sans-ui font-semibold"
          style={{
            background: "oklch(0.56 0.12 5)",
            color: "white",
            border: "none",
          }}
        >
          {saveTheme.isPending ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Saving...
            </>
          ) : (
            "Save Theme"
          )}
        </Button>
      </div>
    </div>
  );
}
