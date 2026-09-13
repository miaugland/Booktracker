// søk - kaller Google Books API

"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { GoogleBookResult } from "@/lib/googleBooks";
import AddToShelfButton from "@/components/AddToShelfButton";

function SearchResultSkeleton() {
  return (
    <li className="flex animate-pulse gap-4 rounded-md border border-black/10 p-3">
      <div className="h-24 w-16 shrink-0 rounded bg-black/10" />
      <div className="flex flex-1 flex-col gap-2 py-1">
        <div className="h-4 w-3/5 rounded bg-black/10" />
        <div className="h-3 w-2/5 rounded bg-black/10" />
        <div className="h-3 w-1/5 rounded bg-black/10" />
      </div>
    </li>
  );
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<GoogleBookResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  async function runSearch(term: string) {
    const trimmed = term.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/books/search?q=${encodeURIComponent(trimmed)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong");
      }

      setResults(data);
    } catch {
      setError("Couldn't make a search at this moment.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (initialQuery) {
      runSearch(initialQuery);
    }
  }, [initialQuery]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    runSearch(query);
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-xl font-semibold">Search for books</h1>

      <form onSubmit={handleSearch} className="mt-4 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Title, author …"
          className="flex-1 rounded-md border border-black/10 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-[#181717] px-4 py-2 text-sm font-medium text-white hover:bg-[#181717]/90 disabled:opacity-50"
        >
          {loading ? "Searching …" : "Search"}
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-error">{error}</p>}

      <ul className="mt-6 flex flex-col gap-4">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <SearchResultSkeleton key={i} />)
          : results.map((book) => (
            <li key={book.externalId} className="flex gap-4 rounded-md border border-black/10 p-3">
              {book.coverUrl ? (
                <img src={book.coverUrl} alt={book.title} className="h-24 w-16 object-cover" />
              ) : (
                <div className="h-24 w-16 shrink-0 rounded bg-black/5" />
              )}
              <div>
                <p className="font-medium">{book.title}</p>
                {book.authors.length > 0 && (
                  <p className="text-sm text-black/60">
                    {book.authors.join(", ")}
                  </p>
                )}
                {book.publishedYear && (
                  <p className="text-sm text-black/40">
                    {book.publishedYear}
                  </p>
                )}
                <div className="mt-2">
                  <AddToShelfButton book={book} />
                </div>
              </div>
            </li>
          ))}
      </ul>

      {!loading && !error && hasSearched && results.length === 0 && (
        <p className="mt-6 text-sm text-black/60">
          No results.
        </p>
      )}
    </main>
  );
}
