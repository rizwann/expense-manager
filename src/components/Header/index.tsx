import { Link } from "react-router-dom";

interface IProps {
  heading: string;
  paragraph?: string;
  linkName?: string;
  linkUrl?: string;
}

const Header: React.FC<IProps> = ({
  heading,
  paragraph,
  linkName,
  linkUrl = "#",
}) => {
  return (
    <div className="mb-10 text-gray-200">
      <div className="flex justify-center">
        <img
          alt=""
          className="h-14 w-14"
          src={import.meta.env.VITE_LOGO_URL}
        />
      </div>
      <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-100">
        {heading}
      </h2>
      <p className="mt-2 mt-5 text-sm text-center text-gray-400">
        {paragraph}{" "}
        <Link
          to={linkUrl}
          className="font-medium text-purple-400 hover:text-purple-300"
        >
          {linkName}
        </Link>
      </p>
    </div>
  );
};

export default Header;
