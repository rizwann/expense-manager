import "./footer.scss";

const Footer = () => {
  return (
    <div className="footer">
      <span>House Expense Manager</span>
      <span>
        {/* year */}

        {new Date().getFullYear()}
      </span>
    </div>
  );
};

export default Footer;
