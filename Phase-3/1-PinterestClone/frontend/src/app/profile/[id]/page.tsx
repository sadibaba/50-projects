"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { IoLocationOutline, IoLinkOutline, IoCalendarOutline, IoCreateOutline, IoPersonAddOutline, IoPersonRemoveOutline, IoLockClosedOutline } from "react-icons/io5";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/user.service";
import { authService } from "@/services/auth.service";
import { discoverService } from "@/services/discover.service";
import { ProfileResponse, Pin, User } from "@/types";
import PinGrid from "@/components/pins/PinGrid";
import SaveToBoardModal from "@/components/pins/SaveToBoardModal";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import toast from "react-hot-toast";

type Tab = "pins" | "boards" | "saved";

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user: currentUser, isAuthenticated, updateUser } = useAuth();
  const [data, setData] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("pins");
  const [savingPin, setSavingPin] = useState<Pin | null>(null);
  const [editing, setEditing] = useState(false);

  const load = async () => {
    try {
      setData(await userService.profile(id));
    } catch {
      toast.error("Profile not found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const toggleFollow = async () => {
    if (!data) return;
    if (!isAuthenticated) return router.push("/login");
    try {
      const result = data.isFollowing ? await userService.unfollow(data.user._id) : await userService.follow(data.user._id);
      setData({ ...data, isFollowing: result.following, followersCount: result.followersCount });
      toast.success(result.following ? "Following" : "Unfollowed");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;
  if (!data) return <div className="py-24 text-center text-xl font-semibold">User not found</div>;

  const isOwn = currentUser?._id === data.user._id;
  const pins = tab === "saved" ? data.saved : data.pins;

  return (
    <div className="mx-auto max-w-6xl px-3 pb-12 sm:px-5">
      <div className="relative mt-4 overflow-hidden rounded-3xl bg-gray-100">
        <div className="h-36 w-full bg-gradient-to-r from-[#ffd9df] via-[#fff0d9] to-[#dff2ff] sm:h-52">
          {data.user.cover && <img src={data.user.cover} alt="" className="h-full w-full object-cover" />}
        </div>
        <div className="relative px-5 pb-5 sm:px-8">
          <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-full border-4 border-white bg-gray-200 text-3xl font-black sm:h-28 sm:w-28">
                {data.user.avatar ? <img src={data.user.avatar} alt="" className="h-full w-full object-cover" /> : (data.user.name || data.user.username)[0].toUpperCase()}
              </div>
              <div className="pb-1">
                <h1 className="text-2xl font-black sm:text-3xl">{data.user.name || data.user.username}</h1>
                <p className="text-sm text-gray-500">@{data.user.username}</p>
              </div>
            </div>
            <div className="flex gap-2 pb-1">
              {isOwn ? (
                <Button variant="outline" onClick={() => setEditing(true)}><IoCreateOutline /> Edit profile</Button>
              ) : (
                <Button variant={data.isFollowing ? "outline" : "brand"} onClick={toggleFollow}>
                  {data.isFollowing ? <><IoPersonRemoveOutline /> Following</> : <><IoPersonAddOutline /> Follow</>}
                </Button>
              )}
            </div>
          </div>

          {data.user.bio && <p className="mt-4 max-w-xl whitespace-pre-line text-sm text-gray-700">{data.user.bio}</p>}
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
            {data.user.location && <span className="flex items-center gap-1"><IoLocationOutline /> {data.user.location}</span>}
            {data.user.website && <a href={data.user.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 underline"><IoLinkOutline /> {data.user.website.replace(/^https?:\/\//, "")}</a>}
            <span className="flex items-center gap-1"><IoCalendarOutline /> Joined {new Date(data.user.createdAt).toLocaleDateString(undefined, { month: "short", year: "numeric" })}</span>
          </div>
          <div className="mt-4 flex gap-6 text-sm">
            <span><strong>{data.pins.length}</strong> pins</span>
            <span><strong>{data.followersCount}</strong> followers</span>
            <span><strong>{data.followingCount}</strong> following</span>
            <span><strong>{data.totalLikes}</strong> likes</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-1 border-b border-gray-200">
        {(["pins", "boards", "saved"] as Tab[]).map((value) => {
          if (value === "saved" && !isOwn) return null;
          return (
            <button key={value} onClick={() => setTab(value)} className={`border-b-2 px-4 py-3 text-sm font-semibold capitalize ${tab === value ? "border-ink text-ink" : "border-transparent text-gray-500 hover:text-ink"}`}>
              {value} {value === "boards" ? `(${data.boards.length})` : value === "saved" ? `(${data.saved.length})` : `(${data.pins.length})`}
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        {tab === "boards" ? (
          data.boards.length === 0 ? <p className="rounded-2xl bg-white p-8 text-center text-gray-500">No boards yet.</p> : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.boards.map((board) => (
                <Link key={board._id} href={`/board/${board._id}`} className="group overflow-hidden rounded-2xl border border-gray-200 bg-white hover:shadow-md">
                  <div className="grid h-40 grid-cols-2 gap-0.5 bg-gray-100">
                    {board.pins?.slice(0, 2).map((pin: any) => <img key={pin._id} src={pin.imageUrl} alt="" className="h-40 w-full object-cover" />)}
                    {(!board.pins || board.pins.length === 0) && <div className="col-span-2 grid place-items-center text-gray-400">Empty board</div>}
                  </div>
                  <div className="p-4">
                    <h3 className="flex items-center gap-1 font-semibold">{board.name} {board.isSecret && <IoLockClosedOutline size={13} />}</h3>
                    <p className="text-xs text-gray-500">{board.pinsCount} pins</p>
                  </div>
                </Link>
              ))}
            </div>
          )
        ) : (
          <PinGrid pins={pins} onSave={setSavingPin} emptyTitle={tab === "saved" ? "Nothing saved yet" : "No pins yet"} emptyHint={isOwn ? "Create your first pin." : "This account has not posted yet."} />
        )}
      </div>

      {savingPin && <SaveToBoardModal pin={savingPin} onClose={() => setSavingPin(null)} onSaved={() => load()} />}
      {editing && <EditProfileModal user={data.user} onClose={() => setEditing(false)} onSaved={(user) => { setData({ ...data, user }); if (currentUser?._id === user._id) updateUser(user); }} />}
    </div>
  );
}

function EditProfileModal({ user, onClose, onSaved }: { user: User; onClose: () => void; onSaved: (user: User) => void }) {
  const [form, setForm] = useState({ name: user.name, username: user.username, bio: user.bio, avatar: user.avatar, cover: user.cover, website: user.website, location: user.location });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState("");

  const upload = async (field: "avatar" | "cover", file: File) => {
    setUploading(field);
    try {
      const data = await discoverService.upload(file);
      setForm((current) => ({ ...current, [field]: data.url }));
      toast.success("Image uploaded");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading("");
    }
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const updated = await authService.updateMe(form);
      onSaved(updated);
      toast.success("Profile updated");
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/50 p-4" onClick={onClose}>
      <form onSubmit={save} className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6" onClick={(event) => event.stopPropagation()}>
        <h2 className="text-xl font-bold">Edit profile</h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {(["avatar", "cover"] as const).map((field) => (
            <label key={field} className="cursor-pointer overflow-hidden rounded-xl border border-dashed border-gray-300">
              <div className="grid h-24 place-items-center bg-gray-50 text-xs text-gray-500">
                {form[field] ? <img src={form[field]} alt="" className="h-full w-full object-cover" /> : `Upload ${field}`}
              </div>
              <span className="block bg-white p-2 text-center text-xs font-medium">{uploading === field ? "Uploading..." : `Change ${field}`}</span>
              <input type="file" accept="image/*" className="hidden" onChange={(event) => event.target.files?.[0] && upload(field, event.target.files[0])} />
            </label>
          ))}
        </div>
        <div className="mt-4 space-y-3">
          <Input label="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <Input label="Username" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} />
          <div>
            <label className="mb-1.5 block text-sm font-medium">Bio</label>
            <textarea value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} rows={3} maxLength={300} className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand" />
          </div>
          <Input label="Website" value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} />
          <Input label="Location" value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} />
        </div>
        <div className="mt-5 flex gap-2">
          <Button type="button" variant="outline" onClick={onClose} fullWidth>Cancel</Button>
          <Button type="submit" loading={saving} fullWidth>Save</Button>
        </div>
      </form>
    </div>
  );
}
