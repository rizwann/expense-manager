import { ArrowBack, CloudDownload } from "@mui/icons-material";
import { useState, MouseEvent } from "react";
import { Link } from "react-router-dom";
import ThemeSwitcher from "../../components/ThemeSwitcher";
import "../../styles/auth.scss";

const DownloadApp = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = (event: MouseEvent<HTMLAnchorElement>) => {
    if (isDownloading) {
      event.preventDefault();
      return;
    }
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
    }, 2000);
  };

  return (
    <div className="auth-page">
      <div className="auth-container auth-container--center">
        <div className="auth-theme-switcher">
          <ThemeSwitcher />
        </div>
        <div className="auth-container__actions">
          <Link to="/" className="auth-back-link">
            <ArrowBack fontSize="small" />
            <span>Back to Home</span>
          </Link>
        </div>
        <h1 className="auth-header__title">Download Our App</h1>
        <p className="auth-text-muted">
          Keep your expenses organized even when you are offline. Get the latest
          build and install it on your device in a few taps.
        </p>

        <div className="auth-illustration">
          <img src="/logo.png" alt="Expense Manager app" />
        </div>
        <a
          href="https://www.mediafire.com/file/hdnskqqfooguvou/expenser.apk/file"
          download
          rel="noopener noreferrer"
          className={`auth-button auth-button--full${isDownloading ? " is-disabled" : ""}`}
          onClick={handleDownload}
        >
          <CloudDownload />
          {isDownloading ? "Downloading..." : "Download APK"}
        </a>

        {isDownloading && (
          <p className="auth-text-muted">
            Your download will start shortly...
          </p>
        )}
      </div>
    </div>
  );
};

export default DownloadApp;
