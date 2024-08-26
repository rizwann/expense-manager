type Props = {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};

const Button = (props: Props) => {
  return (
    <button
      className="flex justify-center px-4 py-1 text-xs font-medium text-white bg-purple-600 border border-transparent rounded-md group hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 sm:py-2"
      onClick={props.onClick}
      type={props.type ? props.type : "button"}
    >
      {props.text}
    </button>
  );
};

export default Button;
