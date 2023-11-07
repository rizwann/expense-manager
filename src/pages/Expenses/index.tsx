import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import DataTable from "../../components/DataTable";
import "./expenses.scss";

type Props = {};

const rows = [
  {
    id: "654384d67207439061004b72",
    storeName: "adidas",
    storeImg: "https://picsum.photos/200/300",
    storeId: "6536affcdf1bab53caae9456",
    cost: 64.23,
    category: "Grocery",
    description: "hag3u",
    user: "653686b3d426931967abc8e3",
    houseCode: "0496",
    date: "2023-01-02T11:15:34.335Z",
    __v: 0,
  },
  {
    id: "654384db7207439061004b76",
    storeName: "adidas",
    storeImg: "uploads/1698082812649-adidas",
    storeId: "6536affcdf1bab53caae9456",
    cost: 641.23,
    category: "Grocery",
    description: "hag3u",
    user: "653686b3d426931967abc8e3",
    houseCode: "0496",
    date: "2023-11-02T11:15:39.912Z",
    __v: 0,
  },
  {
    id: "654384df7207439061004b7a",
    storeName: "adidas",
    storeImg: "uploads/1698082812649-adidas",
    storeId: "6536affcdf1bab53caae9456",
    cost: 41.23,
    category: "Grocery",
    description: "hag3u",
    user: "653686b3d426931967abc8e3",
    houseCode: "0496",
    date: "2023-11-02T11:15:43.021Z",
    __v: 0,
  },
  {
    id: "654384e37207439061004b7e",
    storeName: "adidas",
    storeImg: "uploads/1698082812649-adidas",
    storeId: "6536affcdf1bab53caae9456",
    cost: 241.23,
    category: "Grocery",
    description: "hag3u",
    user: "653686b3d426931967abc8e3",
    houseCode: "0496",
    date: "2023-11-02T11:15:47.715Z",
    __v: 0,
  },
  {
    id: "654384ea7207439061004b82",
    storeName: "adidas",
    storeImg: "uploads/1698082812649-adidas",
    storeId: "6536affcdf1bab53caae9456",
    cost: 411.23,
    category: "Grocery",
    description: "hag3u",
    user: "653686b3d426931967abc8e3",
    houseCode: "0496",
    date: "2023-11-02T11:15:54.692Z",
    __v: 0,
  },
  {
    id: "6543851a7207439061004b86",
    storeName: "GS-Mart",
    storeImg: "uploads/1698082768529-GS-Mart",
    storeId: "6536afd03b1b7212d89478cf",
    cost: 4111.23,
    category: "Butcher",
    description: "hag3u",
    user: "653686b3d426931967abc8e3",
    houseCode: "0496",
    date: "2023-11-02T11:16:42.634Z",
    __v: 0,
  },
  {
    id: "6543851e7207439061004b8a",
    storeName: "GS-Mart",
    storeImg: "uploads/1698082768529-GS-Mart",
    storeId: "6536afd03b1b7212d89478cf",
    cost: 111.23,
    category: "Butcher",
    description: "hag3u",
    user: "653686b3d426931967abc8e3",
    houseCode: "0496",
    date: "2023-11-02T11:16:46.440Z",
    __v: 0,
  },
  {
    id: "654385207207439061004b8e",
    storeName: "GS-Mart",
    storeImg: "uploads/1698082768529-GS-Mart",
    storeId: "6536afd03b1b7212d89478cf",
    cost: 11.23,
    category: "Butcher",
    description: "hag3u",
    user: "653686b3d426931967abc8e3",
    houseCode: "0496",
    date: "2023-11-02T11:16:48.848Z",
    __v: 0,
  },
];

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "image",
    headerName: "Image",
    width: 100,
    renderCell: (params) => (
      <img src={params.row.storeImg || "/noavatar.png "} />
    ),
  },

  {
    field: "storeName",
    headerName: "Store name",
    width: 100,
  },
  {
    field: "category",
    headerName: "Category",
    width: 100,
  },
  {
    field: "description",
    headerName: "Description",
    width: 100,
  },
  {
    field: "cost",
    headerName: "Cost",
    type: "number",
    width: 110,
  },
  //  convert date to local date
  {
    field: "date",
    headerName: "Date",
    valueGetter: (params: GridValueGetterParams) =>
      new Date(params.row.date).toLocaleDateString("en-DE", {
        hour: "2-digit",
        minute: "2-digit",
        month: "short",
        day: "numeric",
      }),
    width: 110,
  },
];

const Expenses = (props: Props) => {
  return (
    <div className="expenses">
      <div className="info">
        <h1>Expenses</h1>
        <button>Add Expense</button>
      </div>
      <DataTable columns={columns} rows={rows} slug="expenses" />
    </div>
  );
};

export default Expenses;
