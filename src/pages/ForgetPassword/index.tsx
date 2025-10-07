import { Link } from "react-router-dom";
import Header from "../../components/Header";
import ResetPassword from "../../components/ResetPassword";
import ThemeSwitcher from "../../components/ThemeSwitcher";
import { ArrowBack } from "@mui/icons-material";
import "../../styles/auth.scss";

export default function ForgotPasswordPage() {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-theme-switcher">
          <ThemeSwitcher />
        </div>
        <div className="auth-container__actions">
          <Link to="/login" className="auth-back-link">
            <ArrowBack fontSize="small" />
            <span>Back to Login</span>
          </Link>
        </div>
        <Header heading="Reset your password" />
        <ResetPassword />
      </div>
    </div>
  );
}
