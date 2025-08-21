import { IconProps } from '@/types/icon.types';

export function MintedNFTTxnIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" {...props}>
      <circle cx="10" cy="10" r="9.5" fill="#D8B4FE" stroke="#0A0A0A" />
      <g clip-path="url(#clip0_2456_18450)">
        <path
          d="M10 4.375L11.7381 7.89625L15.625 8.46438L12.8125 11.2038L13.4763 15.0738L10 13.2456L6.52375 15.0738L7.1875 11.2038L4.375 8.46438L8.26187 7.89625L10 4.375Z"
          stroke="#0A0A0A"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_2456_18450">
          <rect
            width="13.5"
            height="13.5"
            fill="white"
            transform="translate(3.25 3.25)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
