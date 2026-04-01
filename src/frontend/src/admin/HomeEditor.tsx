import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import FileUpload from "../components/FileUpload";
import { useGetHome, useSaveHome } from "../hooks/useQueries";

export default function HomeEditor() {
  const { data: home, isLoading } = useGetHome();
  const saveHome = useSaveHome();
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    heroImageId: "",
  });

  useEffect(() => {
    if (home) {
      setForm({
        title: home.title || "",
        subtitle: home.subtitle || "",
        heroImageId: home.heroImageId || "",
      });
    }
  }, [home]);

  const handleSave = async () => {
    try {
      await saveHome.mutateAsync(form);
      toast.success("Home page saved!");
    } catch {
      toast.error("Failed to save home page");
    }
  };

  if (isLoading) {
    return (
      <div
        data-ocid="home_editor.loading_state"
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
        Home Editor
      </h2>
      <p
        className="font-sans-ui text-sm mb-6"
        style={{ color: "oklch(0.45 0.04 5)" }}
      >
        Edit the hero section of your love site.
      </p>

      <div className="bg-white rounded-2xl shadow-love p-6 space-y-4">
        <div className="space-y-2">
          <Label className="font-sans-ui text-sm font-semibold">
            Site Title
          </Label>
          <Input
            data-ocid="home_editor.title.input"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            placeholder="e.g. Amoré"
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label className="font-sans-ui text-sm font-semibold">
            Subtitle / Description
          </Label>
          <Textarea
            data-ocid="home_editor.subtitle.textarea"
            value={form.subtitle}
            onChange={(e) =>
              setForm((p) => ({ ...p, subtitle: e.target.value }))
            }
            placeholder="A short description about your love story..."
            className="rounded-xl resize-none"
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label className="font-sans-ui text-sm font-semibold">
            Hero Image
          </Label>
          <FileUpload
            data-ocid="home_editor.upload_button"
            value={form.heroImageId}
            onChange={(url) => setForm((p) => ({ ...p, heroImageId: url }))}
            label="Upload hero image"
          />
        </div>
        <Button
          data-ocid="home_editor.save_button"
          onClick={handleSave}
          disabled={saveHome.isPending}
          className="rounded-full px-8 font-sans-ui font-semibold"
          style={{
            background: "oklch(0.56 0.12 5)",
            color: "white",
            border: "none",
          }}
        >
          {saveHome.isPending ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Saving...
            </>
          ) : (
            "Save Home"
          )}
        </Button>
      </div>
    </div>
  );
}
