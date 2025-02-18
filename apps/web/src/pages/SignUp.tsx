import { motion } from 'motion/react';
import { FC } from 'react';
import { Link } from 'react-router-dom';

import RegisterForm from '@/chunks/auth/RegisterForm/RegisterForm.tsx';
import AppLogo from '@/components/AppLogo/AppLogo.tsx';
import { Page } from '@/constants/pages.ts';

const SignUp: FC = () => {
  return (
    <main className="flex flex-row">
      <motion.section
        initial={{ opacity: 0, x: -200 }}
        animate={{ opacity: 1, x: 0 }}
        className="grid flex-1 place-items-center"
      >
        <div className="flex flex-col gap-[22px] py-4 lg:min-w-[28rem]">
          <AppLogo className="self-center !text-lg" />
          <RegisterForm />
          <section className="border-border rounded-xl p-4 text-center lg:border">
            <span>Already have an account?</span>{' '}
            <Link
              to={Page.SignIn}
              className="font-semibold text-primary underline hover:no-underline"
            >
              Sign in
            </Link>
          </section>
        </div>
      </motion.section>
      <motion.figure
        initial={{ opacity: 0, x: 200 }}
        animate={{ opacity: 1, x: 0 }}
        className="sticky top-0 hidden h-screen basis-1/2 bg-[url('/images/signup-banner.jpg')] bg-cover bg-center brightness-75 lg:block"
      />
    </main>
  );
};

export default SignUp;
