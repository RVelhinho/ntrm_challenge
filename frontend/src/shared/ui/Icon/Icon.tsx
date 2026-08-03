import {
  ArrowRight,
  Banknote,
  BriefcaseBusiness,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleX,
  Clock,
  Loader,
  MapPin,
  Sprout,
  Star,
  Video,
  type LucideIcon,
} from 'lucide-react';
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
  | 'suitcase'
  | 'video';

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
};

const icons: Record<IconName, LucideIcon> = {
  'arrow-right': ArrowRight,
  banknote: Banknote,
  calendar: Calendar,
  'chevron-left': ChevronLeft,
  'chevron-down': ChevronDown,
  'chevron-right': ChevronRight,
  clock: Clock,
  'circle-check': CircleCheck,
  'circle-x': CircleX,
  loader: Loader,
  'map-pin': MapPin,
  star: Star,
  sprout: Sprout,
  suitcase: BriefcaseBusiness,
  video: Video,
};

export function Icon({ name, width = 13, height = width, strokeWidth = 1.6, ...props }: IconProps) {
  const IconComponent = icons[name];

  return (
    <IconComponent
      aria-hidden="true"
      height={height}
      width={width}
      strokeWidth={strokeWidth}
      {...props}
    />
  );
}
