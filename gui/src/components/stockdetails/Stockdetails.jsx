
import React, { useState, Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StockdetailsEditRow from './StockdetailsEditRow';
import StockdetailsReadOnlyRow from './StockdetailsReadOnlyRow'

import api from '../../api/metstock'
import "./stockdetails.css"

export default function Stockdetails() {
    const [stockdetails, setStockdetails] = useState([]);
    const [refresh, setRefrash] = useState(false)
    const [editstockdetails, setEditStockDetails] = useState(null);
    const navigate = useNavigate()
      
    useEffect(() =>{
          const fetchbrands = async() =>{
            try {
              const response = await api.get('/stockdetails')
              setStockdetails(response.data);
              // console.log(response.data)
            }catch (err) {
              if(err.response){
                //console.log(err.response.data)
                console.log(err.response.status)
                navigate("/login")
                //console.log(err.response.header)
              } else {
                console.log(`Error: ${err.message}`);
                //console.log(stockdetails)
              }
            }
          }
          fetchbrands();
    },[refresh])
  
    
    
  
    const [editFormData, setEditFormData] = useState({
        CoilID: "0",
        Brand: "",
        Thichness: "",
        Colour: "",
        Weight: "",
        OpenCM: "",
        FinalWeight: "",
        Sqft: "",
        Location: "",
        GFStatus: "",
        AZValue: "",
        Supplier: ""
    });
  
   
    const handleEditFormSubmit = (event) => {
      event.preventDefault();
     
    };
  
    const handleEditClick = ( event, types) => {
      event.preventDefault();
      console.log("inside handleEditClick")
      console.log(types)
      setEditStockDetails(types);
      
    };
  
    const handleCancelClick = () => {
      setEditStockDetails(null);
      setRefrash(!refresh)
    };
  
    const handleDeleteClick = async (contactId) => {
     /* console.log("Delete called")
      console.log(contactId)
      try {
        const response = await api.delete('/metbrands/' + contactId)
        console.log(response.data)
      }catch (err) {
        if(err.response){
          console.log(err.response.data)
          console.log(err.response.status)
          console.log(err.response.header)
        } else {
          console.log('Error: ${err.message}');
        }
      } */
      setRefrash(!refresh)
    };
  
    return (
      <div className="ThicknessContainer">
        <form onSubmit={handleEditFormSubmit}>
          <table>
            <thead>
              <tr>
                <th className="DataHeadingData">CoilID</th>
                <th className="DataHeadingData">Brand</th>
                <th className="DataHeadingData">Thickness</th>
                <th className="DataHeadingData">Colour</th>
                <th className="DataHeadingData">Weight</th>
                <th className="DataHeadingData">OpenCM</th>
                <th className="DataHeadingData">F-Weight</th>
                <th className="DataHeadingData">Sqft</th>
                <th className="DataHeading">Location</th>
                <th className="DataHeading">GFStatus</th>
                <th className="DataHeading">AZValue</th>
                <th className="DataHeading">Supplier</th>
                
              </tr>
            </thead>
            <tbody>
              {stockdetails.length === 0 ? <p>Falied to load Detais</p> :
              stockdetails.map((stock) => (
                <Fragment>
                  {editstockdetails === stock.CoilID ? (
                    <StockdetailsEditRow
                      editFormData={stock}
                      handleCancelClick={handleCancelClick}
                    />
                  ) : (
                    <StockdetailsReadOnlyRow
                      stock={stock}
                      handleEditClick={handleEditClick}
                      handleDeleteClick={handleDeleteClick}
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