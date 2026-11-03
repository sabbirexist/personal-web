import type { SVGProps } from "react";

export type IconName =
  | "arrowUpRight"
  | "arrowRight"
  | "arrowLeft"
  | "arrowDown"
  | "arrowUp"
  | "play"
  | "close"
  | "menu"
  | "sun"
  | "moon"
  | "plus"
  | "trash"
  | "pencil"
  | "check"
  | "chevronDown"
  | "external"
  | "upload"
  | "copy"
  | "mail"
  | "pin"
  | "clock"
  | "eye"
  | "eyeOff"
  | "save"
  | "logout"
  | "grid"
  | "film"
  | "sparkle"
  | "message"
  | "star"
  | "quote"
  | "scissors"
  | "monitor"
  | "layers"
  | "lock"
  | "refresh"
  | "image";

const paths: Record<IconName, React.ReactNode> = {
  arrowUpRight: <path d="M7 17 17 7M8.5 7H17v8.5" />,
  arrowRight: <path d="M4.5 12h15M13.5 6l6 6-6 6" />,
  arrowLeft: <path d="M19.5 12h-15M10.5 6l-6 6 6 6" />,
  arrowDown: <path d="M12 4.5v15M6 13.5l6 6 6-6" />,
  arrowUp: <path d="M12 19.5v-15M6 10.5l6-6 6 6" />,
  play: <path d="M8.5 5.6v12.8a.7.7 0 0 0 1.07.6l10.1-6.4a.7.7 0 0 0 0-1.2L9.57 5a.7.7 0 0 0-1.07.6Z" />,
  close: <path d="M5.5 5.5l13 13M18.5 5.5l-13 13" />,
  menu: <path d="M3.5 8h17M3.5 16h17" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4" />
    </>
  ),
  moon: <path d="M20 14.2A8.5 8.5 0 0 1 9.8 4a8.5 8.5 0 1 0 10.2 10.2Z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  trash: <path d="M4 7h16M9.5 7V4.8h5V7M6.5 7l.8 12.2a1.6 1.6 0 0 0 1.6 1.5h6.2a1.6 1.6 0 0 0 1.6-1.5L17.5 7M10 11v6M14 11v6" />,
  pencil: <path d="M4 20h4.2L20 8.2 15.8 4 4 15.8V20ZM14.5 5.3l4.2 4.2" />,
  check: <path d="M4.5 12.5l4.6 4.6L19.5 6.7" />,
  chevronDown: <path d="M5.5 9l6.5 6.5L18.5 9" />,
  external: <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />,
  upload: <path d="M12 16V4M7.5 8.5 12 4l4.5 4.5M4 16v2.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V16" />,
  copy: (
    <>
      <rect x="8.5" y="8.5" width="11.5" height="11.5" rx="2" />
      <path d="M15.5 5.5A2 2 0 0 0 13.5 3.5H5.5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="m4 7.5 8 5.5 8-5.5" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3.2 2" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: <path d="M4 4l16 16M9.9 5.4A9.6 9.6 0 0 1 12 5.8c6 0 9.5 6.2 9.5 6.2a17 17 0 0 1-2.7 3.4M6.3 7.3A17 17 0 0 0 2.5 12S6 18.2 12 18.2c1.2 0 2.3-.25 3.3-.65M10 10a2.9 2.9 0 0 0 4 4" />,
  save: (
    <>
      <path d="M4.5 5.5A1 1 0 0 1 5.5 4.5h10L19.5 8.5v10a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1v-13Z" />
      <path d="M8 4.5V9h7V4.5M8 19.5V14h8v5.5" />
    </>
  ),
  logout: <path d="M15 4.5h3.5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H15M10 8.5 6 12l4 3.5M6 12h9.5" />,
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.4" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.4" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.4" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.4" />
    </>
  ),
  film: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2" />
      <path d="M7.5 4.5v15M16.5 4.5v15M3 9.5h4.5M3 14.5h4.5M16.5 9.5H21M16.5 14.5H21" />
    </>
  ),
  sparkle: <path d="M12 3.5l1.9 5.3 5.3 1.9-5.3 1.9L12 18l-1.9-5.4L4.8 10.7l5.3-1.9L12 3.5ZM18.5 16.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" />,
  message: <path d="M20.5 11.5a8 8 0 0 1-11.6 7.2L4 20l1.4-4.5A8 8 0 1 1 20.5 11.5Z" />,
  star: <path d="m12 3.8 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8L3.6 9.9l5.8-.8L12 3.8Z" />,
  quote: <path d="M9.5 5.5C6.5 6.7 5 9 5 12v6.5h6.5V12H8.2c0-2 .8-3.4 2.6-4.2L9.5 5.5Zm9 0C15.5 6.7 14 9 14 12v6.5h6.5V12h-3.3c0-2 .8-3.4 2.6-4.2l-1.3-2.3Z" />,
  scissors: (
    <>
      <circle cx="6.5" cy="6.5" r="2.6" />
      <circle cx="6.5" cy="17.5" r="2.6" />
      <path d="M8.8 8.2 20 19M8.8 15.8 20 5" />
    </>
  ),
  monitor: (
    <>
      <rect x="2.5" y="4.5" width="19" height="13" rx="2" />
      <path d="M9 21h6M12 17.5V21" />
    </>
  ),
  layers: <path d="m12 3.5 8.5 4.6L12 12.7 3.5 8.1 12 3.5ZM3.5 12.3 12 16.9l8.5-4.6M3.5 16.4 12 21l8.5-4.6" />,
  lock: (
    <>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.4" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </>
  ),
  refresh: <path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3M19.5 4.5V9H15" />,
  image: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="m4.5 17 4.8-4.6 4 3.6 3.2-2.6 3.5 3.2" />
    </>
  ),
};

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  filled?: boolean;
}

export function Icon({ name, size = 18, strokeWidth = 1.5, filled, className, ...rest }: IconProps) {
  const isFilled = filled ?? (name === "play" || name === "star" || name === "quote");
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={isFilled ? "currentColor" : "none"}
      stroke={isFilled ? "none" : "currentColor"}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}

export function Stars({ count = 5, size = 13 }: { count?: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-1" aria-label={`${count} out of 5`}>
      {Array.from({ length: count }).map((_, i) => (
        <Icon key={i} name="star" size={size} className="text-accent" />
      ))}
    </span>
  );
}
