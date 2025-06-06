import { darkTheme } from 'thirdweb/react';

const PRIMARY = '#FFFFFF';
const LAYER_50 = '#0C0C0C';
const ZINC_800 = '#27272A';
const GRAY_100 = '#F3F4F6';
const GRAY_300 = '#D1D5DB';

export const liskTheme = darkTheme({
  colors: {
    modalBg: LAYER_50,
    borderColor: ZINC_800,
    accentText: GRAY_100,
    separatorLine: ZINC_800,
    skeletonBg: LAYER_50,
    primaryText: PRIMARY,
    secondaryText: GRAY_300
  }
});
