import { MailIcon } from 'lucide-react';
import { useAccount } from '../../hooks';
import { useAuth } from '../auth/auth-provider';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Skeleton } from '../ui/skeleton';
import { Typography } from '../ui/typography';

export function AccountSettingsView() {
  const { logout } = useAuth();
  const { data, isLoading, isError, error } = useAccount();

  const handleLogout = () => logout();

  const renderData = () => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-6 rounded-sm" />
          <Skeleton className="h-4 flex-1 rounded-sm" />
        </div>
      );
    }

    if (isError || !data) {
      return (
        <Typography as="span" variant="small" className="text-destructive">
          Error: {error?.message}
        </Typography>
      );
    }

    return (
      <>
        <div className="flex items-center gap-3">
          <MailIcon size={16} />
          <Typography as="span" variant="small">
            {data.email}
          </Typography>
        </div>
      </>
    );
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Label>Account</Label>
        {renderData()}
      </div>

      <Button onClick={handleLogout} variant="destructive" className="w-full">
        Log out
      </Button>
    </section>
  );
}
