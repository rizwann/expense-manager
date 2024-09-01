type Props = {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  size?: "sm" | "md" | "lg";
};

const Button = (props: Props) => {
  return (
    <button
      className="flex justify-center px-4 py-1 text-xs font-medium text-white bg-purple-600 border border-transparent rounded-md group hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 sm:py-2"
      onClick={props.onClick}
      type={props.type ? props.type : "button"}
      style={{
        // size
        padding: props.size === "sm" ? "0.2rem 0.5rem" : props.size === "lg" ? "0.75rem 1.5rem" : "0.5rem 1rem",
      }}
    >
      {props.text}
    </button>
  );
};

export default Button;
