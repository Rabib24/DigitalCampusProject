"use client";

export function LibraryView() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Library</h2>
        <p className="text-muted-foreground mt-1">
          Access book catalog, loans, and digital resources (student view placeholder).
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-4 space-y-2">
          <h3 className="text-base font-semibold">Book Catalog</h3>
          <p className="text-sm text-muted-foreground">
            Search for books and course materials. (To be wired to backend.)
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4 space-y-2">
          <h3 className="text-base font-semibold">Your Loans</h3>
          <p className="text-sm text-muted-foreground">
            View current checkouts and due dates.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4 space-y-2">
          <h3 className="text-base font-semibold">Digital Resources</h3>
          <p className="text-sm text-muted-foreground">
            Access e-books, journals, and databases.
          </p>
        </div>
      </div>
    </div>
  );
}
