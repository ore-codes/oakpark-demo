import { AnimatePresence, motion } from 'motion/react';
import { FC } from 'react';
import { Link } from 'react-router-dom';

import LoginForm from '@/chunks/auth/LoginForm/LoginForm.tsx';
import AppLogo from '@/components/AppLogo/AppLogo.tsx';
import { Page } from '@/constants/pages.ts';
import RegisterForm from '@/chunks/auth/RegisterForm/RegisterForm';

const SignIn: FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-r from-btn-primary/50 from-10% to-white to-40%">
      <img src="/images/grid.png" alt="background image" className="absolute inset-0 w-full h-full object-cover z-0" />
      <div className="relative z-10 max-w-[2000px] mx-auto min-h-screen flex flex-col">
        <header className="w-[80%] mx-auto lg:mt-14 mt-10 flex justify-between items-center">
          <Link to="/" className="cursor-pointer flex items-center space-x-1">
            <AppLogo />
          </Link>
        </header>
        <section className="w-[80%] mx-auto mt-20 1lg:mt-20 z-10 flex-col items-center flex justify-center space-y-10">
          <div className="text-center md:w-[70%] flex z-10 flex-col items-center justify-center space-y-3">
            <h1 className="text-header-text-primary font-inter-900 text-3xl md:text-5xl sm:w-[70%] mx-auto md:mx-0">
              Fast, reliable and secure conferencing
            </h1>
            <p className="text-text-primary sm:w-[80%] sm:mx-auto md:mx-0 mx-0 w-full">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquid
              vel voluptatum sunt adipisci non, labore voluptas vero ex quae,
              reiciendis eveniet atque consectetur ducimus molestias a, culpa
              modi inventore unde.
            </p>
          </div>
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
        </section>
      </div>
    </div>
  );
};

export default SignIn;
