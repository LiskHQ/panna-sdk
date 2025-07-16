import { DialogFooter } from './ui/dialog';
import { Typography } from './ui/typography';

export function AccountDialogFooter() {
  return (
    <DialogFooter className="flex flex-col justify-center! text-xs text-neutral-400">
      <Typography>Powered by Panna</Typography>
    </DialogFooter>
  );
}
