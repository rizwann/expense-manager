import React from 'react';
import useMediaQuery from '../../hooks/userMediaQuery';
import { GridColDef } from '@mui/x-data-grid';
import MobileDataTable from './MobileDataTable';
import DesktopDataTable from './DesktopDataTable';

type Props = {
  columns: GridColDef[];
  rows: object[];
  mobileRows?: object[];
  slug: string;
  handleDelete: (id: string, name: string) => void;
};

const DataTable: React.FC<Props> = ({ columns, rows, slug, handleDelete, mobileRows }) => {
  const isMobile = useMediaQuery(768);

  const data = slug === 'expenses' && mobileRows ? mobileRows : rows;

  return isMobile ? (
    <MobileDataTable columns={columns} rows={data} slug={slug} handleDelete={handleDelete} />
  ) : (
    <DesktopDataTable columns={columns} rows={rows} slug={slug} handleDelete={handleDelete} />
  );
};

export default DataTable;