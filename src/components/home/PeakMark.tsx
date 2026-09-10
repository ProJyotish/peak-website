/** Peak navigator mark — brand gold matches assets/img/peak-mark.svg (#C28D2A). */
const MARK_PATH =
  "M162.494,53.951c-9.5-.6-18.552,3.046-23.79,10.731-2.2,3.234-4.756,6.08-8.933,6.531a9.5,9.5,0,0,1-7.964-2.541c-4.025-4.082-3.037-9.718.267-14.985L152.913,4.493a9.277,9.277,0,0,1,15.836-.029l31.63,52.387c2.44,4.038,2.071,9.241-1.337,12.4-4.247,3.926-11.395,2.875-14.625-2.049-4.991-7.608-12.157-12.634-21.922-13.247";

const BRAND_GOLD = "#C28D2A";

export function PeakMark({ className }: { className?: string }) {
  return (
    <span className={className ? `mark ${className}` : "mark"}>
      <svg viewBox="0 0 90.778 79.611" aria-hidden="true">
        <g transform="translate(-115.172,3.964)">
          <path fill={BRAND_GOLD} d={MARK_PATH} />
        </g>
      </svg>
    </span>
  );
}
