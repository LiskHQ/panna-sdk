import { Token, TokenInstance } from 'src/core';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Typography } from '../ui/typography';
import { ImageRenderer } from './collectibles-list';

type SelectCollectibleStepProps = {
  collectible: TokenInstance;
  token: Token;
};

export function SelectCollectibleStep({
  collectible,
  token
}: SelectCollectibleStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <Card className="p-0">
        <CardContent className="p-0">
          <ImageRenderer instance={collectible} />
        </CardContent>
      </Card>
      <Typography variant="large">
        {token.name} #{collectible.id}
      </Typography>
      <Button>Send</Button>
    </div>
  );
}
