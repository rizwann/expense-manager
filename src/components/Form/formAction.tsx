import "../../styles/auth.scss";

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
        <button type={action} className="auth-submit">
          {text}
        </button>
      ) : (
        <></>
      )}
    </>
  );
}
