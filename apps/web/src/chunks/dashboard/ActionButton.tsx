import { Icon } from '@iconify/react';
import { FC } from 'react';

type ActionButtonProps = {
  icon: string;
  title: string;
  onClick?: () => void;
};

const ActionButton: FC<ActionButtonProps> = (props) => {
  return (
    <button
      onClick={props.onClick}
      className="flex size-24 flex-col items-center gap-2 rounded-2xl border bg-white p-4 text-primary shadow-lg transition-all hover:shadow-md hover:brightness-95 lg:size-32 lg:px-6"
    >
      <Icon icon={props.icon} className="size-12 lg:size-16" />
      <span className="text-center text-xs font-semibold lg:text-sm">{props.title}</span>
    </button>
  );
};

export default ActionButton;
