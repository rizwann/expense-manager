import { GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import Add from "../../components/Add";
import DataTable from "../../components/DataTable";
import { userRows } from "../../menu-item";
import "./users.scss";
type Props = {};

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "image",
    headerName: "Image",
    width: 100,
    renderCell: (params) => {
      return <img src={params.row.image || "/noavatar.png"} alt="" />;
    },
  },
  {
    field: "username",
    type: "string",
    headerName: "Username",
    width: 150,
  },

  {
    field: "email",
    type: "string",
    headerName: "Email",
    width: 200,
  },

  {
    field: "active",
    headerName: "Verified",
    width: 150,
    type: "boolean",
  },
];

const addUserColumns: GridColDef[] = [
  ...columns.filter((col) => col.field !== "active"),
  {
    field: "password",
    type: "password",
    headerName: "Password",
    width: 100,
  },
];
const Users = (props: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="users">
      <div className="info">
        <h1>Users</h1>
        <button onClick={() => setModalOpen(true)}>Add New User</button>
      </div>
      <DataTable slug="users" columns={columns} rows={userRows} />
      {/* TEST THE API */}

      {/* {isLoading ? (
      "Loading..."
    ) : (
      <DataTable slug="users" columns={columns} rows={data} />
    )} */}
      {modalOpen && (
        <Add slug="user" columns={addUserColumns} setModalOpen={setModalOpen} />
      )}
    </div>
  );
};

export default Users;
