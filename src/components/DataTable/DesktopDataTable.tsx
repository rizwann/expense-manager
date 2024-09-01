import React, { useState } from 'react';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import ConfirmationModal from '../Modal/Confirmation';
import './dataTable.scss';
import Button from '../../pages/components/Button';
import { useAuth } from '../../hooks/useAuth';

type Props = {
  columns: GridColDef[];
  rows: object[];
  slug: string;
  handleDelete: (id: string, name: string) => void;
  handleLeaveHouse?: (id: string, name: string) => void;
};

const DesktopDataTable: React.FC<Props> = ({ columns, rows, slug, handleDelete, handleLeaveHouse }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [leaveHouseId, setLeaveHouseId] = useState<string | null>(null);
  const [leaveHouseName, setLeaveHouseName] = useState<string>('');
  const [isLeaveHouseModalOpen, setIsLeaveHouseModalOpen] = useState(false);
  const {user} = useAuth()

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
              if (slug === 'Houses'){
                setName(params.row.description);
              } else {
              setName(params.row.name);
              }
              setIsModalOpen(true);
            }}
          >
            <img src="/delete.svg" alt="Delete" />
          </div>
          { slug === 'Houses' && user?.houseCodes.includes(params.row.code) &&
            <Button size='sm' onClick={() => {
              setLeaveHouseId(params.row.code);
              setLeaveHouseName(params.row.description);
              setIsLeaveHouseModalOpen(true);
            }} text='Leave House' />
          }
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

  const handleLeaveHouseConfirm = () => {
    if (leaveHouseId && handleLeaveHouse) {
      handleLeaveHouse(leaveHouseId, leaveHouseName);
      setIsLeaveHouseModalOpen(false);
      setLeaveHouseId(null);
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setDeleteId(null);
  };

  const handleLeaveHouseCloseModal = () => {
    setIsLeaveHouseModalOpen(false);
    setLeaveHouseId(null);
  }

  return (
    <div className="data-table">
      {
        rows.length > 0 ? (
          <DataGrid
            className="data-grid"
            rows={rows}
            columns={[...columns.filter(
              (col) => col.field !== 'id'
            ), actionColumns]}
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
      <ConfirmationModal
        open={isLeaveHouseModalOpen}
        onClose={handleLeaveHouseCloseModal}
        onConfirm={handleLeaveHouseConfirm}
        title="Confirm Leaving"
        message="Are you sure you want to leave this house?"
      />
    </div>
  );
};

export default DesktopDataTable;
