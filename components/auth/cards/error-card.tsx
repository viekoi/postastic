import {AlertCircle} from 'lucide-react'

import { AuthFormCard } from './auth-form-card';

export const ErrorCard = () => {
  return (
    <AuthFormCard
      headerLabel="Oops! Something went wrong!"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="w-full flex justify-center items-center">
      <AlertCircle className="text-destructive" />
      </div>
    </AuthFormCard>
  );
};