import Single from "../../components/Single";
import { singleProduct } from "../../menu-item";
import "./expense.scss";

type Props = {};

const Expense = (props: Props) => {
  return (
    <div className="expense">
      <Single {...singleProduct} />
    </div>
  );
};

export default Expense;
