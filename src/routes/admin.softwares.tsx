import { createFileRoute } from "@tanstack/react-router";
import { getSoftwares } from "@/lib/api/softwares";

export const Route = createFileRoute("/admin/softwares")({
  loader: () => getSoftwares(),
});
