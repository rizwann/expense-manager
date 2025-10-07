import React, { useState } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { CheckCircle, ArrowBack } from "@mui/icons-material";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import ThemeSwitcher from "../../components/ThemeSwitcher";
import "../../styles/auth.scss";

const ActivationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [isActivating, setIsActivating] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [counter, setCounter] = useState(3);

  const token = new URLSearchParams(location.search).get("token");

  const handleActivation = async () => {
    setIsActivating(true);
    setError(null);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/activate/${id}/${token}`
      );
      if (response.status === 200) {
        setIsActivated(true);
        const countdown = setInterval(() => {
          setCounter((prevCounter) => Math.max(prevCounter - 1, 0));
        }, 1000);
        setTimeout(() => {
          clearInterval(countdown);
          navigate("/login");
        }, 3000); // Redirect after 3 seconds
      } else {
        setError(response.data.message || "Activation failed. Please try again.");
      }
    } catch (err: any) {
      const message = err?.response?.data?.message;
      setError(message || "Activation failed. Please try again.");
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <div className="auth-page">
      <motion.div
        className="auth-container auth-container--center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="auth-theme-switcher">
          <ThemeSwitcher />
        </div>
        {!isActivated && (
          <div className="auth-container__actions">
            <Link to="/login" className="auth-back-link">
              <ArrowBack fontSize="small" />
              <span>Back to Login</span>
            </Link>
          </div>
        )}
        {!isActivated ? (
          <>
            <h1 className="auth-header__title">Activate Your Account</h1>
            <p className="auth-text-muted">
              Confirm your registration to start using Expense Manager.
            </p>
            <button
              onClick={handleActivation}
              className="auth-button auth-button--full"
              disabled={isActivating}
            >
              {isActivating ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Activate Account"
              )}
            </button>
            {error && <p className="auth-text-error">{error}</p>}
          </>
        ) : (
          <>
            <Confetti />
            <CheckCircle className="auth-text-success" fontSize="large" />
            <h1 className="auth-header__title">Account Activated!</h1>
            <p className="auth-text-muted">
              Your account has been successfully activated. You will be
              redirected to the login page shortly.
            </p>
            <p className="auth-text-muted">
              Redirecting in {counter} seconds...
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ActivationPage;
