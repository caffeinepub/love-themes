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
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Question } from "../backend";
import {
  useAddQuestion,
  useDeleteQuestion,
  useGetQuestions,
  useUpdateQuestion,
} from "../hooks/useQueries";

const EMPTY: Question = { id: "", questionText: "", category: "" };

export default function QuestionsManager() {
  const { data: questions = [], isLoading } = useGetQuestions();
  const addQuestion = useAddQuestion();
  const updateQuestion = useUpdateQuestion();
  const deleteQuestion = useDeleteQuestion();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Question | null>(null);
  const [form, setForm] = useState<Question>(EMPTY);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY, id: crypto.randomUUID() });
    setOpen(true);
  };

  const openEdit = (q: Question) => {
    setEditing(q);
    setForm({ ...q });
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await updateQuestion.mutateAsync(form);
        toast.success("Question updated!");
      } else {
        await addQuestion.mutateAsync(form);
        toast.success("Question added!");
      }
      setOpen(false);
    } catch {
      toast.error("Failed to save question");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this question?")) return;
    try {
      await deleteQuestion.mutateAsync(id);
      toast.success("Question deleted");
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
            Questions
          </h2>
          <p
            className="font-sans-ui text-sm"
            style={{ color: "oklch(0.45 0.04 5)" }}
          >
            Manage love questions for your site
          </p>
        </div>
        <Button
          data-ocid="questions.open_modal_button"
          onClick={openAdd}
          className="rounded-full font-sans-ui font-semibold"
          style={{
            background: "oklch(0.56 0.12 5)",
            color: "white",
            border: "none",
          }}
        >
          <Plus size={16} className="mr-1" /> Add Question
        </Button>
      </div>

      {isLoading ? (
        <div
          data-ocid="questions.loading_state"
          className="flex justify-center py-12"
        >
          <Loader2
            className="animate-spin"
            style={{ color: "oklch(0.56 0.12 5)" }}
          />
        </div>
      ) : questions.length === 0 ? (
        <div
          data-ocid="questions.empty_state"
          className="text-center py-12 bg-white rounded-2xl"
        >
          <div className="text-4xl mb-2">💬</div>
          <p
            className="font-sans-ui text-sm"
            style={{ color: "oklch(0.45 0.04 5)" }}
          >
            No questions yet. Add your first one!
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-love overflow-hidden">
          <Table data-ocid="questions.table">
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.map((q, i) => (
                <TableRow key={q.id} data-ocid={`questions.row.${i + 1}`}>
                  <TableCell className="max-w-xs">{q.questionText}</TableCell>
                  <TableCell>{q.category}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        data-ocid={`questions.edit_button.${i + 1}`}
                        onClick={() => openEdit(q)}
                        className="p-1.5 rounded-lg hover:bg-pink-50 transition-colors"
                      >
                        <Pencil
                          size={14}
                          style={{ color: "oklch(0.56 0.12 5)" }}
                        />
                      </button>
                      <button
                        type="button"
                        data-ocid={`questions.delete_button.${i + 1}`}
                        onClick={() => handleDelete(q.id)}
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
        <DialogContent data-ocid="questions.dialog" className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif-display">
              {editing ? "Edit Question" : "Add Question"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <Label>Question Text</Label>
              <Input
                data-ocid="questions.text.input"
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
                data-ocid="questions.category.input"
                value={form.category}
                onChange={(e) =>
                  setForm((p) => ({ ...p, category: e.target.value }))
                }
                placeholder="e.g. Love, Dreams, Memories"
                className="rounded-xl"
              />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button
                data-ocid="questions.cancel_button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="rounded-full"
              >
                Cancel
              </Button>
              <Button
                data-ocid="questions.save_button"
                onClick={handleSave}
                disabled={addQuestion.isPending || updateQuestion.isPending}
                className="rounded-full"
                style={{
                  background: "oklch(0.56 0.12 5)",
                  color: "white",
                  border: "none",
                }}
              >
                {addQuestion.isPending || updateQuestion.isPending ? (
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
