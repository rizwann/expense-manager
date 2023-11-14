import Single from "../../components/Single";
import { singleUser } from "../../menu-item";
import "./house.scss";

type Props = {};

const House = (props: Props) => {
  return (
    <div className="house">
      <Single {...singleUser} />
    </div>
  );
};

export default House;
