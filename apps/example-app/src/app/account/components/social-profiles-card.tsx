'use client';

import { Loader2, Users, LinkIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';

type SocialProfile = {
  type: string;
  name?: string;
};

type SocialProfilesCardProps = {
  socialProfiles?: SocialProfile[];
  isLoadingSocialProfiles: boolean;
};

export function SocialProfilesCard({
  socialProfiles,
  isLoadingSocialProfiles
}: SocialProfilesCardProps) {
  // Extract social platform information
  const farcasterProfile = socialProfiles?.find(
    (profile) => profile.type === 'farcaster'
  );
  const lensProfile = socialProfiles?.find(
    (profile) => profile.type === 'lens'
  );
  const ensProfile = socialProfiles?.find((profile) => profile.type === 'ens');

  // Social platform configuration
  const socialPlatforms = [
    {
      profile: farcasterProfile,
      title: 'Farcaster',
      color: 'purple-500'
    },
    {
      profile: lensProfile,
      title: 'Lens Protocol',
      color: 'green-500'
    },
    {
      profile: ensProfile,
      title: 'ENS',
      color: 'blue-500'
    }
  ];

  // Don't render the card if there's no data and not loading
  if (!socialProfiles?.length && !isLoadingSocialProfiles) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="size-5" />
          Social Profiles
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border-input min-h-16 w-full border bg-transparent px-3 py-3 shadow-xs">
          {isLoadingSocialProfiles ? (
            <div className="flex items-center gap-2">
              <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
              <Typography
                variant="small"
                className="text-muted-foreground text-base md:text-sm"
              >
                Loading social profiles...
              </Typography>
            </div>
          ) : socialProfiles?.length ? (
            <div className="flex flex-col gap-3">
              {socialPlatforms.map(
                (platform) =>
                  platform.profile && (
                    <div
                      key={platform.title}
                      className={`flex items-center gap-3 rounded-lg border border-${platform.color}/20 bg-${platform.color}/10 p-2`}
                    >
                      <LinkIcon className={`size-5 text-${platform.color}`} />
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          className={`font-medium text-${platform.color}`}
                        >
                          {platform.title}
                        </Typography>
                        {platform.profile.name && (
                          <Typography
                            variant="small"
                            className="text-foreground text-xs"
                          >
                            {platform.profile.name}
                          </Typography>
                        )}
                      </div>
                    </div>
                  )
              )}
            </div>
          ) : (
            <div className="flex h-12 items-center justify-center">
              <Typography
                variant="small"
                className="text-muted-foreground text-base md:text-sm"
              >
                No social profiles connected
              </Typography>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
