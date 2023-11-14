import Header from "../../components/Header";
import ResetPassword from "../../components/ResetPassword";

export default function ForgotPasswordPage() {
  return (
    <div className="flex items-center justify-center h-screen min-h-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <Header heading="Reset your password" />
        <ResetPassword />
      </div>
    </div>
  );
}
