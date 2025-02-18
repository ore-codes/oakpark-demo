import { Meta, StoryObj } from '@storybook/react';

import Textarea from './Textarea.tsx';

type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: 'Multiline Text input',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled multiline text input',
    disabled: true,
  },
};

const meta: Meta<typeof Textarea> = {
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
