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
      className="flex items-center gap-2 rounded-lg bg-primary p-4 text-white shadow-lg transition-all hover:shadow-md hover:brightness-95"
    >
      <Icon icon={props.icon} className="size-5" />
      <span className="text-center text-base font-semibold text-white">{props.title}</span>
    </button>
  );
};

export default ActionButton;
