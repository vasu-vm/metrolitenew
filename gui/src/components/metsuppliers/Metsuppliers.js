
import React, { useState, Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReadOnlyRow from "./ReadOnlyRow";
import EditableRow from "./EditableRow";
import api from '../../api/metstock'
import "./metsuppliers.css"

export default function Metsuppliers() {
    const [suppliers, setSuppliers] = useState([]);
    const [refresh, setRefrash] = useState(false)
    const [editSupplierId, setEditSupplierID] = useState(null);
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        SupplierID: "",
        Address: "",
        Remarks: ""
      })  
    const handleChange = function(e){
        setInputs( function(prev){
            return({...prev, [e.target.name]: e.target.value})
        })
    }
      
    useEffect(() =>{
          const fetchsuppliers = async() =>{
            try {
              const response = await api.get('/metsuppliers')
              setSuppliers(response.data);
              //console.log(response.data)
            }catch (err) {
              if(err.response){
                //console.log(err.response.data)
                console.log(err.response.status)
                navigate("/login");
                //console.log(err.response.header)
              } else {
                console.log(`Error: ${err.message}`);
                //console.log(suppliers)
              }
            }
          }
          fetchsuppliers();
    },[refresh])
  
    
    
  
    const handleAddFormSubmit = async (event) => {
      event.preventDefault();
      console.log("handleAddFormSubmit")
      
      try {
        const response = await api.post('/metsuppliers', inputs)
        console.log(response.data)
      }catch (err) {
        if(err.response){
          //console.log(err.response.data)
          console.log(err.response.status)
          navigate("/login");
          //console.log(err.response.header)
        } else {
          console.log('Error: ${err.message}');
        }
      }
      setInputs({ SupplierID: "" , Specification: "", Remarks: ""})
      setRefrash(!refresh)
    };
  
    const handleEditFormSubmit = (event) => {
      event.preventDefault();
     
    };
  
    const handleEditClick = ( event, SupplierID) => {
      event.preventDefault();
      console.log("inside handleEditClick")
      console.log(SupplierID)
      setEditSupplierID(SupplierID);
      setRefrash(!refresh)
      
    };
  
    const handleCancelClick = () => {
      setEditSupplierID(null);
      setRefrash(!refresh)
    };
  
    const handleDeleteClick = async (contactId) => {
      console.log("Delete called")
      console.log(contactId)
      try {
        const response = await api.delete('/metsuppliers/' + contactId)
        console.log(response.data)
      }catch (err) {
        if(err.response){
          console.log(err.response.data)
          console.log(err.response.status)
          console.log(err.response.header)
        } else {
          console.log('Error: ${err.message}');
        }
      }
      setRefrash(!refresh)
    };
  
    return (
      <div className="BrandContainer">
        <form onSubmit={handleEditFormSubmit}>
          <table>
            <thead>
              <tr>
                <th className="DataHeadingData">Supplier ID</th>
                <th className="DataHeading">Address</th>
                <th className="DataHeading">Remarks</th>
                
              </tr>
            </thead>
            <tbody>
              {suppliers.length === 0 ? <p>Falied to load Detais</p> :
              suppliers.map((supplier) => (
                <Fragment>
                  {editSupplierId === supplier.SupplierID ? (
                    <EditableRow
                      editFormData={supplier}
                      handleCancelClick={handleCancelClick}
                    />
                  ) : (
                    <ReadOnlyRow
                      supplier={supplier}
                      handleEditClick={handleEditClick}
                      handleDeleteClick={handleDeleteClick}
                    />
                  )}
                </Fragment>
              ))}
                  
            </tbody>
          </table>
        </form>
  
        <h2>Add a Supplier</h2>
        <form onSubmit={handleAddFormSubmit}>
          <input className="DataHeadingData" value = {inputs.SupplierID} placeholder="Supplier ID" name="SupplierID" required onChange={handleChange}/> 
          <input className="DataHeading" value = {inputs.Address} placeholder="Address" name="Address" required onChange={handleChange}/>
          <input className="DataHeading" value = {inputs.Remarks} placeholder="Remarks" name="Remarks" required onChange={handleChange} /> 
         
          <button type="submit">Add</button>
        </form>
      </div>
    );
}

