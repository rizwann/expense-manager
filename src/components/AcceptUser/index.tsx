import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { CheckCircle, ArrowBack } from "@mui/icons-material";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { Preferences } from "@capacitor/preferences";
import ThemeSwitcher from "../ThemeSwitcher";
import "../../styles/auth.scss";

type AcceptUserProps = {
  id?: string;
  houseCode?: string;
  ownId?: string;
};

const AcceptUser: React.FC<AcceptUserProps> = ({ id, houseCode, ownId }) => {
  const navigate = useNavigate();
  const [isAccepting, setIsAccepting] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [counter, setCounter] = useState(3);

  const getToken = async () => {
    const { value } = await Preferences.get({ key: "token" });
    return value;
  };

  const handleAccepting = async () => {
    setIsAccepting(true);
    setError(null);
    if (!id || !houseCode || !ownId) {
      setError("Invalid invitation link. Please check the URL.");
      setIsAccepting(false);
      return;
    }
    const token = await getToken();
    const url = `${import.meta.env.VITE_API_URL}/api/houses/accept-user/${id}/${houseCode}/${ownId}`;
    try {
      const response = await axios.post(url, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setIsAccepted(true);
        const countdown = setInterval(
          () => setCounter((prevCounter) => Math.max(prevCounter - 1, 0)),
          1000,
        );
        setTimeout(() => {
          clearInterval(countdown);
          navigate("/");
        }, 3000);
      } else {
        setError(response.data.message || "Acceptation failed. Please try again.");
      }
    } catch (err: any) {
      const message = err?.response?.data?.message;
      setError(message || "Acceptation failed. Please try again.");
    } finally {
      setIsAccepting(false);
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
        {!isAccepted && (
          <div className="auth-container__actions">
            <Link to="/" className="auth-back-link">
              <ArrowBack fontSize="small" />
              <span>Back to Home</span>
            </Link>
          </div>
        )}
        {!isAccepted ? (
          <>
            <h1 className="auth-header__title">Accept the user to join the house</h1>
            <p className="auth-text-muted">
              Confirm the invitation so they can start sharing expenses with your household.
            </p>
            <button
              onClick={handleAccepting}
              className="auth-button auth-button--full"
              disabled={isAccepting}
            >
              {isAccepting ? <CircularProgress size={24} color="inherit" /> : "Accept User"}
            </button>
            {error && <p className="auth-text-error">{error}</p>}
          </>
        ) : (
          <>
            <Confetti />
            <CheckCircle className="auth-text-success" fontSize="large" />
            <h1 className="auth-header__title">User Accepted!</h1>
            <p className="auth-text-muted">
              They are now part of your house. You will be redirected shortly.
            </p>
            <p className="auth-text-muted">Redirecting in {counter} seconds...</p>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default AcceptUser;
