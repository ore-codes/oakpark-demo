import { FC } from 'react';

import Button from '@/components/Button/Button.tsx';
import FormError from '@/components/FormError/FormError.tsx';
import Textbox from '@/components/Textbox/Textbox.tsx';

import { registerFields } from './RegisterForm.config.ts';
import useRegisterForm from './useRegisterForm.ts';

const RegisterForm: FC = () => {
  const h = useRegisterForm();
  return (
    <form onSubmit={h.handleSubmit} className="flex flex-col gap-8 rounded-xl px-11 py-9 lg:border">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Sign up</h1>
        <h2 className="text-dark">
          Register an account and get access to all the platform's features for free.
        </h2>
      </div>
      <div className="flex flex-col gap-4">
        {registerFields.map(({ fieldName, ...props }) => (
          <div key={fieldName} className="space-y-1">
            <div className="text-sm">{props.placeholder}</div>
            <Textbox {...props} {...h.form.register(fieldName)} />
            <FormError message={h.form.formState.errors[fieldName]?.message} />
          </div>
        ))}
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
        Create an account
      </Button>
    </form>
  );
};

export default RegisterForm;
