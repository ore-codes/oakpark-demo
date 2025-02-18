import { Icon } from '@iconify/react';
import { FC } from 'react';
import { Link } from 'react-router-dom';

import Button from '@/components/Button/Button.tsx';
import FormError from '@/components/FormError/FormError.tsx';
import Textbox from '@/components/Textbox/Textbox.tsx';
import { copyToClipboard, formatMeetingCode } from '@/lib/utils.ts';

import { createMeetingFields } from './CreateMeeting.config.ts';
import useCreateMeeting from './useCreateMeeting.ts';

const CreateMeeting: FC = () => {
  const h = useCreateMeeting();

  if (h.createdMeeting) {
    const formattedCode = formatMeetingCode(h.createdMeeting.code);
    return (
      <div className="flex flex-col gap-8">
        <h1 className="text-2xl font-semibold text-dark">Meeting created</h1>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="subtle" onClick={() => copyToClipboard(formattedCode)}>
            {formattedCode}
            <Icon icon="solar:copy-bold" className="ml-2 size-6" />
          </Button>
          <Button onClick={() => copyToClipboard(h.meetingLink)}>
            <Icon icon="solar:copy-bold" className="size-6" /> Copy link
          </Button>
        </div>
        <Button asChild>
          <Link to={h.meetingLink}>Join the meeting</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={h.handleSubmit} className="flex flex-col gap-8">
      <h1 className="font-semibold">Create a Meeting</h1>
      <div className="flex flex-col gap-4">
        {createMeetingFields.map(({ fieldName, component, ...props }) => {
          const Comp = component ?? Textbox;
          return (
            <div key={fieldName} className="space-y-1">
              <div className="text-sm">{props.placeholder}</div>
              <Comp {...props} {...h.form.register(fieldName)} />
              <FormError message={h.form.formState.errors[fieldName]?.message} />
            </div>
          );
        })}
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
        Create meeting
      </Button>
    </form>
  );
};

export default CreateMeeting;
