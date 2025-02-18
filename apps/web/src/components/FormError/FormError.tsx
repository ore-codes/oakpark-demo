import { FC } from 'react';

const FormError: FC<{ message: string | undefined }> = (props) => {
  return props.message && <div className="text-xs text-danger">{props.message.toString()}</div>;
};

export default FormError;
