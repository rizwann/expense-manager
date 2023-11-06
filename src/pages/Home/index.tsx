import BarChartBox from "../../components/BarChartBox";
import BigChart from "../../components/BigChart";
import ChartBox from "../../components/ChartBox";
import PieChartBox from "../../components/PieChartBox";
import TopBox from "../../components/TopBox";
import {
  barChartBoxAllUser,
  barChartBoxUserExpenseLastSixMonths,
  chartBoxConversion,
  chartBoxHouseExpense,
  chartBoxStoreExpense,
  chartBoxUserExpense,
} from "../../menu-item";
import "./home.scss";

type Props = {};

const Home = (props: Props) => {
  return (
    <div className="home">
      <div className="box box1">
        <TopBox />
      </div>
      <div className="box box2">
        <ChartBox {...chartBoxUserExpense} />
      </div>
      <div className="box box3">
        <ChartBox {...chartBoxHouseExpense} />
      </div>
      <div className="box box4">
        <PieChartBox />
      </div>
      <div className="box box5">
        <ChartBox {...chartBoxConversion} />
      </div>
      <div className="box box6">
        <ChartBox {...chartBoxStoreExpense} />
      </div>
      <div className="box box7">
        <BigChart />
      </div>
      <div className="box box8">
        <BarChartBox {...barChartBoxUserExpenseLastSixMonths} />
      </div>

      <div className="box box9">
        <BarChartBox {...barChartBoxAllUser} />{" "}
      </div>
    </div>
  );
};

export default Home;
