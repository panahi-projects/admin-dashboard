import { notFound } from "next/navigation";

export default function CatchAllDashboard() {
  notFound(); // This will render /dashboard/not-found.tsx
}
