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
import type { UserProfile } from "../backend";
import FileUpload from "../components/FileUpload";
import {
  useAdminAddUserProfile,
  useAdminDeleteUserProfile,
  useAdminUpdateUserProfile,
  useGetUserProfiles,
} from "../hooks/useQueries";

const EMPTY_PROFILE: UserProfile = {
  name: "",
  bio: "",
  role: "user",
  avatarImageId: "",
};

export default function UsersManager() {
  const { data: users = [], isLoading } = useGetUserProfiles();
  const addUser = useAdminAddUserProfile();
  const updateUser = useAdminUpdateUserProfile();
  const deleteUser = useAdminDeleteUserProfile();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null); // principal string
  const [principalText, setPrincipalText] = useState("");
  const [form, setForm] = useState<UserProfile>(EMPTY_PROFILE);

  const openAdd = () => {
    setEditing(null);
    setPrincipalText("");
    setForm({ ...EMPTY_PROFILE });
    setOpen(true);
  };

  const openEdit = (principal: string, profile: UserProfile) => {
    setEditing(principal);
    setPrincipalText(principal);
    setForm({ ...profile });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!principalText.trim()) {
      toast.error("Principal ID is required");
      return;
    }
    try {
      if (editing) {
        await updateUser.mutateAsync({ principalText, profile: form });
        toast.success("User updated!");
      } else {
        await addUser.mutateAsync({ principalText, profile: form });
        toast.success("User added!");
      }
      setOpen(false);
    } catch (e: any) {
      toast.error(e?.message || "Failed to save user");
    }
  };

  const handleDelete = async (principal: string) => {
    if (!confirm("Delete this user profile?")) return;
    try {
      await deleteUser.mutateAsync(principal);
      toast.success("User deleted");
    } catch {
      toast.error("Failed to delete user");
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
            Users
          </h2>
          <p
            className="font-sans-ui text-sm"
            style={{ color: "oklch(0.45 0.04 5)" }}
          >
            Manage user profiles on your site
          </p>
        </div>
        <Button
          data-ocid="users.open_modal_button"
          onClick={openAdd}
          className="rounded-full font-sans-ui font-semibold"
          style={{
            background: "oklch(0.56 0.12 5)",
            color: "white",
            border: "none",
          }}
        >
          <Plus size={16} className="mr-1" /> Add User
        </Button>
      </div>

      {isLoading ? (
        <div
          data-ocid="users.loading_state"
          className="flex justify-center py-12"
        >
          <Loader2
            className="animate-spin"
            style={{ color: "oklch(0.56 0.12 5)" }}
          />
        </div>
      ) : users.length === 0 ? (
        <div
          data-ocid="users.empty_state"
          className="text-center py-12 bg-white rounded-2xl"
        >
          <div className="text-4xl mb-2">👥</div>
          <p
            className="font-sans-ui text-sm"
            style={{ color: "oklch(0.45 0.04 5)" }}
          >
            No users yet. Add the first one!
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-love overflow-hidden">
          <Table data-ocid="users.table">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Bio</TableHead>
                <TableHead>Principal</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(([principal, profile], i) => (
                <TableRow key={principal} data-ocid={`users.row.${i + 1}`}>
                  <TableCell className="font-medium">
                    {profile.name || "—"}
                  </TableCell>
                  <TableCell>
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{
                        background: "oklch(0.56 0.12 5 / 0.12)",
                        color: "oklch(0.50 0.13 5)",
                      }}
                    >
                      {profile.role}
                    </span>
                  </TableCell>
                  <TableCell
                    className="max-w-xs truncate text-sm"
                    style={{ color: "oklch(0.45 0.04 5)" }}
                  >
                    {profile.bio || "—"}
                  </TableCell>
                  <TableCell
                    className="font-mono text-xs max-w-[100px] truncate"
                    style={{ color: "oklch(0.45 0.04 5)" }}
                  >
                    {principal}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        data-ocid={`users.edit_button.${i + 1}`}
                        onClick={() => openEdit(principal, profile)}
                        className="p-1.5 rounded-lg hover:bg-pink-50 transition-colors"
                      >
                        <Pencil
                          size={14}
                          style={{ color: "oklch(0.56 0.12 5)" }}
                        />
                      </button>
                      <button
                        type="button"
                        data-ocid={`users.delete_button.${i + 1}`}
                        onClick={() => handleDelete(principal)}
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
          data-ocid="users.dialog"
          className="rounded-2xl max-w-lg"
        >
          <DialogHeader>
            <DialogTitle className="font-serif-display">
              {editing ? "Edit User" : "Add User"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <Label>Principal ID</Label>
              <Input
                data-ocid="users.principal.input"
                value={principalText}
                onChange={(e) => setPrincipalText(e.target.value)}
                placeholder="e.g. aaaaa-aa"
                disabled={!!editing}
                className="rounded-xl font-mono text-sm"
              />
              <p className="text-xs" style={{ color: "oklch(0.55 0.04 5)" }}>
                The Internet Identity principal of the user.
              </p>
            </div>
            <div className="space-y-1">
              <Label>Name</Label>
              <Input
                data-ocid="users.name.input"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Display name"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label>Role</Label>
              <Input
                data-ocid="users.role.input"
                value={form.role}
                onChange={(e) =>
                  setForm((p) => ({ ...p, role: e.target.value }))
                }
                placeholder="user / admin / guest"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label>Bio</Label>
              <Textarea
                data-ocid="users.bio.textarea"
                value={form.bio}
                onChange={(e) =>
                  setForm((p) => ({ ...p, bio: e.target.value }))
                }
                placeholder="Short bio..."
                className="rounded-xl resize-none"
                rows={2}
              />
            </div>
            <div className="space-y-1">
              <Label>Avatar Image</Label>
              <FileUpload
                data-ocid="users.upload_button"
                value={form.avatarImageId}
                onChange={(url) =>
                  setForm((p) => ({ ...p, avatarImageId: url }))
                }
                label="Upload avatar"
              />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button
                data-ocid="users.cancel_button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="rounded-full"
              >
                Cancel
              </Button>
              <Button
                data-ocid="users.save_button"
                onClick={handleSave}
                disabled={addUser.isPending || updateUser.isPending}
                className="rounded-full"
                style={{
                  background: "oklch(0.56 0.12 5)",
                  color: "white",
                  border: "none",
                }}
              >
                {addUser.isPending || updateUser.isPending ? (
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
