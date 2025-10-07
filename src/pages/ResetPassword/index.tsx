import { Link } from "react-router-dom";
import Header from "../../components/Header";
import PasswordResetForm from "../../components/ResetPassword/resetPassowordForm";
import { useAuth } from "../../hooks/useAuth";
import ThemeSwitcher from "../../components/ThemeSwitcher";
import { ArrowBack } from "@mui/icons-material";
import "../../styles/auth.scss";

export default function ResetPasswordPage() {
  const { verified } = useAuth();
  return (
    <div className="auth-page">
      <div className={`auth-container${!verified ? " auth-container--center" : ""}`}>
        <div className="auth-theme-switcher">
          <ThemeSwitcher />
        </div>
        <div className="auth-container__actions">
          <Link to="/login" className="auth-back-link">
            <ArrowBack fontSize="small" />
            <span>Back to Login</span>
          </Link>
        </div>
        {verified && <Header heading="Set your new password" />}
        <PasswordResetForm />
      </div>
    </div>
  );
}
