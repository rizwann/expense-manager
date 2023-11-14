import Header from "../../components/Header";
import PasswordResetForm from "../../components/ResetPassword/resetPassowordForm";
import { useAuth } from "../../hooks/useAuth";

export default function ResetPasswordPage() {
  const { verified } = useAuth();
  return (
    <div className="flex items-center justify-center h-screen min-h-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {verified && <Header heading="Set your new password" />}
        <PasswordResetForm />
      </div>
    </div>
  );
}
