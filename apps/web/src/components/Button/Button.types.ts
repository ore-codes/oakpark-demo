import type { VariantProps } from 'class-variance-authority';
import { ComponentProps, ReactNode } from 'react';

import { buttonVariants } from './Button.variants';

export type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    icon?: ReactNode;
    iconSize?: string | number;
    isActive?: boolean;
    activeIcon?: ReactNode;
  };
