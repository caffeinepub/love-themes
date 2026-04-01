import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Video } from "../backend";
import FileUpload from "../components/FileUpload";
import {
  useAddVideo,
  useDeleteVideo,
  useGetVideos,
  useUpdateVideo,
} from "../hooks/useQueries";

const EMPTY: Video = {
  id: "",
  title: "",
  description: "",
  videoUrl: "",
  thumbnailImageId: "",
};

export default function VideosManager() {
  const { data: videos = [], isLoading } = useGetVideos();
  const addVideo = useAddVideo();
  const updateVideo = useUpdateVideo();
  const deleteVideo = useDeleteVideo();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Video | null>(null);
  const [form, setForm] = useState<Video>(EMPTY);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY, id: crypto.randomUUID() });
    setOpen(true);
  };

  const openEdit = (v: Video) => {
    setEditing(v);
    setForm({ ...v });
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await updateVideo.mutateAsync(form);
        toast.success("Video updated!");
      } else {
        await addVideo.mutateAsync(form);
        toast.success("Video added!");
      }
      setOpen(false);
    } catch {
      toast.error("Failed to save video");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this video?")) return;
    try {
      await deleteVideo.mutateAsync(id);
      toast.success("Video deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2
            className="font-serif-display text-2xl font-bold"
            style={{ color: "oklch(0.14 0.01 5)" }}
          >
            Videos
          </h2>
          <p
            className="font-sans-ui text-sm"
            style={{ color: "oklch(0.45 0.04 5)" }}
          >
            Manage your love videos
          </p>
        </div>
        <Button
          data-ocid="videos.open_modal_button"
          onClick={openAdd}
          className="rounded-full font-sans-ui font-semibold"
          style={{
            background: "oklch(0.56 0.12 5)",
            color: "white",
            border: "none",
          }}
        >
          <Plus size={16} className="mr-1" /> Add Video
        </Button>
      </div>

      {isLoading ? (
        <div
          data-ocid="videos.loading_state"
          className="flex justify-center py-12"
        >
          <Loader2
            className="animate-spin"
            style={{ color: "oklch(0.56 0.12 5)" }}
          />
        </div>
      ) : videos.length === 0 ? (
        <div
          data-ocid="videos.empty_state"
          className="text-center py-12 bg-white rounded-2xl"
        >
          <div className="text-4xl mb-2">🎬</div>
          <p
            className="font-sans-ui text-sm"
            style={{ color: "oklch(0.45 0.04 5)" }}
          >
            No videos yet. Add your first one!
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-love overflow-hidden">
          <Table data-ocid="videos.table">
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Video URL</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videos.map((v, i) => (
                <TableRow key={v.id} data-ocid={`videos.row.${i + 1}`}>
                  <TableCell className="font-medium">{v.title}</TableCell>
                  <TableCell
                    className="max-w-xs truncate text-sm"
                    style={{ color: "oklch(0.45 0.04 5)" }}
                  >
                    {v.description}
                  </TableCell>
                  <TableCell
                    className="max-w-xs truncate text-xs"
                    style={{ color: "oklch(0.45 0.04 5)" }}
                  >
                    {v.videoUrl || "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        data-ocid={`videos.edit_button.${i + 1}`}
                        onClick={() => openEdit(v)}
                        className="p-1.5 rounded-lg hover:bg-pink-50 transition-colors"
                      >
                        <Pencil
                          size={14}
                          style={{ color: "oklch(0.56 0.12 5)" }}
                        />
                      </button>
                      <button
                        type="button"
                        data-ocid={`videos.delete_button.${i + 1}`}
                        onClick={() => handleDelete(v.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={14} className="text-red-400" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          data-ocid="videos.dialog"
          className="rounded-2xl max-w-lg"
        >
          <DialogHeader>
            <DialogTitle className="font-serif-display">
              {editing ? "Edit Video" : "Add Video"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <Label>Title</Label>
              <Input
                data-ocid="videos.title.input"
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
                data-ocid="videos.description.textarea"
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
                data-ocid="videos.url.input"
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
                data-ocid="videos.upload_button"
                value={form.thumbnailImageId}
                onChange={(url) =>
                  setForm((p) => ({ ...p, thumbnailImageId: url }))
                }
                label="Upload thumbnail"
              />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button
                data-ocid="videos.cancel_button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="rounded-full"
              >
                Cancel
              </Button>
              <Button
                data-ocid="videos.save_button"
                onClick={handleSave}
                disabled={addVideo.isPending || updateVideo.isPending}
                className="rounded-full"
                style={{
                  background: "oklch(0.56 0.12 5)",
                  color: "white",
                  border: "none",
                }}
              >
                {addVideo.isPending || updateVideo.isPending ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
