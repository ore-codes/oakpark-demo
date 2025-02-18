import cn from 'classnames';
import { forwardRef } from 'react';

import { TextareaProps } from './Textarea.types.ts';

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'flex min-h-24 w-full resize-none rounded-md border-2 bg-light py-2 pl-4 pr-3 text-sm transition-all',
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

Textarea.displayName = 'Textbox';

export default Textarea;
