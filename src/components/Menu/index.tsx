import { Link } from "react-router-dom";
import { menu } from "../../menu-item";
import "./menu.scss";
import { useAuth } from "../../hooks/useAuth";


const Menu: React.FC = () => {
  const {user} = useAuth()
  const isAdmin = user ? !!(user.username === 'RizwanKabir') : false
  return (
    <div className="menu">
      
      { menu.map((item) => (
        <div className="item" key={item.id}>
          <span className="title">{item.title}</span>
          {item.listItems.map((listItem) => (
            <>
            {
              !isAdmin && listItem.restricted ? null :
              <Link to={listItem.url} className="list-item" key={listItem.id}>
              <img src={listItem.icon} alt={listItem.title} />
              <span className="list-item-title">{listItem.title}</span>
            </Link>
            }
            </>
           
          ))}
        </div>
      ))}
    </div>
  );
};

export default Menu;
