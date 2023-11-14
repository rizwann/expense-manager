interface FormActionProps {
  type?: string;
  action?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  text: string;
}

export default function FormAction({
  type = "Button",
  action = "submit",
  text,
}: FormActionProps) {
  return (
    <>
      {type === "Button" ? (
        <button
          type={action}
          className="relative flex justify-center w-full px-4 py-2 mt-10 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md group hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          {text}
        </button>
      ) : (
        <></>
      )}
    </>
  );
}
