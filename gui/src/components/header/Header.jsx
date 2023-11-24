import { Outlet, Link,useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import Cookies from "js-cookie";
import Footer from "../footer/Footer";
import { AuthContext } from "../../context/authContext";
import "./header.css"

const Header = () => {
  const {currentUser} = useContext(AuthContext);
  const navigate = useNavigate()
  useEffect(() =>{
    console.log(currentUser)
    //document.cookie = 'yourCookieName=cookieValue; expires=Sun, 31 Dec 2023 12:00:00 UTC; path=/';

    const myCookieValue = Cookies.get("metrolite");
    //console.log('Cookie Value:', myCookieValue);
    //console.log('document.cookie:', document.cookie);


    if(!currentUser || !myCookieValue)
      navigate("/login")
    
  },[])

  return (
    <>
      <nav className="LayoutContainer">
        <span className="UserName">{currentUser.username}</span>
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
            <Link to="/findstock">Find Stock</Link>
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

export default Header;
