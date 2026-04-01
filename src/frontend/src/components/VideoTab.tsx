import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Film, Pencil, Play, Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Video } from "../backend";
import { useAuth } from "../contexts/AuthContext";
import {
  useAddVideo,
  useDeleteVideo,
  useGetVideos,
  useUpdateVideo,
} from "../hooks/useQueries";
import BlobImage from "./BlobImage";
import FileUpload from "./FileUpload";

const SAMPLE_VIDEOS: Video[] = [
  {
    id: "v1",
    title: "Our Wedding Highlight Reel",
    thumbnailImageId: "",
    description: "The most magical day of our lives, beautifully captured.",
    videoUrl: "",
  },
  {
    id: "v2",
    title: "First Anniversary Vlog",
    thumbnailImageId: "",
    description: "One year of love, laughter, and unforgettable moments.",
    videoUrl: "",
  },
  {
    id: "v3",
    title: "Paris Honeymoon Memories",
    thumbnailImageId: "",
    description: "Strolling through the city of love hand in hand.",
    videoUrl: "",
  },
  {
    id: "v4",
    title: "The Proposal — Behind the Scenes",
    thumbnailImageId: "",
    description: "The moment that changed everything forever.",
    videoUrl: "",
  },
];

const VIDEO_GRADIENTS = [
  "linear-gradient(135deg, #f6c2cc 0%, #b7a0c7 100%)",
  "linear-gradient(135deg, #f3b6b0 0%, #e8a0b4 100%)",
  "linear-gradient(135deg, #d4a0c7 0%, #f6c2cc 100%)",
  "linear-gradient(135deg, #ffd6e0 0%, #b7a0c7 100%)",
];

const EMPTY_VIDEO: Video = {
  id: "",
  title: "",
  description: "",
  videoUrl: "",
  thumbnailImageId: "",
};

function VideoCard({
  video,
  index,
  isAdmin,
  onEdit,
  onDelete,
}: {
  video: Video;
  index: number;
  isAdmin: boolean;
  onEdit: (v: Video) => void;
  onDelete: (id: string) => void;
}) {
  const [playing, setPlaying] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      data-ocid={`video.item.${index + 1}`}
      className="glass-panel rounded-2xl overflow-hidden shadow-love relative"
    >
      {isAdmin && (
        <div className="absolute top-2 right-2 z-10 flex gap-1">
          <button
            type="button"
            data-ocid={`video.edit_button.${index + 1}`}
            onClick={() => onEdit(video)}
            className="w-7 h-7 rounded-full flex items-center justify-center shadow"
            style={{ background: "rgba(255,255,255,0.9)" }}
          >
            <Pencil size={12} style={{ color: "oklch(0.56 0.12 5)" }} />
          </button>
          <button
            type="button"
            data-ocid={`video.delete_button.${index + 1}`}
            onClick={() => onDelete(video.id)}
            className="w-7 h-7 rounded-full flex items-center justify-center shadow"
            style={{ background: "rgba(255,255,255,0.9)" }}
          >
            <Trash2 size={12} className="text-red-400" />
          </button>
        </div>
      )}
      {video.videoUrl && playing ? (
        <video
          src={video.videoUrl}
          controls
          autoPlay
          className="w-full aspect-video rounded-t-2xl"
        >
          <track kind="captions" />
        </video>
      ) : (
        <button
          type="button"
          data-ocid="video.canvas_target"
          className="w-full aspect-video relative flex items-center justify-center group cursor-pointer"
          style={{
            background: VIDEO_GRADIENTS[index % VIDEO_GRADIENTS.length],
          }}
          onClick={() => {
            if (video.videoUrl) setPlaying(true);
          }}
        >
          {video.thumbnailImageId ? (
            <BlobImage
              src={video.thumbnailImageId}
              alt={video.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center opacity-20 text-6xl select-none">
              🎬
            </div>
          )}
          <motion.div
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            className="relative z-10 w-14 h-14 rounded-full flex items-center justify-center shadow-love"
            style={{ background: "rgba(255,255,255,0.88)" }}
          >
            <Play
              size={22}
              fill="oklch(0.56 0.12 5)"
              style={{ color: "oklch(0.56 0.12 5)", marginLeft: 2 }}
            />
          </motion.div>
        </button>
      )}
      <div className="p-3">
        <div className="flex items-center gap-2">
          <Film size={14} style={{ color: "oklch(0.50 0.13 5)" }} />
          <span
            className="font-serif-display text-sm font-semibold"
            style={{ color: "oklch(0.14 0.01 5)" }}
          >
            {video.title}
          </span>
        </div>
        {video.description && (
          <p
            className="font-sans-ui text-[11px] mt-1 leading-snug"
            style={{ color: "oklch(0.45 0.04 5)" }}
          >
            {video.description}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default function VideoTab() {
  const { isAdmin } = useAuth();
  const { data: backendVideos = [] } = useGetVideos();
  const videos = backendVideos.length > 0 ? backendVideos : SAMPLE_VIDEOS;

  const addVideo = useAddVideo();
  const updateVideo = useUpdateVideo();
  const deleteVideo = useDeleteVideo();

  const [open, setOpen] = useState(false);
  const [editingV, setEditingV] = useState<Video | null>(null);
  const [form, setForm] = useState<Video>(EMPTY_VIDEO);

  const openAdd = () => {
    setEditingV(null);
    setForm({ ...EMPTY_VIDEO, id: crypto.randomUUID() });
    setOpen(true);
  };

  const openEdit = (v: Video) => {
    setEditingV(v);
    setForm({ ...v });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this video?")) return;
    await deleteVideo.mutateAsync(id);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    if (editingV) {
      await updateVideo.mutateAsync(form);
    } else {
      await addVideo.mutateAsync(form);
    }
    setOpen(false);
  };

  const saving = addVideo.isPending || updateVideo.isPending;

  return (
    <div className="min-h-screen px-4 pt-8 pb-32">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto"
      >
        <div className="text-center mb-6">
          <h2
            className="font-script text-4xl"
            style={{ color: "oklch(0.50 0.13 5)" }}
          >
            Our Videos
          </h2>
          <p
            className="font-sans-ui text-sm mt-1"
            style={{ color: "oklch(0.36 0.03 5)" }}
          >
            Relive the most beautiful moments
          </p>
        </div>

        {isAdmin && (
          <div className="flex justify-center mb-5">
            <Button
              data-ocid="video.open_modal_button"
              onClick={openAdd}
              className="rounded-full px-6 py-2 font-sans-ui text-sm font-semibold uppercase tracking-wide shadow-love"
              style={{
                background: "oklch(0.56 0.12 5)",
                color: "oklch(0.98 0.01 5)",
                border: "none",
              }}
            >
              <Plus size={16} className="mr-1" /> Add Video
            </Button>
          </div>
        )}

        <div className="space-y-3">
          {videos.map((v, i) => (
            <VideoCard
              key={v.id}
              video={v}
              index={i}
              isAdmin={isAdmin}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </motion.div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          data-ocid="video.dialog"
          className="rounded-2xl max-w-lg"
        >
          <DialogHeader>
            <DialogTitle className="font-serif-display">
              {editingV ? "Edit Video" : "Add Video"}
            </DialogTitle>
          </DialogHeader>
          {/* Save at top */}
          <div
            className="flex gap-2 justify-end pb-2 border-b"
            style={{ borderColor: "oklch(0.92 0.02 5)" }}
          >
            <Button
              data-ocid="video.cancel_button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              data-ocid="video.save_button"
              onClick={handleSave}
              disabled={saving || !form.title.trim()}
              className="rounded-full"
              style={{
                background: "oklch(0.56 0.12 5)",
                color: "white",
                border: "none",
              }}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <Label>Title</Label>
              <Input
                data-ocid="video.title.input"
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="Video title"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label>Description</Label>
              <Textarea
                data-ocid="video.description.textarea"
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Short description..."
                className="rounded-xl resize-none"
                rows={2}
              />
            </div>
            <div className="space-y-1">
              <Label>Video URL</Label>
              <Input
                data-ocid="video.url.input"
                value={form.videoUrl}
                onChange={(e) =>
                  setForm((p) => ({ ...p, videoUrl: e.target.value }))
                }
                placeholder="https://..."
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label>Thumbnail Image</Label>
              <FileUpload
                value={form.thumbnailImageId}
                onChange={(url) =>
                  setForm((p) => ({ ...p, thumbnailImageId: url }))
                }
                label="Upload thumbnail"
              />
            </div>
            {/* Save at bottom too */}
            <div className="flex gap-2 justify-end pt-2">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="rounded-full"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving || !form.title.trim()}
                className="rounded-full"
                style={{
                  background: "oklch(0.56 0.12 5)",
                  color: "white",
                  border: "none",
                }}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
