import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Login from "../../components/Login";
import { useAuth } from "../../hooks/useAuth";
import ThemeSwitcher from "../../components/ThemeSwitcher";
import "../../styles/auth.scss";

export default function LoginPage() {
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
          heading="Login to your account"
          paragraph="Don't have an account yet? "
          linkName="Signup"
          linkUrl="/registration"
        />
        <Login />
      </div>
    </div>
  );
}
