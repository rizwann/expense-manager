export default function PasswordResetConfirmation() {
  return (
    <div className="mt-8 space-y-6 text-center">
      <p className="text-green-500">
        A password reset link has been sent to your email. Please check your
        inbox.
      </p>
      <p className="text-gray-500">
        If you don't receive an email, please check your spam folder.
      </p>
    </div>
  );
}
