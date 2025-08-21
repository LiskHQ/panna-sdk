import { IconProps } from '@/types/icon.types';

export function ReceivedTxnIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" {...props}>
      <circle cx="10" cy="10" r="9.5" fill="#86EFAC" stroke="#0A0A0A" />
      <path
        d="M10 6.0625V13.9375"
        stroke="#0A0A0A"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M13.9375 10L10 13.9375L6.0625 10"
        stroke="#0A0A0A"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
