"use client";

export function CalendarView() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Calendar</h2>
        <p className="text-muted-foreground mt-1">
          Overview of your classes, assignments, and campus events.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <p className="text-sm text-muted-foreground">
          Calendar UI placeholder. Later this will show a timeline of important academic dates and events.
        </p>
      </div>
    </div>
  );
}
