import cn from 'classnames';
import { forwardRef } from 'react';

import { TextboxProps } from './Textbox.types.ts';

const Textbox = forwardRef<HTMLInputElement, TextboxProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'bg-light flex h-12 w-full rounded-md border-2 py-2 pl-4 pr-3 text-sm transition-all',
        'file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'focus-visible:border-primary focus-visible:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Textbox.displayName = 'Textbox';

export default Textbox;
