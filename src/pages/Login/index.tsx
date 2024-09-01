import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Login from "../../components/Login";
import { useAuth } from "../../hooks/useAuth";

export default function LoginPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);
  return (
    <div className="flex items-center justify-center h-screen min-h-full px-4 py-12 bg-gray-900 sm:px-6 lg:px-8">
    <div className="w-full max-w-md p-6 space-y-8 bg-gray-800 rounded-lg shadow-md">
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
