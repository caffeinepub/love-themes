import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Pencil, Plus, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Memory } from "../backend";
import { useAuth } from "../contexts/AuthContext";
import {
  useAddMemory,
  useDeleteMemory,
  useGetMemories,
  useUpdateMemory,
} from "../hooks/useQueries";
import BlobImage from "./BlobImage";
import FileUpload from "./FileUpload";

const SAMPLE_MEMORIES: Memory[] = [
  {
    id: "s1",
    title: "Our First Date",
    date: "2022-03-14",
    description:
      "A magical evening at a candlelit trattoria where everything began.",
    imageId: "/assets/generated/memory-first-date.dim_400x300.jpg",
  },
  {
    id: "s2",
    title: "Beach Getaway",
    date: "2022-07-04",
    description: "Golden sunsets and warm waves — our perfect summer escape.",
    imageId: "/assets/generated/memory-beach.dim_400x300.jpg",
  },
  {
    id: "s3",
    title: "Paris Together",
    date: "2023-02-14",
    description:
      "Valentine's Day under the Eiffel Tower, city of love in full bloom.",
    imageId: "/assets/generated/memory-paris.dim_400x300.jpg",
  },
  {
    id: "s4",
    title: "Our Wedding Day",
    date: "2023-09-23",
    description:
      "The day we promised forever — surrounded by flowers and family.",
    imageId: "/assets/generated/memory-wedding.dim_400x300.jpg",
  },
  {
    id: "s5",
    title: "Mountain Hike",
    date: "2023-10-15",
    description: "Hand in hand through autumn forests and breathtaking peaks.",
    imageId: "",
  },
  {
    id: "s6",
    title: "1st Anniversary",
    date: "2024-03-14",
    description: "One year of love, laughter, and endless roses between us.",
    imageId: "",
  },
];

const GRADIENTS = [
  "linear-gradient(135deg, #f6c2cc, #e8a0b4)",
  "linear-gradient(135deg, #f3b6b0, #e09090)",
  "linear-gradient(135deg, #b7a0c7, #9880b2)",
  "linear-gradient(135deg, #f6c2cc, #b7a0c7)",
  "linear-gradient(135deg, #ffd6e0, #ffb3c6)",
  "linear-gradient(135deg, #e8b4d0, #c9a0c0)",
];

const EMPTY_FORM = { title: "", description: "", date: "", imageId: "" };

type MemoryForm = typeof EMPTY_FORM;

function MemoryFormSheet({
  title,
  form,
  setForm,
  onSave,
  onClose,
  saving,
}: {
  title: string;
  form: MemoryForm;
  setForm: (fn: (p: MemoryForm) => MemoryForm) => void;
  onSave: () => void;
  onClose: () => void;
  saving: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: "rgba(0,0,0,0.4)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        data-ocid="memory.dialog"
        className="glass-panel w-full max-w-md rounded-t-3xl shadow-love-lg overflow-hidden"
        style={{ maxHeight: "90vh" }}
      >
        {/* Sticky Save button at top */}
        <div
          className="sticky top-0 z-10 px-6 pt-5 pb-3 flex items-center justify-between"
          style={{
            background:
              "linear-gradient(to bottom, rgba(246,214,218,0.98) 80%, transparent)",
          }}
        >
          <h3
            className="font-script text-2xl"
            style={{ color: "oklch(0.50 0.13 5)" }}
          >
            {title}
          </h3>
          <div className="flex items-center gap-2">
            <Button
              data-ocid="memory.save_button"
              onClick={onSave}
              disabled={saving || !form.title.trim()}
              className="rounded-full font-sans-ui font-semibold px-5 py-1.5 text-sm"
              style={{
                background: "oklch(0.56 0.12 5)",
                color: "oklch(0.98 0.01 5)",
                border: "none",
              }}
            >
              {saving ? "Saving..." : "Save 💝"}
            </Button>
            <button
              type="button"
              data-ocid="memory.close_button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/30 transition-colors"
            >
              <X size={18} style={{ color: "oklch(0.36 0.03 5)" }} />
            </button>
          </div>
        </div>
        <div
          className="overflow-y-auto px-6 pb-8"
          style={{ maxHeight: "70vh" }}
        >
          <div className="space-y-3">
            <Input
              data-ocid="memory.input"
              placeholder="Memory title"
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
              className="rounded-xl bg-white/50"
            />
            <Input
              placeholder="Date (e.g. 2024-06-15)"
              value={form.date}
              onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
              className="rounded-xl bg-white/50"
            />
            <Textarea
              data-ocid="memory.textarea"
              placeholder="Describe this memory..."
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              className="rounded-xl bg-white/50 resize-none"
              rows={3}
            />
            <FileUpload
              value={form.imageId}
              onChange={(url) => setForm((p) => ({ ...p, imageId: url }))}
              label="Add photo (optional)"
            />
            {/* Bottom save button too */}
            <Button
              data-ocid="memory.submit_button"
              onClick={onSave}
              disabled={saving || !form.title.trim()}
              className="w-full rounded-full font-sans-ui font-semibold uppercase tracking-wide mt-2"
              style={{
                background: "oklch(0.56 0.12 5)",
                color: "oklch(0.98 0.01 5)",
                border: "none",
              }}
            >
              {saving ? "Saving..." : "Save Memory 💝"}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function MemoryCard({
  memory,
  index,
  onEdit,
  onDelete,
  isAdmin,
}: {
  memory: Memory;
  index: number;
  onEdit: (m: Memory) => void;
  onDelete: (id: string) => void;
  isAdmin: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      data-ocid={`memory.item.${index + 1}`}
      className="glass-panel rounded-2xl overflow-hidden shadow-love hover:shadow-love-lg hover:-translate-y-1 transition-all duration-300 relative"
    >
      {isAdmin && (
        <div className="absolute top-2 right-2 z-10 flex gap-1">
          <button
            type="button"
            data-ocid={`memory.edit_button.${index + 1}`}
            onClick={() => onEdit(memory)}
            className="w-6 h-6 rounded-full flex items-center justify-center shadow"
            style={{ background: "rgba(255,255,255,0.9)" }}
          >
            <Pencil size={11} style={{ color: "oklch(0.56 0.12 5)" }} />
          </button>
          <button
            type="button"
            data-ocid={`memory.delete_button.${index + 1}`}
            onClick={() => onDelete(memory.id)}
            className="w-6 h-6 rounded-full flex items-center justify-center shadow"
            style={{ background: "rgba(255,255,255,0.9)" }}
          >
            <Trash2 size={11} className="text-red-400" />
          </button>
        </div>
      )}
      <div className="h-36 relative overflow-hidden">
        {memory.imageId ? (
          <BlobImage
            src={memory.imageId}
            alt={memory.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: GRADIENTS[index % GRADIENTS.length] }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 60%)",
          }}
        />
      </div>
      <div className="p-3">
        <h3
          className="font-serif-display font-semibold text-sm leading-tight mb-1"
          style={{ color: "oklch(0.14 0.01 5)" }}
        >
          {memory.title}
        </h3>
        <div className="flex items-center gap-1 mb-1.5">
          <Calendar size={10} style={{ color: "oklch(0.50 0.13 5)" }} />
          <span
            className="font-sans-ui text-[10px]"
            style={{ color: "oklch(0.50 0.13 5)" }}
          >
            {memory.date}
          </span>
        </div>
        <p
          className="font-sans-ui text-[11px] leading-snug"
          style={{ color: "oklch(0.36 0.03 5)" }}
        >
          {memory.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function MemoryTab() {
  const { isAdmin } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [form, setForm] = useState<MemoryForm>(EMPTY_FORM);

  const { data: backendMemories = [] } = useGetMemories();
  const addMemoryMutation = useAddMemory();
  const updateMemoryMutation = useUpdateMemory();
  const deleteMemoryMutation = useDeleteMemory();
  const allMemories =
    backendMemories.length > 0 ? backendMemories : SAMPLE_MEMORIES;

  const openAdd = () => {
    setEditingMemory(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (m: Memory) => {
    setEditingMemory(m);
    setForm({
      title: m.title,
      description: m.description,
      date: m.date,
      imageId: m.imageId,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this memory?")) return;
    await deleteMemoryMutation.mutateAsync(id);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    if (editingMemory) {
      await updateMemoryMutation.mutateAsync({
        ...editingMemory,
        ...form,
      });
    } else {
      await addMemoryMutation.mutateAsync({
        id: crypto.randomUUID(),
        ...form,
      });
    }
    setShowForm(false);
    setForm(EMPTY_FORM);
    setEditingMemory(null);
  };

  const saving = addMemoryMutation.isPending || updateMemoryMutation.isPending;

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
            Our Memories
          </h2>
          <p
            className="font-sans-ui text-sm mt-1"
            style={{ color: "oklch(0.36 0.03 5)" }}
          >
            Every moment we've cherished together
          </p>
        </div>

        {isAdmin && (
          <div className="flex justify-center mb-5">
            <Button
              data-ocid="memory.open_modal_button"
              onClick={openAdd}
              className="rounded-full px-6 py-2 font-sans-ui text-sm font-semibold uppercase tracking-wide shadow-love"
              style={{
                background: "oklch(0.56 0.12 5)",
                color: "oklch(0.98 0.01 5)",
                border: "none",
              }}
            >
              <Plus size={16} className="mr-1" /> Add Memory
            </Button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {allMemories.map((m, i) => (
            <MemoryCard
              key={m.id}
              memory={m}
              index={i}
              isAdmin={isAdmin}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>

        <AnimatePresence>
          {showForm && (
            <MemoryFormSheet
              title={editingMemory ? "Edit Memory" : "New Memory"}
              form={form}
              setForm={setForm}
              onSave={handleSave}
              onClose={() => {
                setShowForm(false);
                setForm(EMPTY_FORM);
                setEditingMemory(null);
              }}
              saving={saving}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
