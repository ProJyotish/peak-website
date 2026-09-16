import { Link } from "react-router-dom";
import { ROUTES } from "@/lib/routes";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link to={ROUTES.home} className={`inline-flex items-center group ${className}`}>
      <img
        src="/peak-logo.svg"
        alt="Peak"
        width={192}
        height={18}
        className="h-[18px] w-auto shrink-0"
      />
    </Link>
  );
}
