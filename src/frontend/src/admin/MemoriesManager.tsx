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
import type { Memory } from "../backend";
import FileUpload from "../components/FileUpload";
import {
  useAddMemory,
  useDeleteMemory,
  useGetMemories,
  useUpdateMemory,
} from "../hooks/useQueries";

const EMPTY: Memory = {
  id: "",
  title: "",
  date: "",
  description: "",
  imageId: "",
};

export default function MemoriesManager() {
  const { data: memories = [], isLoading } = useGetMemories();
  const addMemory = useAddMemory();
  const updateMemory = useUpdateMemory();
  const deleteMemory = useDeleteMemory();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Memory | null>(null);
  const [form, setForm] = useState<Memory>(EMPTY);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY, id: crypto.randomUUID() });
    setOpen(true);
  };

  const openEdit = (m: Memory) => {
    setEditing(m);
    setForm({ ...m });
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await updateMemory.mutateAsync(form);
        toast.success("Memory updated!");
      } else {
        await addMemory.mutateAsync(form);
        toast.success("Memory added!");
      }
      setOpen(false);
    } catch {
      toast.error("Failed to save memory");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this memory?")) return;
    try {
      await deleteMemory.mutateAsync(id);
      toast.success("Memory deleted");
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
            Memories
          </h2>
          <p
            className="font-sans-ui text-sm"
            style={{ color: "oklch(0.45 0.04 5)" }}
          >
            Manage your precious memories
          </p>
        </div>
        <Button
          data-ocid="memories.open_modal_button"
          onClick={openAdd}
          className="rounded-full font-sans-ui font-semibold"
          style={{
            background: "oklch(0.56 0.12 5)",
            color: "white",
            border: "none",
          }}
        >
          <Plus size={16} className="mr-1" /> Add Memory
        </Button>
      </div>

      {isLoading ? (
        <div
          data-ocid="memories.loading_state"
          className="flex justify-center py-12"
        >
          <Loader2
            className="animate-spin"
            style={{ color: "oklch(0.56 0.12 5)" }}
          />
        </div>
      ) : memories.length === 0 ? (
        <div
          data-ocid="memories.empty_state"
          className="text-center py-12 bg-white rounded-2xl"
        >
          <div className="text-4xl mb-2">📷</div>
          <p
            className="font-sans-ui text-sm"
            style={{ color: "oklch(0.45 0.04 5)" }}
          >
            No memories yet. Add your first one!
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-love overflow-hidden">
          <Table data-ocid="memories.table">
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {memories.map((m, i) => (
                <TableRow key={m.id} data-ocid={`memories.row.${i + 1}`}>
                  <TableCell className="font-medium">{m.title}</TableCell>
                  <TableCell>{m.date}</TableCell>
                  <TableCell
                    className="max-w-xs truncate text-sm"
                    style={{ color: "oklch(0.45 0.04 5)" }}
                  >
                    {m.description}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        data-ocid={`memories.edit_button.${i + 1}`}
                        onClick={() => openEdit(m)}
                        className="p-1.5 rounded-lg hover:bg-pink-50 transition-colors"
                      >
                        <Pencil
                          size={14}
                          style={{ color: "oklch(0.56 0.12 5)" }}
                        />
                      </button>
                      <button
                        type="button"
                        data-ocid={`memories.delete_button.${i + 1}`}
                        onClick={() => handleDelete(m.id)}
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
        <DialogContent data-ocid="memories.dialog" className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif-display">
              {editing ? "Edit Memory" : "Add Memory"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <Label>Title</Label>
              <Input
                data-ocid="memories.title.input"
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="Memory title"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label>Date</Label>
              <Input
                data-ocid="memories.date.input"
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((p) => ({ ...p, date: e.target.value }))
                }
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label>Description</Label>
              <Textarea
                data-ocid="memories.description.textarea"
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Describe this memory..."
                className="rounded-xl resize-none"
                rows={3}
              />
            </div>
            <div className="space-y-1">
              <Label>Image</Label>
              <FileUpload
                data-ocid="memories.upload_button"
                value={form.imageId}
                onChange={(url) => setForm((p) => ({ ...p, imageId: url }))}
              />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button
                data-ocid="memories.cancel_button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="rounded-full"
              >
                Cancel
              </Button>
              <Button
                data-ocid="memories.save_button"
                onClick={handleSave}
                disabled={addMemory.isPending || updateMemory.isPending}
                className="rounded-full"
                style={{
                  background: "oklch(0.56 0.12 5)",
                  color: "white",
                  border: "none",
                }}
              >
                {addMemory.isPending || updateMemory.isPending ? (
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
