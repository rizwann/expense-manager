import React, { useState, useEffect } from "react"
import "./mobileCard.scss"
import { Link } from "react-router-dom"
import ConfirmationModal from "../Modal/Confirmation"
import { GridColDef } from "@mui/x-data-grid"
import { Expense, House, IUser, Store } from "../../types"

type Props = {
  columns: GridColDef[]
  rows: IUser[] | Expense[] | Store[] | House[] | any[]
  slug: string
  handleDelete: (id: string, name: string) => void
  handleLeaveHouse?: (id: string, name: string) => void;
}

const MobileDataTable: React.FC<Props> = ({
  columns,
  rows,
  slug,
  handleDelete,
  handleLeaveHouse
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [name, setName] = useState<string>("")
  const [leaveHouseId, setLeaveHouseId] = useState<string | null>(null);
  const [leaveHouseName, setLeaveHouseName] = useState<string>('');
  const [isLeaveHouseModalOpen, setIsLeaveHouseModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filteredRows, setFilteredRows] = useState(rows)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

  useEffect(() => {
    setFilteredRows(
      rows.filter((row: any) =>
        columns.some((col) => {
          const value = row[col.field]
          return (
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        })
      )
    )
  }, [searchTerm, rows, columns])

  const getColumnValue = (row: any, col: GridColDef) => {
    switch (col.type) {
      case "boolean":
        return row[col.field] ? (
          <img src="/green-tick.svg" alt="True" className="boolean-icon" />
        ) : (
          <img src="/cross.svg" alt="False" className="boolean-icon" />
        )
      case "array":
        return (
          <>
            {row[col.field].length > 0 ? (
              <div>
                {row[col.field].slice(0, 2).map((house: any, idX: number) => {
                  return <span key={idX}>{house}{
                    idX < row[col.field].length - 1 ? ", " : ""
                  } </span>
                })}
                {row[col.field].length > 2 && (
                  <span className="more">
                    +{row[col.field].length - 2} more
                  </span>
                )}
              </div>
            ) : (
              <p>No Record</p>
            )}
          </>
        )
      default:
        if ( col.field === "date") {
          const date = new Date(row[col.field])
          const formattedDate = date.toLocaleDateString()
          const formattedTime = date.toLocaleTimeString()
          return `${formattedDate} ${formattedTime}`
        } else if (col.field === "cost") {
          return <span style={{ color: "green" }}>{`€${row[col.field].toFixed(2)}`}</span>
        }
        else {
          return row[col.field]
        }
    }
  }

  const handleConfirmDelete = () => {
    if (deleteId) {
      handleDelete(deleteId, name)
      setIsModalOpen(false)
      setDeleteId(null)
    }
  }
  const handleLeaveHouseConfirm = () => {
    if (leaveHouseId && handleLeaveHouse) {
      handleLeaveHouse(leaveHouseId, leaveHouseName);
      setIsLeaveHouseModalOpen(false);
      setLeaveHouseId(null);
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setDeleteId(null)
  }

  const handleLeaveHouseCloseModal = () => {
    setIsLeaveHouseModalOpen(false);
    setLeaveHouseId(null);
  }

  // Pagination logic
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="card-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {filteredRows.length > 0 ? (
        <>
          {paginatedRows.map((row) => (
            <div className="card" key={row._id}>
              <div className="card-left-border"></div>
              <div className="card-content">
                <div className="card-header">
                  <h3>{row.description || row.name || "No Name"}</h3>
                  <div className="card-actions">
                    <Link to={`/${slug}/${row._id}`}>
                      <img src="/view.svg" alt="View" />
                    </Link>
                    <div
                      className="delete"
                      onClick={() => {
                        setDeleteId(row._id)
                        if (slug === 'Houses'){
                          setName(row.description);
                        } else {
                        setName(row.name);
                        }
                        setIsModalOpen(true)
                      }}
                    >
                      <img src="/delete.svg" alt="Delete" />
                    </div>
                    { slug === "Houses" && <div
                      className="leave"
                      onClick={() => {
                        setLeaveHouseId(row.code);
                        setLeaveHouseName(row.description);
                        setIsLeaveHouseModalOpen(true);
                      }}
                    >
                      <img src="/leave.svg" alt="Leave" />
                    </div>}
                  </div>
                </div>
                <div className="card-body">
                  {columns.map(
                    (col) =>
                      col.field !== "name" && col.field !== "description" && col.field !== "image" &&
                      col.field !== "id" && col.field !== "houseNames" && (
                        <div key={col.field} className="card-item">
                          <div className="card-item-header">
                            <img src={`/${col.field}.svg`} alt={col.headerName} />
                            <span>{col.headerName}:</span>
                          </div>
                          <span className="card-item-value">
                            {getColumnValue(row, col)}
                          </span>
                        </div>
                      )
                  )}
                </div>
              </div>
            </div>
          ))}
            <div className="flex items-center">
              <span className="mr-2">Total Entries: {filteredRows?.length}</span>
            </div>
          {/* Pagination */}
          <div className="flex items-center justify-between gap-3 mt-2 pagination-container">
            <div className="flex items-center">
              <label htmlFor="rowsPerPage" className="mr-2">Rows per page:</label>
              <select
                id="rowsPerPage"
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                className="px-2 py-1 text-gray-700 bg-gray-200 border rounded"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 pagination-buttons">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-white bg-gray-700 rounded disabled:opacity-50"
              >
                &larr;
              </button>
              <span>{currentPage} of {totalPages}</span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-white bg-gray-700 rounded disabled:opacity-50"
              >
                &rarr;
              </button>
            </div>
          </div>
        </>
      ) : (
        <p>No records found</p>
      )}

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
  )
}

export default MobileDataTable
