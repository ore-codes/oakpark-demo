import { motion } from 'motion/react';
import { FC } from 'react';
import { Link } from 'react-router-dom';

import LoginForm from '@/chunks/auth/LoginForm/LoginForm.tsx';
import AppLogo from '@/components/AppLogo/AppLogo.tsx';
import { Page } from '@/constants/pages.ts';

const SignIn: FC = () => {
  return (
    <main className="flex flex-row">
      <motion.section
        initial={{ opacity: 0, x: -200 }}
        animate={{ opacity: 1, x: 0 }}
        className="grid flex-1 place-items-center"
      >
        <div className="flex flex-col gap-[22px] py-4 lg:min-w-[28rem]">
          <AppLogo className="self-center !text-lg" />
          <LoginForm />
          <section className="border-border rounded-xl p-4 text-center lg:border">
            <span>Don't have an account?</span>{' '}
            <Link
              to={Page.SignUp}
              className="font-semibold text-primary underline hover:no-underline"
            >
              Sign up
            </Link>
          </section>
        </div>
      </motion.section>
      <motion.figure
        initial={{ opacity: 0, x: 200 }}
        animate={{ opacity: 1, x: 0 }}
        className="sticky top-0 hidden h-screen basis-1/2 bg-[url('/images/signin-banner.jpg')] bg-cover bg-center brightness-75 lg:block"
      />
    </main>
  );
};

export default SignIn;
