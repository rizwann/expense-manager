import { GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import Add from "../../components/Add";
import DataTable from "../../components/DataTable";
import Button from "../components/Button";
import "./houses.scss";

type Props = {};

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 100 },
  {
    field: "description",
    headerName: "House Name",
    width: 120,
  },
  {
    field: "image",
    headerName: "House Image",
    width: 100,
    renderCell: (params) => <img src={params.row.image || "/noavatar.png "} />,
  },
  {
    field: "code",
    headerName: "Code",
    type: "number",
    width: 60,
  },
  {
    field: "users",
    headerName: "Members",
    width: 150,
    renderCell: (params) => {
      return (
        <div className="users">
          {params.row.users.map((user: any) => {
            return (
              <div className="user">
                <p>{user}</p>
              </div>
            );
          })}
        </div>
      );
    },
  },
];

const rows = [
  {
    id: 1,
    description: "House 1",
    image: "https://picsum.photos/200",
    code: "0496",
    users: ["Rizwan Kabir", "Shomrat", "Shozib"],
  },
  {
    id: 2,
    description: "House 2",
    image: "https://picsum.photos/200",
    code: "0496",
    users: ["Rizwan Kabir", "Shomrat", "Shozib"],
  },
  {
    id: 3,
    description: "House 3",
    image: "https://picsum.photos/200",
    code: "0496",
    users: ["Rizwan Kabir", "Shomrat", "Shozib"],
  },
  {
    id: 4,
    description: "House 4",
    image: "https://picsum.photos/200",
    code: "0496",
    users: ["Rizwan Kabir", "Shomrat", "Shozib"],
  },
  {
    id: 5,
    description: "House 5",
    image: "https://picsum.photos/200",
    code: "0496",
    users: ["Rizwan Kabir", "Shomrat", "Shozib"],
  },
  {
    id: 6,
    description: "House 6",
    image: "https://picsum.photos/200",
    code: "0496",
    users: ["Rizwan Kabir", "Shomrat", "Shozib"],
  },
  {
    id: 7,
    description: "House 7",
    image: "https://picsum.photos/200",
    code: "0496",
    users: ["Rizwan Kabir", "Shomrat", "Shozib"],
  },
  {
    id: 8,
    description: "House 8",
    image: "https://picsum.photos/200",
    code: "0496",
    users: ["Rizwan Kabir", "Shomrat", "Shozib"],
  },
  {
    id: 9,
    description: "House 9",
    image: "https://picsum.photos/200",
    code: "0496",
    users: ["Rizwan Kabir", "Shomrat", "Shozib"],
  },
  {
    id: 10,
    description: "House 10",
    image: "https://picsum.photos/200",
    code: "0496",
    users: ["Rizwan Kabir", "Shomrat", "Shozib"],
  },
  {
    id: 11,
    description: "House 11",
    image: "https://picsum.photos/200",
    code: "0496",
    users: ["Rizwan Kabir", "Shomrat", "Shozib"],
  },
];

const Houses = (props: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="houses">
      <div className="info">
        <h1>Houses</h1>
        <Button onClick={() => setModalOpen(true)} text="Add House" />
      </div>
      <DataTable columns={columns} rows={rows} slug="Houses" />
      {modalOpen && (
        <Add
          setModalOpen={setModalOpen}
          slug="Houses"
          columns={columns.filter((column) => column.field !== "users")}
        />
      )}
    </div>
  );
};

export default Houses;
