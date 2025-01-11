import React from 'react';
import useMediaQuery from '../../hooks/userMediaQuery';
import { GridColDef } from '@mui/x-data-grid';
import MobileDataTable from './MobileDataTable';
import DesktopDataTable from './DesktopDataTable';

type Props = {
  columns: GridColDef[];
  rows: object[];
  slug: string;
  handleDelete: (id: string, name: string) => void;
  handleLeaveHouse?: (id: string, name: string) => void;
};

const DataTable: React.FC<Props> = ({ columns, rows, slug, handleDelete, handleLeaveHouse }) => {
  const isMobile = useMediaQuery(795);

  // const data = slug === 'expenses' && mobileRows ? mobileRows : rows;

  return isMobile ? (
    <MobileDataTable columns={columns} rows={rows} slug={slug} handleDelete={handleDelete}
    handleLeaveHouse={handleLeaveHouse ? handleLeaveHouse : undefined}
    />
  ) : (
    <DesktopDataTable columns={columns} rows={rows} slug={slug} handleDelete={handleDelete}
    handleLeaveHouse={handleLeaveHouse ? handleLeaveHouse : undefined}
    />
  );
};

export default DataTable;