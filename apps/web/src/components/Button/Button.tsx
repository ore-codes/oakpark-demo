import { Slot } from '@radix-ui/react-slot';
import cn from 'classnames';
import { forwardRef } from 'react';

import { ButtonProps } from './Button.types';
import { buttonVariants } from './Button.variants';

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      icon,
      activeIcon,
      iconSize = '1em',
      isActive = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const iconStyle = { fontSize: iconSize };

    const currentIcon = isActive && activeIcon ? activeIcon : icon;

    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
        <div className="flex items-center gap-2">
          {currentIcon && (
            <span className="icon-container mr-2" style={iconStyle}>
              {currentIcon}
            </span>
          )}
          {children}
        </div>
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export default Button;
