import { FC } from 'react';

import Button from '@/components/Button/Button.tsx';
import FormError from '@/components/FormError/FormError.tsx';
import Textbox from '@/components/Textbox/Textbox.tsx';

import { loginFields } from './LoginForm.config.ts';
import useLoginForm from './useLoginForm.ts';

const LoginForm: FC = () => {
  const h = useLoginForm();
  return (
    <form
      onSubmit={h.handleSubmit}
      className="border-border flex flex-col gap-8 rounded-xl px-11 py-9 lg:border"
    >
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Sign in</h1>
        <h2 className="text-dark">Welcome. Enter your credentials to log in to your account.</h2>
      </div>
      <div className="flex flex-col gap-4">
        {loginFields.map(({ fieldName, ...props }) => (
          <div key={fieldName} className="space-y-1">
            <div className="text-sm">{props.placeholder}</div>
            <Textbox {...props} {...h.form.register(fieldName)} />
            <FormError message={h.form.formState.errors[fieldName]?.message} />
          </div>
        ))}
      </div>
      {h.apiRequest.errors.length > 0 && (
        <div className="rounded-md border border-danger bg-danger/20 p-2 text-sm capitalize text-danger">
          {h.apiRequest.errors[0]}
        </div>
      )}
      <Button type="submit" disabled={h.apiRequest.loading}>
        Sign in
      </Button>
    </form>
  );
};

export default LoginForm;
