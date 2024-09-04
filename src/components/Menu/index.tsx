import { NavLink } from "react-router-dom";
import { menu } from "../../menu-item";
import "./menu.scss";
import { useAuth } from "../../hooks/useAuth";

const Menu: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user ? user.username === 'RizwanKabir' : false;

  return (
    <div className="menu">
      {menu.map((item) => (
        <div className="item" key={item.id}>
          {!isAdmin && item.restricted ? null : (
            <NavLink
              to={item.url}
              className={({ isActive }) =>
                `list-item ${isActive ? "active" : ""}`
              }
            >
              {/* <img src={item.icon} alt={item.title} /> */}
              <span className="list-item-title">{item.title}</span>
            </NavLink>
          )}
        </div>
      ))}
    </div>
  );
};

export default Menu;
