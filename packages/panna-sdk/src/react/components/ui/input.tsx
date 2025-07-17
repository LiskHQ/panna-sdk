import * as React from 'react';
import { cn } from '../../utils/tw-utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      onFocus,
      onBlur,
      startAdornment,
      endAdornment,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      if (onFocus) onFocus(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      if (onBlur) onBlur(e);
    };

    return (
      <div
        className={cn(
          'border-layer-800 bg-layer-200 relative flex w-full items-center rounded-md border text-neutral-400 transition duration-150 ease-in-out',
          isFocused && 'ring-opacity-50 ring-1 ring-gray-400',
          className
        )}
      >
        {startAdornment && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            {startAdornment}
          </div>
        )}
        <input
          type={type}
          data-slot="input"
          className={cn(
            'file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-layer-800 flex h-9 w-full min-w-0 bg-transparent px-3 py-2 text-base shadow-none transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-0',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
            startAdornment ? 'pl-10' : 'pl-3',
            endAdornment
              ? '[appearance:textfield] pr-10 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0'
              : 'pr-3'
          )}
          ref={ref}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {endAdornment && (
          <div className="absolute inset-y-0 right-0 flex items-center text-gray-400">
            {endAdornment}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
