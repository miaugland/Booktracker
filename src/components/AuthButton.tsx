import { auth, signIn, signOut } from "@/lib/auth";

function getInitials(name: string | null | undefined) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

export default async function AuthButton() {
  const session = await auth();

  if (session?.user) {
    return (
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
        className="flex items-center gap-2.5"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs text-white">
          {getInitials(session.user.name)}
        </span>
        <button
          type="submit"
          className="text-[13px] text-muted hover:text-accent-hover hover:underline"
        >
          Log out
        </button>
      </form>
    );
  }

  return (
    <form
      action={async () => {
        "use server";
        await signIn("github");
      }}
    >
      <button
        type="submit"
        className="rounded-full bg-accent px-4 py-2 text-[13px] text-white transition-colors hover:bg-accent-hover"
      >
        Log in with Github
      </button>
    </form>
  );
}