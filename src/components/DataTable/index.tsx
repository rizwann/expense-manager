import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import "./dataTable.scss";

type Props = {
  columns: GridColDef[];
  rows: object[];
  slug: string;
};

const handleDelete = (id: string) => {
  console.log(id);
};

const DataTable: React.FC<Props> = ({ columns, rows, slug }) => {
  const actionColumns: GridColDef = {
    field: "actions",
    headerName: "Actions",
    width: 200,
    renderCell: (params) => {
      return (
        <div className="action">
          <Link to={`/${slug}/${params.row.id}`}>
            <img src="/view.svg" alt="" />
          </Link>
          <div
            className="delete"
            onClick={() => {
              handleDelete(params.row.id);
            }}
          >
            <img src="/delete.svg" alt="" />
          </div>
        </div>
      );
    },
  };
  return (
    <div className="data-table">
      <DataGrid
        className="data-grid"
        rows={rows}
        columns={[...columns, actionColumns]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        slots={{
          toolbar: GridToolbar,
        }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: {
              debounceMs: 500,
            },
          },
        }}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
        disableRowSelectionOnClick
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
      />
    </div>
  );
};

export default DataTable;
