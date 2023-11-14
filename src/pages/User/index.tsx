import Single from "../../components/Single";
import { singleUser } from "../../menu-item";
import "./user.scss";

type Props = {};

const User = (props: Props) => {
  return (
    <div className="user">
      <Single {...singleUser} />
    </div>
  );
};

export default User;
