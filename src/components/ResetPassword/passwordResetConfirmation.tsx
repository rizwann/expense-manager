import "../../styles/auth.scss";

export default function PasswordResetConfirmation() {
  return (
    <div className="auth-fields auth-centered">
      <p className="auth-text-success">
        A password reset link has been sent to your email. Please check your
        inbox.
      </p>
      <p className="auth-text-muted">
        If you don't receive an email, please check your spam folder.
      </p>
    </div>
  );
}
