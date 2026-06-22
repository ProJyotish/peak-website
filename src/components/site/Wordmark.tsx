import { Link } from "react-router-dom";
import peakLogo from "@/assets/peak-logo.svg";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 group ${className}`}>
      <img src={peakLogo} alt="" className="h-8 w-8 rounded-sm" />
      <span className="font-display text-xl tracking-tight">Peak</span>
    </Link>
  );
}
