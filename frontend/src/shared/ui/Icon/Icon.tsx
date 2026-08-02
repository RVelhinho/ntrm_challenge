import type { SVGProps } from 'react';

export type IconName =
  | 'banknote'
  | 'arrow-right'
  | 'calendar'
  | 'chevron-left'
  | 'chevron-down'
  | 'chevron-right'
  | 'clock'
  | 'circle-check'
  | 'circle-x'
  | 'loader'
  | 'map-pin'
  | 'star'
  | 'sprout'
  | 'video';

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
};

const paths: Record<IconName, React.ReactNode> = {
  'arrow-right': <path d="M5 12h14M13 6l6 6-6 6" />,
  banknote: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M7 6v2M17 16v2" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <path d="M16 2.5v4M8 2.5v4M3 9h18" />
    </>
  ),
  'chevron-left': <path d="m15 6-6 6 6 6" />,
  'chevron-down': <path d="m7 9 5 5 5-5" />,
  'chevron-right': <path d="m9 6 6 6-6 6" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  'circle-check': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.5 2.5L16 9" />
    </>
  ),
  'circle-x': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m9 9 6 6M15 9l-6 6" />
    </>
  ),
  loader: (
    <>
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
    </>
  ),
  'map-pin': (
    <>
      <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
  star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />,
  sprout: (
    <>
      <path d="M12 21V10" />
      <path d="M12 13C7 13 5 10 5 5c5 0 8 2 7 8Z" />
      <path d="M12 16c0-4 2.5-6 7-6 0 4-2 7-7 7" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="6" width="13" height="12" rx="2" />
      <path d="m16 10 5-3v10l-5-3" />
    </>
  ),
};

export function Icon({ name, width = 13, height = width, strokeWidth = 1.6, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={height}
      viewBox="0 0 24 24"
      width={width}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
