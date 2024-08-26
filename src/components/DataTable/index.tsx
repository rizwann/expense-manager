import React, { useState } from 'react';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import './dataTable.scss';
import useMediaQuery from '../../hooks/userMediaQuery';
import ConfirmationModal from '../Modal/Confirmation';

type Props = {
  columns: GridColDef[];
  rows: object[];
  slug: string;
  handleDelete: (id: string, name: string) => void;
};

const DataTable: React.FC<Props> = ({ columns, rows, slug, handleDelete }) => {
  const isMobile = useMediaQuery(768);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [name, setName] = useState<string>('');

  let columnList: string[] = []
   switch (slug) {
      case 'stores':
        columnList = [ 'name', 'image']
        break
      case 'expenses':
        columnList = ['storeName', 'cost']
        break
      case 'houses':
        columnList = ['name', 'image', 'code', 'users']
        break
      default:
        columnList = ['name']
  };
  // Define columns for mobile view
  const mobileColumns = columns.filter((col) =>
    columnList.includes(col.field)
  );

  const actionColumns: GridColDef = {
    field: 'actions',
    headerName: 'Actions',
    width: 200,
    renderCell: (params) => {
      return (
        <div className="action">
          <Link to={`/${slug}/${params.row._id}`}>
            <img src="/view.svg" alt="View" />
          </Link>
          <div
            className="delete"
            onClick={() => {
              setDeleteId(params.row._id);
              setName(params.row.name);
              setIsModalOpen(true);
            }}
          >
            <img src="/delete.svg" alt="Delete" />
          </div>
        </div>
      );
    },
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      handleDelete(deleteId, name);
      setIsModalOpen(false);
      setDeleteId(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setDeleteId(null);
  };

  return (
    <div className="data-table">
      {
        rows.length > 0 ? (
          <DataGrid
        className="data-grid"
        rows={rows}
        columns={[...(isMobile ? mobileColumns : columns), actionColumns]}
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
        rowHeight={slug === 'users' ? 70 : 53}
      />
        ) : (
          <p>No records found</p>
        )
      }
      <ConfirmationModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this record?"
      />
    </div>
  );
};

export default DataTable;
