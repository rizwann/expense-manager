import { GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import Add from "../../components/Add";
import DataTable from "../../components/DataTable";
import "./stores.scss";

type Props = {};

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 200 },
  {
    field: "name",
    headerName: "Store Name",
    width: 200,
  },
  {
    field: "image",
    headerName: "Store Image",
    width: 100,
    renderCell: (params) => <img src={params.row.image || "/noavatar.png "} />,
  },
];

const rows = [
  { id: 1, name: "Store 1", image: "https://picsum.photos/200" },
  { id: 2, name: "Store 2", image: "https://picsum.photos/200" },
  { id: 3, name: "Store 3", image: "https://picsum.photos/200" },
  { id: 4, name: "Store 4", image: "https://picsum.photos/200" },
  { id: 5, name: "Store 5", image: "https://picsum.photos/200" },
  { id: 6, name: "Store 6", image: "https://picsum.photos/200" },
  { id: 7, name: "Store 7", image: "https://picsum.photos/200" },
  { id: 8, name: "Store 8", image: "https://picsum.photos/200" },
  { id: 9, name: "Store 9", image: "https://picsum.photos/200" },
  { id: 10, name: "Store 10", image: "https://picsum.photos/200" },
  { id: 11, name: "Store 11", image: "https://picsum.photos/200" },
];

const Stores = (props: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="stores">
      <div className="info">
        <h1>Stores</h1>
        <button onClick={() => setModalOpen(true)}>Add Store</button>
      </div>
      <DataTable columns={columns} rows={rows} slug="stores" />
      {modalOpen && (
        <Add setModalOpen={setModalOpen} slug="Stores" columns={columns} />
      )}
    </div>
  );
};

export default Stores;
