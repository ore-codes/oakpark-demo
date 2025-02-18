import { Meta, StoryObj } from '@storybook/react';

import Textbox from './Textbox.tsx';

type Story = StoryObj<typeof Textbox>;

export const TextInput: Story = {
  args: {
    placeholder: 'Text input',
  },
};

export const FileInput: Story = {
  args: {
    placeholder: 'File input',
    type: 'file',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
};

const meta: Meta<typeof Textbox> = {
  component: Textbox,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
