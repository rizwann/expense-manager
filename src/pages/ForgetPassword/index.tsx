import { Link } from "react-router-dom";
import Header from "../../components/Header";
import ResetPassword from "../../components/ResetPassword";
import { GridArrowDownwardIcon } from "@mui/x-data-grid";

export default function ForgotPasswordPage() {
  return (
    <div className="flex items-center justify-center h-screen min-h-full px-4 py-12 bg-gray-900 sm:px-6 lg:px-8">
      {/* Back Button */}


      <div className="relative w-full max-w-md p-6 space-y-8 bg-gray-800 rounded-lg shadow-md">
      <Link to="/login" className="absolute flex items-center justify-center gap-1 px-3 py-1 text-xs font-medium text-white bg-purple-600 border border-transparent rounded-md group hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 sm:py-2">
        <div style={{
          transform: "rotate(90deg)",
        }}>
        <GridArrowDownwardIcon/>
        </div>
        <span className="text-sm">Login</span>
      </Link>
        <Header heading="Reset your password" />
        <ResetPassword />
      </div>
    </div>
  );
}
