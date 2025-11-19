"use client";

export function MessagesView() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Messages</h2>
        <p className="text-muted-foreground mt-1">
          Central place for course messages and campus communications.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-4 space-y-3">
        <p className="text-sm text-muted-foreground">
          Messaging center placeholder. Later this will integrate with the communication system (announcements,
          chats, and notifications).
        </p>
      </div>
    </div>
  );
}
