import { MediaRenderer } from 'thirdweb/react';
import { usePanna } from '@/hooks';

type MediaRendererProps = Omit<
  React.ComponentProps<typeof MediaRenderer>,
  'client'
> & {
  className?: string;
};

/*
 * CustomMediaRenderer is a wrapper around the MediaRenderer component from thirdweb.
 * It allows you to pass additional props and ensures that the client is provided from the Panna context.
 */

export function CustomMediaRenderer({
  className,
  ...props
}: MediaRendererProps) {
  const { client } = usePanna();

  return (
    <MediaRenderer
      data-slot="media-renderer"
      client={client}
      className={className}
      {...props}
    />
  );
}
