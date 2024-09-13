import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

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
          setCounter((prevCounter) => prevCounter - 1);
        }, 1000);
        setTimeout(() => {
          clearInterval(countdown);
          navigate("/login");
        }, 3000); // Redirect after 3 seconds
      } else {
        setError(response.data.message || "Activation failed. Please try again.");
      }
    } catch (err: any) {
      console.log(err.response.data.message);
      setError(err.response.data.message || "Activation failed. Please try again.");
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <motion.div
        className="p-6 text-center bg-gray-800 rounded-lg shadow-lg"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {!isActivated ? (
          <>
            <h1 className="mb-4 text-2xl font-bold text-white">
              Activate Your Account
            </h1>
            <p className="mb-6 text-gray-400">
              Click the button below to activate your account.
            </p>
            <button
              onClick={handleActivation}
              className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={isActivating}
            >
              {isActivating ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Activate Account"
              )}
            </button>
            {error && (
              <p className="mt-4 text-sm text-red-500">{error}</p>
            )}
          </>
        ) : (
          <>
            <Confetti />
            <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
            <h1 className="mt-4 text-2xl font-bold text-white">
              Account Activated!
            </h1>
            <p className="mt-2 text-gray-400">
              Your account has been successfully activated. You will be
              redirected to the login page shortly.
            </p>
            <p className="mt-2 text-gray-400">
              Redirecting in {counter} seconds...
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ActivationPage;
