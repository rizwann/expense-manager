import Single from "../../components/Single";
import { singleUser } from "../../menu-item";
import "./store.scss";

type Props = {};

const Store = (props: Props) => {
  return (
    <div className="user">
      <Single {...singleUser} />
    </div>
  );
};

export default Store;
