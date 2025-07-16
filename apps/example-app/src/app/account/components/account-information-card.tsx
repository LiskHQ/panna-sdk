'use client';

import { Loader2, Mail, Phone, User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';

type AccountInformationCardProps = {
  userEmail?: string;
  userPhone?: string;
  isLoadingProfiles: boolean;
};

export function AccountInformationCard({
  userEmail,
  userPhone,
  isLoadingProfiles
}: AccountInformationCardProps) {
  // Don't render the card if there's no data and not loading
  if (!userEmail && !userPhone && !isLoadingProfiles) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="size-5" />
          Account Information
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* User Email */}
        {(userEmail || isLoadingProfiles) && (
          <div className="flex flex-col gap-4">
            <Typography variant="small" className="flex items-center gap-2">
              <Mail className="size-4" />
              Email
            </Typography>
            <div className="border-input flex h-10 w-full items-center border bg-transparent px-3 py-2 shadow-xs">
              {isLoadingProfiles ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
                  <Typography
                    variant="small"
                    className="text-muted-foreground text-base md:text-sm"
                  >
                    Loading email...
                  </Typography>
                </div>
              ) : userEmail ? (
                <Typography
                  variant="small"
                  className="text-foreground text-base font-medium md:text-sm"
                >
                  {userEmail}
                </Typography>
              ) : (
                <Typography
                  variant="small"
                  className="text-muted-foreground text-base md:text-sm"
                >
                  No email available
                </Typography>
              )}
            </div>
          </div>
        )}

        {/* User Phone */}
        {(userPhone || isLoadingProfiles) && (
          <div className="flex flex-col gap-4">
            <Typography variant="small" className="flex items-center gap-2">
              <Phone className="size-4" />
              Phone Number
            </Typography>
            <div className="border-input flex h-10 w-full items-center border bg-transparent px-3 py-2 shadow-xs">
              {isLoadingProfiles ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
                  <Typography
                    variant="small"
                    className="text-muted-foreground text-base md:text-sm"
                  >
                    Loading phone...
                  </Typography>
                </div>
              ) : userPhone ? (
                <Typography
                  variant="small"
                  className="text-foreground text-base font-medium md:text-sm"
                >
                  {userPhone}
                </Typography>
              ) : (
                <Typography
                  variant="small"
                  className="text-muted-foreground text-base md:text-sm"
                >
                  No phone number available
                </Typography>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
