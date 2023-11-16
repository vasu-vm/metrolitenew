
import React, { useState, Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReadOnlyRow from "./ReadOnlyRow";
import EditableRow from "./EditableRow";
import api from '../../api/metstock';
import "./metbrands.css"

export default function Metbrands() {
    const [brands, setBrand] = useState([]);
    const [avoidinit, setSetAvoidInit] = useState(0);
    const [refresh, setRefrash] = useState(false)
    const [editBrandId, setEditBrandId] = useState(null);
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
       
        BrandID: "0",
        SupplierID: "",
        Specification: "",
        Remarks: ""
      })  
    const handleChange = function(e){
        setInputs( function(prev){
            return({...prev, [e.target.name]: e.target.value})
        })
    }
      
    useEffect(() =>{
          const fetchbrands = async() =>{
            try {
              const response = await api.get('/metbrands')
              setBrand(response.data);
              // console.log(response.data)
            }catch (err) {
              if(err.response){
                //console.log(err.response.data)
                console.log(err.response.status)
                //console.log(err.response.header)
                navigate("/login");
              } else {
                console.log(`Error: ${err.message}`);
                //console.log(brands)
              }
            }
          }
          //if(avoidinit === 0)
            fetchbrands();
          //setSetAvoidInit(1)
    },[refresh])
  
    
    
  
    const [editFormData, setEditFormData] = useState({
      BrandID: "0",
      SupplierID: "",
      Specification: "",
      Remarks: ""
    });
  
   
     
  
    
  
    const handleAddFormSubmit = async (event) => {
      event.preventDefault();
      console.log("handleAddFormSubmit")
      setInputs( function(prev){
        return({...prev, BrandID: '0'})
      })
      try {
        const response = await api.post('/metbrands', inputs)
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
      setInputs({BrandID: "0", SupplierID: "" , Specification: "", Remarks: ""})
      setRefrash(!refresh)
    };
  
    const handleEditFormSubmit = (event) => {
      event.preventDefault();
     
    };
  
    const handleEditClick = ( event, BrandID) => {
      event.preventDefault();
      console.log("inside handleEditClick")
      console.log(BrandID)
      setEditBrandId(BrandID);
      
    };
  
    const handleCancelClick = () => {
      setEditBrandId(null);
      setRefrash(!refresh)
    };
  
    const handleDeleteClick = async (contactId) => {
      console.log("Delete called")
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
      }
      setRefrash(!refresh)
    };
  
    return (
      <div className="BrandContainer">
        <form onSubmit={handleEditFormSubmit}>
          <table>
            <thead>
              <tr>
                <th className="DataHeadingData">Brand ID</th>
                <th className="DataHeadingData">Supplier ID</th>
                <th className="DataHeading">Specification</th>
                <th className="DataHeading">Remarks</th>
                
              </tr>
            </thead>
            <tbody>
              {brands.length === 0 ? <p>Falied to load Detais</p> :
              brands.map((brand) => (
                <Fragment>
                  {editBrandId === brand.BrandID ? (
                    <EditableRow
                      editFormData={brand}
                      handleCancelClick={handleCancelClick}
                    />
                  ) : (
                    <ReadOnlyRow
                      brand={brand}
                      handleEditClick={handleEditClick}
                      handleDeleteClick={handleDeleteClick}
                    />
                  )}
                </Fragment>
              ))}
                  
            </tbody>
          </table>
        </form>
  
        <h2>Add a Contact</h2>
        <form onSubmit={handleAddFormSubmit}>
          <input className="DataHeadingData" value = {inputs.SupplierID} placeholder="Supplier ID" name="SupplierID" required onChange={handleChange}/> 
          <input className="DataHeading" value = {inputs.Specification} placeholder="Specification" name="Specification" required onChange={handleChange}/>
          <input className="DataHeading" value = {inputs.Remarks} placeholder="Remarks" name="Remarks" required onChange={handleChange} /> 
         
          <button type="submit">Add</button>
        </form>
      </div>
    );
}

