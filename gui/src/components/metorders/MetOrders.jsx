
import React, { useState, Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MetrOrdersReadOnlyRow from "./MetOrdersReadOnlyRow";
import MetOrdersEditRow from "./MetOrdersEditRow";
import api from '../../api/metstock'
import "./metorders.css"

export default function MetOrders() {
    const [metorders, setMetOrders] = useState([]);
    const [refresh, setRefrash] = useState(false)
    const [editmetorder, setEditMetOrder] = useState(null);
    const navigate = useNavigate();
    
    const [inputs, setInputs] = useState({       
        Thickness: "0",
        BrandID: "",
        SqftPerMT: "",
        Remarks: ""
      })  
    const handleChange = function(e){
        setInputs( function(prev){
            return({...prev, [e.target.name]: e.target.value})
        })
    }
      
    useEffect(() =>{
          const fetchorders = async() =>{
            try {
              const response = await api.get('/metorders')
              setMetOrders(response.data);
              console.log(response.data)
            }catch (err) {
              if(err.response){
                //console.log(err.response.data)
                console.log(err.response.status)
                navigate("/login");
                //console.log(err.response.header)
              } else {
                console.log(`Error: ${err.message}`);
                //console.log(thicknesstypes)
              }
            }
          }
          fetchorders();
    },[refresh])
  
   
    const handleEditFormSubmit = (event) => {
      event.preventDefault();
     
    };
  
    const handleEditClick = ( event, types) => {
      event.preventDefault();
      console.log("inside handleEditClick")
      console.log(types)
      setEditMetOrder(types);
      
    };
  
    const handleCancelClick = () => {
      setEditMetOrder(null);
      setRefrash(!refresh)
    };
  
    
  
    return (
      <div className="ThicknessContainer">
        <form onSubmit={handleEditFormSubmit}>
          <table>
            <thead>
              <tr>
                <th className="DataHeadingData">Order Num</th>
                <th className="DataHeadingData">Order Num</th>
                <th className="DataHeading">Order Status</th>
                <th className="DataHeading">Order Date</th>
                <th className="DataHeading">Work Date</th>
                <th className="DataHeading">Delivery Date</th>
                <th className="DataHeading">Name</th>
                
              </tr>
            </thead>
            <tbody>
              {metorders.length === 0 ? <p>Falied to load Detais</p> :
              metorders.map((metorder) => (
                <Fragment>
                  {editmetorder === metorder.ordernum1 ? (
                    <MetOrdersEditRow
                      editFormData={metorder}
                      handleCancelClick={handleCancelClick}
                    />
                  ) : (
                    <MetrOrdersReadOnlyRow
                      metorder={metorder}
                      handleEditClick={handleEditClick}
                     
                    />
                  )}
                </Fragment>
              ))}
                  
            </tbody>
          </table>
        </form>
  
      </div>
    );
}
