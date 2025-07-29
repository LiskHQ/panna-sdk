import { MailIcon } from 'lucide-react';
import {
  useLogout,
  useConnectedAccounts,
  useUserProfiles,
  usePanna
} from '../../hooks';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Typography } from '../ui/typography';

type UserProfile = {
  type: string;
  details?: {
    email?: string;
  };
};

export function AccountSettingsView() {
  const { disconnect: logout } = useLogout();
  const connectedAccounts = useConnectedAccounts();
  const { client } = usePanna();

  const { data: userProfiles } = useUserProfiles({
    client: client!
  });

  const activeConnectedAccount = connectedAccounts?.[0];

  const emailProfile = userProfiles?.find(
    (profile: UserProfile) =>
      profile.type === 'email' ||
      profile.type === 'google' ||
      profile.type === 'discord' ||
      profile.type === 'apple' ||
      profile.type === 'facebook'
  );

  const userEmail = emailProfile?.details?.email;

  const handleLogout = () => {
    if (activeConnectedAccount) {
      logout(activeConnectedAccount);
    }
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label>Account</Label>
        {userEmail && (
          <div className="flex items-center gap-3">
            <MailIcon size={16} />
            <Typography as="span" variant="small">
              {userEmail}
            </Typography>
          </div>
        )}
      </div>

      <Button onClick={handleLogout} variant="destructive" className="w-full">
        Log out
      </Button>
    </section>
  );
}
