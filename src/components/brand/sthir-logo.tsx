import Image from 'next/image';
import { cn } from '@/lib/utils';

const LOGOS = {
  compact: { src: '/brand/sthir-logo-compact.png', width: 1024, height: 737 },
  full: { src: '/brand/sthir-logo-full.png', width: 1024, height: 1024 },
  mark: { src: '/brand/sthir-logo-mark.png', width: 512, height: 512 },
} as const;

type Variant = keyof typeof LOGOS;

type SthirLogoProps = {
  className?: string;
  height?: number;
  priority?: boolean;
  variant?: Variant;
};

export function SthirLogo({
  className,
  height = 48,
  priority = false,
  variant = 'compact',
}: SthirLogoProps) {
  const logo = LOGOS[variant];

  return (
    <Image
      src={logo.src}
      alt="Sthir"
      width={logo.width}
      height={logo.height}
      priority={priority}
      className={cn('h-auto w-auto object-contain object-left', className)}
      style={{ height, maxHeight: height }}
    />
  );
}

/** Icon-only — best for footer/header when paired with wordmark text */
export function SthirMark(props: Omit<SthirLogoProps, 'variant'>) {
  return <SthirLogo {...props} variant="mark" height={props.height ?? 36} />;
}
