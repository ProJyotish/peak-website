import { Link } from "react-router-dom";
import peakLogo from "@/assets/peak-logo.svg";
import { ROUTES } from "@/lib/routes";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link to={ROUTES.home} className={`inline-flex items-center group ${className}`}>
      <img
        src={peakLogo}
        alt="Peak"
        width={192}
        height={18}
        className="h-[18px] w-auto shrink-0"
      />
    </Link>
  );
}
