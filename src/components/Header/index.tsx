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
    <div className="mb-10">
      <div className="flex justify-center">
        <img
          alt=""
          className="h-14 w-14"
          src="https://i.ibb.co/8xr4L5n/expenses.png"
        />
      </div>
      <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
        {heading}
      </h2>
      <p className="mt-2 mt-5 text-sm text-center text-gray-600">
        {paragraph}{" "}
        <Link
          to={linkUrl}
          className="font-medium text-purple-600 hover:text-purple-500"
        >
          {linkName}
        </Link>
      </p>
    </div>
  );
};

export default Header;
