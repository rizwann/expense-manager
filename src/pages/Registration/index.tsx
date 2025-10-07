import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Registration from "../../components/Registration";
import { useAuth } from "../../hooks/useAuth";
import ThemeSwitcher from "../../components/ThemeSwitcher";
import "../../styles/auth.scss";

export default function RegistrationPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-theme-switcher">
          <ThemeSwitcher />
        </div>
        <Header
          heading="Sign up for an account"
          paragraph="Already have an account? "
          linkName="Login"
          linkUrl="/login"
        />
        <Registration />
      </div>
    </div>
  );
}
