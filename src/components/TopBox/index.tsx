import { dummyExpenses } from "../../menu-item";
import "./topBox.scss";

const TopBox = () => {
  return (
    <div className="top-box">
      <h1>Recent Expenses</h1>
      <div className="list">
        {dummyExpenses.map((expense) => {
          const date = new Date(expense.date).toLocaleDateString("en-DE", {
            month: "short",
            day: "numeric",
          });
          return (
            <div className="list-item" key={expense._id}>
              <div className="user">
                <img src={expense.storeImg} alt="" />

                <div className="user-texts">
                  <span className="storename">{expense.storeName}</span>
                  <span className="date">{date}</span>
                </div>
              </div>
              <span className="amount">${expense.cost}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopBox;
