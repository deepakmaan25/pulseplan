import type { Platform } from "./chips/PlatformChip";
import { Linkedin, Instagram, Youtube } from "lucide-react";

/**
 * Real platform logos. LinkedIn / Instagram / YouTube come from lucide;
 * X and Threads are inline SVGs (lucide has no current X mark or Threads icon).
 * Rendered as currentColor so the parent can tint with the brand token.
 */
export function PlatformIcon({
  platform,
  size = 14,
}: {
  platform: Platform;
  size?: number;
}) {
  switch (platform) {
    case "li":
      return <Linkedin size={size} strokeWidth={2} aria-hidden="true" />;
    case "ig":
      return <Instagram size={size} strokeWidth={2} aria-hidden="true" />;
    case "yt":
      return <Youtube size={size} strokeWidth={2} aria-hidden="true" />;
    case "x":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "th":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 013.12.156c-.106-.807-.35-1.51-.729-2.096-.518-.8-1.32-1.21-2.38-1.216h-.032c-.735 0-1.732.212-2.373 1.2l-1.75-1.18C10.32 6.116 11.76 5.5 13.328 5.5h.06c2.622.023 4.174 1.632 4.328 4.437.088.037.176.077.263.118 1.256.63 2.176 1.583 2.66 2.76.677 1.634.74 4.3-1.426 6.42-1.65 1.617-3.647 2.34-6.464 2.365z" />
        </svg>
      );
    default:
      return null;
  }
}
