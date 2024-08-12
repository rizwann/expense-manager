import { GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import Add from "../../components/Add";
import DataTable from "../../components/DataTable";
import "./stores.scss";
import axios from "axios";
import { Store } from "../../types";
import { config } from "../../utils/config";

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
    renderCell: (params) => <img src={params.row.image ? `${import.meta.env.VITE_API_URL}/${params.row.image}` : "/noavatar.png "} />,
  },
]


const Stores = (props: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [stores, setStores] = useState<Store[]>([])
  const token = localStorage.getItem("token")

  useEffect(() => {
    //fetch stores
    const fetchStores = async () => {
      const storeApi = `${import.meta.env.VITE_API_URL}/api/stores`
      const data = await axios.get<Store[]>(storeApi,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        )
      setStores(data.data)
    }
  
    fetchStores()
  
  }, [])
  return (
    <div className="stores">
      <div className="info">
        <h1>Stores</h1>
        <button onClick={() => setModalOpen(true)}>Add Store</button>
      </div>
      <DataTable columns={columns} rows={stores.map(store => ({...store, id: store._id}))} slug="stores" />
      {modalOpen && (
        <Add setModalOpen={setModalOpen} slug="Stores" columns={config.storeFields} options={stores} />
      )}
    </div>
  );
};

export default Stores;
