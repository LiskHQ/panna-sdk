import { IconProps } from '@/types/icon.types';

export function SentTxnIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" {...props}>
      <circle cx="10" cy="10" r="9.5" fill="#FDE68A" stroke="#0A0A0A" />
      <g clipPath="url(#clip0_2456_18423)">
        <path
          d="M14.5 5.5L8.3125 11.6875"
          stroke="#0A0A0A"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.5 5.5L10.5625 16.75L8.3125 11.6875L3.25 9.4375L14.5 5.5Z"
          stroke="#0A0A0A"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_2456_18423">
          <rect
            width="13.5"
            height="13.5"
            fill="white"
            transform="translate(2.125 4.375)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
