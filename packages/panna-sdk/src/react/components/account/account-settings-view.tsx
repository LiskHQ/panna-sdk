import { MailIcon, PhoneIcon } from 'lucide-react';
import { useActiveWallet, useLogout, useUserProfiles } from '@/hooks';
import { usePanna } from '../../hooks';
import { GoogleIcon } from '../icons/google';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Skeleton } from '../ui/skeleton';
import { Typography } from '../ui/typography';

export function AccountSettingsView() {
  const { client } = usePanna();
  const activeWallet = useActiveWallet();
  const { disconnect } = useLogout();
  const {
    data: userProfiles,
    isLoading,
    error
  } = useUserProfiles({ client: client! });

  const handleLogout = async () => {
    try {
      // Disconnect the wallet first (may trigger account activity events that need auth)
      if (activeWallet) {
        disconnect(activeWallet);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Extract email, phone and social from profiles
  const emailProfile = userProfiles?.find(
    (profile) => profile.type === 'email'
  );

  const phoneProfile = userProfiles?.find(
    (profile) => profile.type === 'phone'
  );

  const socialProfile = userProfiles?.find(
    (profile) => profile.type === 'google'
  );

  const renderData = () => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-6 rounded-sm" />
          <Skeleton className="h-4 flex-1 rounded-sm" />
        </div>
      );
    }

    if (error) {
      return (
        <Typography as="span" variant="small" className="text-destructive">
          Error: {error?.message}
        </Typography>
      );
    }

    const userEmail = emailProfile?.details?.email;
    const userPhone = phoneProfile?.details?.phone;
    const socialEmail = socialProfile?.details?.email;

    if (!userEmail && !userPhone && !socialEmail) {
      return (
        <Typography as="span" variant="small" className="text-muted-foreground">
          No contact information available
        </Typography>
      );
    }

    return (
      <div className="flex flex-col gap-3">
        {userEmail && (
          <div className="flex items-center gap-3">
            <MailIcon size={16} />
            <Typography as="span" variant="small">
              {userEmail}
            </Typography>
          </div>
        )}
        {userPhone && (
          <div className="flex items-center gap-3">
            <PhoneIcon size={16} />
            <Typography as="span" variant="small">
              {userPhone}
            </Typography>
          </div>
        )}
        {socialEmail && (
          <div className="flex items-center gap-3">
            <GoogleIcon size={16} />
            <Typography as="span" variant="small">
              {socialEmail}
            </Typography>
          </div>
        )}
      </div>
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
