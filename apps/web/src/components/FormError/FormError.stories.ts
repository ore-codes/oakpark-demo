import { Meta, StoryObj } from '@storybook/react';

import FormError from './FormError.tsx';

type Story = StoryObj<typeof FormError>;

export const Primary: Story = {};

const meta: Meta<typeof FormError> = {
  component: FormError,
  args: {
    message: 'This field is required',
  },
  argTypes: {
    message: {
      control: 'text',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
