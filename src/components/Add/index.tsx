import { GridColDef } from "@mui/x-data-grid";
import "./add.scss";
interface IProps {
  slug: string;
  columns: GridColDef[];
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  console.log(e);
  //add new item
  //axiso.post to /api/${slug}
};

const Add: React.FC<IProps> = ({ slug, columns, setModalOpen }) => {
  return (
    <div className="add">
      <div className="modal">
        <span className="close" onClick={() => setModalOpen(false)}>
          X
        </span>
        <h1>Add new {slug}</h1>
        <form onSubmit={handleSubmit}>
          {columns
            .filter((item) => item.field !== "id" && item.field !== "image")
            .map((column) => {
              return (
                <div className="item">
                  <label>{column.headerName}</label>
                  <input type={column.type} placeholder={column.headerName} />
                </div>
              );
            })}
          <button>Send</button>
        </form>
      </div>
    </div>
  );
};

export default Add;
