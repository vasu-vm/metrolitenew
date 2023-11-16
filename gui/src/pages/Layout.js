import { Outlet, Link } from "react-router-dom";
import Footer from "./Footer";
import "./layout.css"

const Layout = () => {
  return (
    <>
      <nav className="LayoutContainer">
        <ul className="HeaderContainer">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/suppliers">Suppliers</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
          <li>
            <Link to="/brands">Brands</Link>
          </li>
          <li>
            <Link to="/thickness">Coil Thickness</Link>
          </li>
          <li>
            <Link to="/stockdetails">Coil Details</Link>
          </li>
          <li>
            <Link to="/fileupload">Stock Management</Link>
          </li>
          <li>
            <Link to="/orderverification">Verify Order</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
      <Footer/>
    </>
  )
};

export default Layout;
