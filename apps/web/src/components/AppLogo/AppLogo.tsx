import { Icon } from '@iconify/react';
import cn from 'classnames';
import { ComponentProps, FC } from 'react';

const AppLogo: FC<Pick<ComponentProps<'div'>, 'className'>> = (props) => {
  return (
    <div
      className={cn(
        'inline-flex cursor-pointer items-center gap-1 text-sm text-primary',
        props.className
      )}
    >
      <Icon icon="fluent:video-recording-20-filled" />
      <div className="font-bold tracking-tighter">STELLAR</div>
    </div>
  );
};

export default AppLogo;
