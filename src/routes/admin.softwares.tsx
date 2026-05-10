import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/softwares")({
  // Component is lazily loaded from admin.softwares.lazy.tsx
});
