import Link from "next/link";
import Form from "next/form";
import { auth } from "@/lib/auth";
import AuthButton from "@/components/AuthButton";

export default async function Nav() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-30 bg-page-bg/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-270 items-center gap-6.5 px-7 py-4">
        <Link
          href="/"
          className="flex-none font-display text-2xl tracking-[-0.02em] text-ink no-underline"
        >
          Tsundoku
        </Link>

        <Form
          action="/search"
          className="flex max-w-95 flex-1 items-center gap-2.5 rounded-full bg-white px-4.5 py-2.5 shadow-[0_6px_18px_-14px_rgba(59,43,46,0.5)]"
        >
          <span className="h-3.5 w-3.5 flex-none rounded-full border-[1.5px] border-muted-2" />
          <input
            type="text"
            name="q"
            placeholder="Search a title, an author, a mood"
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
          />
        </Form>

        <nav className="ml-auto flex items-center gap-5.5 text-sm">
          <Link href="/search" className="text-muted hover:accent-accent-hover">
            Search
          </Link>

          {session?.user && (
            <Link href="/shelf" className="text-muted hover:accent-accent-hover">
              My shelf
            </Link>
          )}
          <AuthButton />
        </nav>
      </div>
    </header>
  );
}
