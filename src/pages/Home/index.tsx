import { useState } from "react";
import BarChartBox from "../../components/BarChartBox";
import BigChart from "../../components/BigChart";
import ChartBox from "../../components/ChartBox";
import JoinHouse from "../../components/JoinHouse";
import PieChartBox from "../../components/PieChartBox";
import TopBox from "../../components/TopBox";
import { useAuth } from "../../hooks/useAuth";
import {
  barChartBoxAllUser,
  barChartBoxUserExpenseLastSixMonths,
  chartBoxConversion,
  chartBoxHouseExpense,
  chartBoxStoreExpense,
  chartBoxUserExpense,
} from "../../menu-item";
import "./home.scss";
import { config } from "../../utils/config";
import Button from "../components/Button";
import { Typography } from "@mui/material";
import AddHouse from "../../components/AddHouse";

type Props = {};

const Home = (props: Props) => {
  const [joinHouseModal, setJoinHouseModal] = useState(false)
  const [createHouseModal, setCreateHouseModal] = useState(false)
  const { user, selectedHouse, setRefresh } = useAuth();
  console.log(user, "user");
  if(!user) return null;
  if (!(user.houseCodes.length > 0)) {
    return(
      <div style={{
        display: "flex",
        flexDirection: "column",  
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}>
        <div className="text-center">
        <Typography variant="h5" style={{
          marginBottom: "1rem",
        }
        }>You're currently not associated with any house. </Typography>
        <Typography variant="h5">Please join or create a house to get started.</Typography>
        </div>
          <div className="flex flex-col items-center justify-center gap-4 mt-4 sm:flex-row">
          <Button text="Join a House" size='lg' onClick={() => setJoinHouseModal(true)}/>
          <Button text="Create a House" size='lg' onClick={() => setCreateHouseModal(true)}/>
          </div>
        {joinHouseModal && (
          <JoinHouse
            setModalOpen={setJoinHouseModal}
            columns={config.houseFields.filter((field) => field.field === "code")}
            setRefresh={setRefresh}
          />
        )
  } 
  {
    createHouseModal && (
      <AddHouse
        setModalOpen={setCreateHouseModal}
        columns={config.houseFields}
        setRefresh={setRefresh}
      />
    )
  }
      </div>
    )
  }
  return (
    <div className="home">
      <div className="box box1">
        <TopBox user={user} />
      </div>
      <div className="box box2">
        {selectedHouse && <ChartBox {...chartBoxUserExpense} user={user} type="weeklyUser" selectedHouse={selectedHouse} />}
      </div>
      <div className="box box3">
        {selectedHouse && <ChartBox {...chartBoxHouseExpense} user={user} type="houseExpenses" selectedHouse={selectedHouse}  />}
      </div>
      <div className="box box4">
        {selectedHouse && <PieChartBox user={user} selectedHouse={selectedHouse} />}
      </div>
      <div className="box box5">
        {selectedHouse && <ChartBox {...chartBoxConversion} user={user} type="popularStore" selectedHouse={selectedHouse} />}
      </div>
      <div className="box box6">
        {selectedHouse && <ChartBox {...chartBoxStoreExpense} user={user} type="popularCategory" selectedHouse={selectedHouse}  />}
      </div>
      <div className="box box7">
        {selectedHouse && <BigChart selectedHouse={selectedHouse} />}
      </div>
      <div className="box box8">
        {selectedHouse && <BarChartBox {...barChartBoxUserExpenseLastSixMonths} user={user} type={"userSixMonths"} selectedHouse={selectedHouse} />}
      </div>

      <div className="box box9">
        {selectedHouse && <BarChartBox {...barChartBoxAllUser} user={user} type={"contribution"} selectedHouse={selectedHouse} />}
      </div>
    </div>
  );
};

export default Home;
