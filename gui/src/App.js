import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/header/Header";
import Home from "./pages/Home";
import Blogs from "./pages/Blogs";
import Contact from "./pages/Contact";
import NoPage from "./pages/NoPage";
import Login from './pages/login/Login'
import Register from './pages/register/Register'
import Coilthickness from "./components/coilthickness/Coilthickness";
import Stockdetails from "./components/stockdetails/Stockdetails";
import Fileupload from "./pages/stockmanagement/Fileupload";
import Findstock from "./pages/findstock/Findstock";
import OrderVerification from "./pages/orderverification/OrderVerification";
import MetOrders from "./components/metorders/MetOrders";
import "./App.css";
import "./App.css";

import Metbrands from "./components/metbrands/Metbrands";
import Metsuppliers from "./components/metsuppliers/Metsuppliers";

const App = () => {
 
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<Home />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="contact" element={<Contact />} />
          <Route path="thickness" element={ <Coilthickness /> }/>
          <Route path="stockdetails" element={ <Stockdetails /> }/>
          <Route path="brands" element={ <Metbrands /> }/>
          <Route path="suppliers" element={ <Metsuppliers /> }/>
          <Route path="fileupload" element={ <Fileupload /> }/>
          <Route path="login" element={ <Login/> }/>
          <Route path="register" element={ <Register/> }/>
          <Route path="findstock" element={ <Findstock/> }/>
          <Route path="orderverification" element={ <OrderVerification/> }/>
          <Route path="orders" element={ <MetOrders/> }/>
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    
    </BrowserRouter>
    

  );
};

export default App;