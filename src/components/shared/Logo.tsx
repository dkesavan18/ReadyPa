import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  showText?: boolean;
  textSize?: number;
  iconWidth?: number;
  iconHeight?: number;
  href?: string;
  className?: string;
}

export function Logo({
  showText = true,
  textSize = 24,
  iconWidth = 30,
  iconHeight = 27,
  href,
  className,
}: LogoProps) {
  const content = (
    <div className={cn("flex items-center gap-2", className)}>
      <Image
        src="/logo.svg"
        alt="ReadyZo"
        width={iconWidth}
        height={iconHeight}
        priority
        className="flex-shrink-0"
      />
      {showText && (
        <span
          className="font-poetsen font-normal leading-none tracking-tight"
          style={{ fontSize: textSize }}
        >
          <span className="text-brand-ready">Ready</span>
          <span className="text-brand-pa">Zo</span>
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        {content}
      </Link>
    );
  }

  return content;
}

export function LogoMark({
  width = 30,
  height = 27,
  className,
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <Image
      src="/logo.svg"
      alt="ReadyZo"
      width={width}
      height={height}
      className={cn("flex-shrink-0", className)}
    />
  );
}
