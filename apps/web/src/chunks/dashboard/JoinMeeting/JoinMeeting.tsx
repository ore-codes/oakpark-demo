import { FC } from 'react';

import Button from '@/components/Button/Button.tsx';
import FormError from '@/components/FormError/FormError.tsx';
import Textbox from '@/components/Textbox/Textbox.tsx';

import useJoinMeeting from './useJoinMeeting.ts';

const JoinMeeting: FC = () => {
  const h = useJoinMeeting();

  return (
    <form onSubmit={h.handleSubmit} className="flex flex-col gap-8">
      <h1 className="font-semibold">Join a Meeting</h1>
      <div className="flex flex-col gap-4">
        <div className="space-y-1">
          <div className="text-sm">Enter the meeting code</div>
          <Textbox placeholder="xxx-xxx-xxx" {...h.form.register('code')} />
          <FormError message={h.form.formState.errors.code?.message} />
        </div>
      </div>
      {h.apiRequest.errors.length > 0 && (
        <div className="rounded-md border border-danger bg-danger/20 p-2 text-sm text-danger">
          <h3 className="font-semibold">Please fix these errors and try again</h3>
          <ul className="mt-2 space-y-1">
            {h.apiRequest.errors.map((error, index) => (
              <li key={index} className="capitalize">
                &bull; {error}
              </li>
            ))}
          </ul>
        </div>
      )}
      <Button type="submit" disabled={h.apiRequest.loading}>
        Join meeting
      </Button>
    </form>
  );
};

export default JoinMeeting;
