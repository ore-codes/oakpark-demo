import { Meta, StoryObj } from '@storybook/react';

import AppLogo from './AppLogo.tsx';

export const Default: StoryObj<typeof AppLogo> = {
  args: {},
};

export default {
  component: AppLogo,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof AppLogo>;
