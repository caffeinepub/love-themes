import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, MessageCircle, Pencil, Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Question } from "../backend";
import { useAuth } from "../contexts/AuthContext";
import {
  useAddQuestion,
  useDeleteQuestion,
  useGetQuestions,
  useUpdateQuestion,
} from "../hooks/useQueries";

const SAMPLE_QUESTIONS: Question[] = [
  {
    id: "q1",
    questionText: "What's your favorite memory of us together?",
    category: "Memories",
  },
  {
    id: "q2",
    questionText: "Where do you dream of traveling with me?",
    category: "Dreams",
  },
  {
    id: "q3",
    questionText: "What made you fall in love with me?",
    category: "Love",
  },
  {
    id: "q4",
    questionText: "What's the little thing I do that you love most?",
    category: "Love",
  },
  {
    id: "q5",
    questionText: "What's your vision of our perfect day together?",
    category: "Dreams",
  },
  {
    id: "q6",
    questionText: "What song reminds you most of our love story?",
    category: "Memories",
  },
];

const Q_COLORS = [
  "linear-gradient(135deg, #f6c2cc, #e8a0b4)",
  "linear-gradient(135deg, #b7a0c7, #9880b2)",
  "linear-gradient(135deg, #f3b6b0, #e09090)",
  "linear-gradient(135deg, #ffd6e0, #ffb3c6)",
  "linear-gradient(135deg, #d4a0c7, #b880b2)",
  "linear-gradient(135deg, #f8d0d8, #f0a8bc)",
];

const EMPTY_Q: Question = { id: "", questionText: "", category: "" };

function QuestionCard({
  q,
  index,
  isAdmin,
  onEdit,
  onDelete,
}: {
  q: Question;
  index: number;
  isAdmin: boolean;
  onEdit: (q: Question) => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      data-ocid={`question.item.${index + 1}`}
      className="glass-panel rounded-2xl overflow-hidden shadow-love mb-3"
    >
      <div className="w-full p-4 flex items-start gap-3">
        <div
          className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: Q_COLORS[index % Q_COLORS.length] }}
        >
          <MessageCircle size={16} color="white" />
        </div>
        <button
          type="button"
          className="flex-1 min-w-0 text-left"
          onClick={() => setExpanded((v) => !v)}
        >
          <p
            className="font-serif-display text-sm font-semibold leading-snug"
            style={{ color: "oklch(0.14 0.01 5)" }}
          >
            {q.questionText}
          </p>
          {q.category && (
            <span
              className="inline-block mt-1 text-[10px] font-sans-ui font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
              style={{
                background: "oklch(0.56 0.12 5 / 0.12)",
                color: "oklch(0.50 0.13 5)",
              }}
            >
              {q.category}
            </span>
          )}
        </button>
        <div className="flex items-center gap-1 shrink-0 mt-0.5">
          {isAdmin && (
            <>
              <button
                type="button"
                data-ocid={`question.edit_button.${index + 1}`}
                onClick={() => onEdit(q)}
                className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white/60 transition-colors"
              >
                <Pencil size={11} style={{ color: "oklch(0.56 0.12 5)" }} />
              </button>
              <button
                type="button"
                data-ocid={`question.delete_button.${index + 1}`}
                onClick={() => onDelete(q.id)}
                className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white/60 transition-colors"
              >
                <Trash2 size={11} className="text-red-400" />
              </button>
            </>
          )}
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="p-0.5"
            >
              <ChevronDown size={16} style={{ color: "oklch(0.50 0.13 5)" }} />
            </button>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <p
                className="font-sans-ui text-sm"
                style={{ color: "oklch(0.36 0.03 5)" }}
              >
                This question is waiting for your love story to unfold ✨
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function QuestionTab() {
  const { isAdmin } = useAuth();
  const { data: backendQuestions = [] } = useGetQuestions();
  const questions =
    backendQuestions.length > 0 ? backendQuestions : SAMPLE_QUESTIONS;

  const addQuestion = useAddQuestion();
  const updateQuestion = useUpdateQuestion();
  const deleteQuestion = useDeleteQuestion();

  const [open, setOpen] = useState(false);
  const [editingQ, setEditingQ] = useState<Question | null>(null);
  const [form, setForm] = useState<Question>(EMPTY_Q);

  const openAdd = () => {
    setEditingQ(null);
    setForm({ ...EMPTY_Q, id: crypto.randomUUID() });
    setOpen(true);
  };

  const openEdit = (q: Question) => {
    setEditingQ(q);
    setForm({ ...q });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this question?")) return;
    await deleteQuestion.mutateAsync(id);
  };

  const handleSave = async () => {
    if (!form.questionText.trim()) return;
    if (editingQ) {
      await updateQuestion.mutateAsync(form);
    } else {
      await addQuestion.mutateAsync(form);
    }
    setOpen(false);
  };

  const saving = addQuestion.isPending || updateQuestion.isPending;

  // Group by category
  const grouped = questions.reduce<Record<string, Question[]>>((acc, q) => {
    const cat = q.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(q);
    return acc;
  }, {});

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
            Love Questions
          </h2>
          <p
            className="font-sans-ui text-sm mt-1"
            style={{ color: "oklch(0.36 0.03 5)" }}
          >
            Discover more about each other
          </p>
        </div>

        {isAdmin && (
          <div className="flex justify-center mb-5">
            <Button
              data-ocid="question.open_modal_button"
              onClick={openAdd}
              className="rounded-full px-6 py-2 font-sans-ui text-sm font-semibold uppercase tracking-wide shadow-love"
              style={{
                background: "oklch(0.56 0.12 5)",
                color: "oklch(0.98 0.01 5)",
                border: "none",
              }}
            >
              <Plus size={16} className="mr-1" /> Add Question
            </Button>
          </div>
        )}

        {Object.entries(grouped).map(([category, qs]) => (
          <div key={category} className="mb-4">
            <p
              className="font-sans-ui text-xs font-bold uppercase tracking-widest mb-2"
              style={{ color: "oklch(0.56 0.12 5)" }}
            >
              {category}
            </p>
            {qs.map((q, i) => (
              <QuestionCard
                key={q.id}
                q={q}
                index={i}
                isAdmin={isAdmin}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ))}
      </motion.div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent data-ocid="question.dialog" className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif-display">
              {editingQ ? "Edit Question" : "Add Question"}
            </DialogTitle>
          </DialogHeader>
          {/* Save at top */}
          <div
            className="flex gap-2 justify-end pb-2 border-b"
            style={{ borderColor: "oklch(0.92 0.02 5)" }}
          >
            <Button
              data-ocid="question.cancel_button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              data-ocid="question.save_button"
              onClick={handleSave}
              disabled={saving || !form.questionText.trim()}
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
              <Label>Question Text</Label>
              <Input
                data-ocid="question.input"
                value={form.questionText}
                onChange={(e) =>
                  setForm((p) => ({ ...p, questionText: e.target.value }))
                }
                placeholder="e.g. What's your favorite memory of us?"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label>Category</Label>
              <Input
                data-ocid="question.input"
                value={form.category}
                onChange={(e) =>
                  setForm((p) => ({ ...p, category: e.target.value }))
                }
                placeholder="e.g. Love, Dreams, Memories"
                className="rounded-xl"
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
                disabled={saving || !form.questionText.trim()}
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
