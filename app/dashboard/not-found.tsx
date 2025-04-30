import DinosaurSVG from "@/components/dashboard/DinosaurSVG";
import { Button } from "@/components/ui/button";
import { Frown } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-6xl font-bold tracking-tight mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-6 flex items-center gap-x-3">
        {/* <Frown className="w-6 h-6 text-muted-foreground" /> */}
        <DinosaurSVG />
        <span>Oops! The page you’re looking for doesn’t exist.</span>
      </p>
      <Link href="/dashboard">
        <Button>Go back to dashboard</Button>
      </Link>
    </div>
  );
}
