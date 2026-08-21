import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, MessageSquareHeart, ShieldCheck, Send } from "lucide-react";
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
          "Write a thought, read what other visitors left behind. A small public wall of notes in Sanjam World.",
      },
      { property: "og:title", content: "Thoughts Wall — Sanjam World" },
      {
        property: "og:description",
        content: "Leave a note on the public wall and read recent thoughts from other visitors.",
      },
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
        .limit(30);
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
      });
      if (insertError) throw insertError;
    },
    onSuccess: () => {
      setMessage("");
      setError(null);
      toast.success("Thought posted", {
        description: "Thanks for adding to the wall.",
      });
      void queryClient.invalidateQueries({ queryKey: ["thoughts"] });
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
          A tiny public notice board. Write a thought, a hello, a recommendation — it appears below
          for everyone who visits.
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
              Post thought
            </Button>

            <p className="mt-4 inline-flex items-start gap-2 rounded-2xl bg-secondary/60 p-3 text-xs text-muted-foreground">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-aqua" aria-hidden="true" />
              <span>
                Submissions are public and may be moderated — anything abusive, spammy or unsafe can
                be hidden or removed. Please don&apos;t share private details.
              </span>
            </p>
          </form>
        </Reveal>

        <Reveal delay={90}>
          <div>
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-display text-xl font-bold">Recent thoughts</h2>
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
                <h3 className="mt-4 font-display text-lg font-semibold">The wall is empty</h3>
                <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                  Nobody has written anything yet. Be the first — yours will sit right here.
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
          </div>
        </Reveal>
      </section>
    </>
  );
}
