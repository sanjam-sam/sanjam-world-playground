import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  MessageSquareHeart,
  ShieldCheck,
  Send,
  Trash2,
} from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/thoughts")({
  head: () => ({
    meta: [
      { title: "Thoughts Wall — Sanjam World" },
      {
        name: "description",
        content:
          "Write a thought for Sanjam. Selected notes are published to the wall after review — a small, curated space in Sanjam World.",
      },
      { property: "og:title", content: "Thoughts Wall — Sanjam World" },
      {
        property: "og:description",
        content: "Leave a note for Sanjam — approved thoughts appear on the public wall.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ThoughtsPage,
});

const MAX_MESSAGE = 500;
const MAX_NAME = 40;

type Thought = {
  id: string;
  author_name: string | null;
  message: string;
  created_at: string;
};

type AdminThought = Thought & { is_visible: boolean };

// This is only an immediate UI check. The database repeats the authorization
// check before returning hidden thoughts or applying moderation actions.
const ADMIN_ACCESS_CODE = "5790";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

function ThoughtsPage() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const thoughtsQuery = useQuery({
    queryKey: ["thoughts"],
    queryFn: async (): Promise<Thought[]> => {
      const { data, error: queryError } = await supabase
        .from("thoughts")
        .select("id, author_name, message, created_at")
        .order("created_at", { ascending: false })
        .limit(60);
      if (queryError) throw queryError;
      return data ?? [];
    },
  });

  const createThought = useMutation({
    mutationFn: async () => {
      const trimmed = message.trim();
      const author = name.trim();
      const { error: insertError } = await supabase.from("thoughts").insert({
        message: trimmed,
        author_name: author.length > 0 ? author : null,
        is_visible: false,
      });
      if (insertError) throw insertError;
    },
    onSuccess: () => {
      setMessage("");
      setError(null);
      toast.success("Thought sent", {
        description: "It's in review — it appears on the wall once Sanjam approves it.",
      });
    },
    onError: () => {
      setError("That didn't go through. Please try again in a moment.");
    },
  });

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = message.trim();
    if (trimmed.length < 2) {
      setError("Write at least a couple of characters.");
      return;
    }
    if (trimmed.length > MAX_MESSAGE) {
      setError(`Keep it under ${MAX_MESSAGE} characters.`);
      return;
    }
    setError(null);
    createThought.mutate();
  };

  const thoughts = thoughtsQuery.data ?? [];

  return (
    <>
      <PageHeader eyebrow="Thoughts Wall" title="Say something to the wall">
        <p>
          A tiny, curated notice board. Write a thought, a hello, a recommendation — Sanjam reviews
          each one, and the published notes appear below.
        </p>
      </PageHeader>

      <section className="mx-auto grid max-w-6xl gap-6 px-5 pb-8 lg:grid-cols-[minmax(0,26rem)_1fr]">
        <Reveal>
          <form onSubmit={submit} className="surface-card rounded-3xl p-6 md:p-7" noValidate>
            <h2 className="font-display text-xl font-bold">Write a thought</h2>

            <div className="mt-5">
              <Label htmlFor="thought-name" className="text-xs text-muted-foreground">
                Name <span className="text-muted-foreground/70">(optional)</span>
              </Label>
              <Input
                id="thought-name"
                value={name}
                maxLength={MAX_NAME}
                onChange={(e) => setName(e.target.value)}
                placeholder="Anonymous"
                autoComplete="name"
                className="mt-1.5 bg-background/60"
              />
            </div>

            <div className="mt-4">
              <Label htmlFor="thought-message" className="text-xs text-muted-foreground">
                Your thought
              </Label>
              <Textarea
                id="thought-message"
                value={message}
                rows={5}
                maxLength={MAX_MESSAGE}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Something kind, curious or completely random…"
                aria-describedby="thought-help"
                aria-invalid={error ? true : undefined}
                required
                className="mt-1.5 resize-y bg-background/60"
              />
              <p className="mt-1.5 text-right text-xs text-muted-foreground">
                {message.length}/{MAX_MESSAGE}
              </p>
            </div>

            <p id="thought-help" role="status" aria-live="polite" className="min-h-5 text-sm">
              {error ? <span className="text-destructive">{error}</span> : null}
            </p>

            <Button type="submit" disabled={createThought.isPending} className="mt-3 w-full">
              {createThought.isPending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Send className="size-4" aria-hidden="true" />
              )}
              Send thought
            </Button>

            <p className="mt-4 inline-flex items-start gap-2 rounded-2xl bg-secondary/60 p-3 text-xs text-muted-foreground">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-aqua" aria-hidden="true" />
              <span>
                New thoughts stay private until reviewed. Only notes Sanjam marks as shown appear on
                this page — please don&apos;t share private details.
              </span>
            </p>
          </form>
        </Reveal>

        <Reveal delay={90}>
          <div>
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-display text-xl font-bold">On the wall</h2>
              <span className="text-xs text-muted-foreground">
                {thoughts.length > 0 ? `${thoughts.length} showing` : null}
              </span>
            </div>

            {thoughtsQuery.isPending ? (
              <ul className="mt-4 grid gap-3" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <li key={i} className="surface-card h-24 animate-pulse rounded-3xl" />
                ))}
              </ul>
            ) : thoughtsQuery.isError ? (
              <div className="surface-card mt-4 rounded-3xl p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  The wall couldn&apos;t load right now.
                </p>
                <Button
                  variant="secondary"
                  className="mt-4"
                  onClick={() => void thoughtsQuery.refetch()}
                >
                  Try again
                </Button>
              </div>
            ) : thoughts.length === 0 ? (
              <div className="surface-card mt-4 rounded-3xl border-dashed p-10 text-center">
                <MessageSquareHeart className="mx-auto size-6 text-primary" aria-hidden="true" />
                <h3 className="mt-4 font-display text-lg font-semibold">Nothing published yet</h3>
                <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                  No thoughts have been put on the wall so far. Send one — if Sanjam publishes it,
                  it will sit right here.
                </p>
              </div>
            ) : (
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {thoughts.map((thought) => (
                  <li key={thought.id} className="surface-card rounded-3xl p-5">
                    <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                      {thought.message}
                    </p>
                    <p className="mt-4 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                      <span className="font-semibold text-primary">
                        {thought.author_name?.trim() || "Anonymous"}
                      </span>
                      <time dateTime={thought.created_at}>{timeAgo(thought.created_at)}</time>
                    </p>
                  </li>
                ))}
              </ul>
            )}

            <ModerationPanel
              onChanged={() => void queryClient.invalidateQueries({ queryKey: ["thoughts"] })}
            />
          </div>
        </Reveal>
      </section>
    </>
  );
}

function ModerationPanel({ onChanged }: { onChanged: () => void }) {
  const [open, setOpen] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [code, setCode] = useState<string | null>(null);
  const [items, setItems] = useState<AdminThought[]>([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [gateError, setGateError] = useState<string | null>(null);

  const refresh = async (withCode: string) => {
    const normalizedCode = withCode.trim();
    if (normalizedCode !== ADMIN_ACCESS_CODE) {
      setCode(null);
      setItems([]);
      setGateError("That code doesn't match.");
      return;
    }

    setLoading(true);
    try {
      const { data, error: moderationError } = await supabase.rpc(
        "list_thoughts_for_moderation",
        { access_code: normalizedCode },
      );
      if (moderationError) throw moderationError;
      setItems(data ?? []);
      setCode(normalizedCode);
      setGateError(null);
    } catch {
      setCode(null);
      setItems([]);
      setGateError("Moderation couldn't connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const unlock = (event: React.FormEvent) => {
    event.preventDefault();
    void refresh(codeInput);
  };

  const act = async (id: string, action: "show" | "hide" | "delete") => {
    if (!code) return;
    setBusyId(id);
    try {
      const { error: moderationError } = await supabase.rpc("moderate_thought", {
        access_code: code,
        thought_id: id,
        moderation_action: action,
      });
      if (moderationError) throw moderationError;

      if (action === "delete") {
        toast.success("Thought deleted permanently.");
      } else {
        toast.success(action === "show" ? "Shown on profile." : "Removed from profile.");
      }
      await refresh(code);
      onChanged();
    } catch {
      toast.error("That action didn't go through.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="surface-card mt-8 rounded-3xl p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Lock className="size-4 text-aqua" aria-hidden="true" />
          <h3 className="font-display text-lg font-semibold">Moderation</h3>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Hide panel" : "Private access"}
        </Button>
      </div>

      {open ? (
        code === null ? (
          <form onSubmit={unlock} className="mt-4 flex flex-wrap items-end gap-3">
            <div className="min-w-40 flex-1">
              <Label htmlFor="mod-code" className="text-xs text-muted-foreground">
                Secret code
              </Label>
              <Input
                id="mod-code"
                type="password"
                inputMode="numeric"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value.replace(/\s/g, ""))}
                autoComplete="off"
                maxLength={32}
                placeholder="••••"
                className="mt-1.5 bg-background/60 tracking-[0.3em]"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
              Unlock
            </Button>
            <p role="status" aria-live="polite" className="w-full text-sm">
              {gateError ? <span className="text-destructive">{gateError}</span> : null}
            </p>
          </form>
        ) : (
          <div className="mt-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-muted-foreground">
                {items.length} submitted {items.length === 1 ? "thought" : "thoughts"} ·{" "}
                {items.filter((i) => i.is_visible).length} on profile
              </p>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                  setCode(null);
                  setCodeInput("");
                  setItems([]);
                }}
              >
                Lock again
              </Button>
            </div>

            {items.length === 0 ? (
              <p className="mt-4 rounded-2xl border border-dashed border-border/70 p-6 text-center text-sm text-muted-foreground">
                No submissions yet.
              </p>
            ) : (
              <ul className="mt-4 grid gap-3">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-2xl border border-border/70 bg-background/40 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-primary">
                        {item.author_name?.trim() || "Anonymous"}
                      </span>
                      <span
                        className={
                          item.is_visible
                            ? "rounded-full bg-aqua/15 px-2.5 py-0.5 text-xs font-semibold text-aqua"
                            : "rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground"
                        }
                      >
                        {item.is_visible ? "On profile" : "Hidden"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed break-words whitespace-pre-wrap">
                      {item.message}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <time
                        dateTime={item.created_at}
                        className="mr-auto text-xs text-muted-foreground"
                      >
                        {timeAgo(item.created_at)}
                      </time>
                      {item.is_visible ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          disabled={busyId === item.id}
                          onClick={() => void act(item.id, "hide")}
                        >
                          <EyeOff className="size-4" aria-hidden="true" /> Remove from profile
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          disabled={busyId === item.id}
                          onClick={() => void act(item.id, "show")}
                        >
                          <Eye className="size-4" aria-hidden="true" /> Show on profile
                        </Button>
                      )}
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        disabled={busyId === item.id}
                        onClick={() => {
                          if (window.confirm("Delete this thought permanently?"))
                            void act(item.id, "delete");
                        }}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="size-4" aria-hidden="true" /> Delete
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">
          Sanjam-only area for reviewing submitted thoughts.
        </p>
      )}
    </div>
  );
}
