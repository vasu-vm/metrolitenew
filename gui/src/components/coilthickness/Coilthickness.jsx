
import React, { useState, Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CoilThicknessReadOnlyRow from "./CoilThicknessReadOnlyRow";
import CoilThicknessEditRow from "./CoilThicknessEditRow";
import api from '../../api/metstock'
import "./coilthickness.css"

export default function Coilthickness() {
    const [thicknesstypes, setThicknessTypes] = useState([]);
    const [refresh, setRefrash] = useState(false)
    const [editthicknesstypes, seteditthicknesstypes] = useState(null);
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
          const fetchbrands = async() =>{
            try {
              const response = await api.get('/coilthickness')
              setThicknessTypes(response.data);
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
          fetchbrands();
    },[refresh])
  
    
    
  
    const [editFormData, setEditFormData] = useState({
      Thichness: "0",
      BrandID: "",
      SqftPerMT: "",
      Remarks: ""
    });
  
    const handleAddFormSubmit = async (event) => {
      event.preventDefault();
      console.log("handleAddFormSubmit")
      try {
        const response = await api.post('/coilthickness', inputs)
        console.log(response.data)
      }catch (err) {
        if(err.response){
          console.log(err.response.data)
          console.log(err.response.status)
          navigate("/login");
          console.log(err.response.header)
        } else {
          console.log('Error: ${err.message}');
        }
      }
      setRefrash(!refresh)
    };
  
    const handleEditFormSubmit = (event) => {
      event.preventDefault();
     
    };
  
    const handleEditClick = ( event, types) => {
      event.preventDefault();
      console.log("inside handleEditClick")
      console.log(types)
      seteditthicknesstypes(types);
      
    };
  
    const handleCancelClick = () => {
      seteditthicknesstypes(null);
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
                <th className="DataHeadingData">Thickness</th>
                <th className="DataHeadingData">Brand ID</th>
                <th className="DataHeading">Sqft Per MT</th>
                <th className="DataHeading">Remarks</th>
                
              </tr>
            </thead>
            <tbody>
              {thicknesstypes.length === 0 ? <p>Falied to load Detais</p> :
              thicknesstypes.map((thickness) => (
                <Fragment>
                  {editthicknesstypes === thickness.BrandID + thickness.Thickness ? (
                    <CoilThicknessEditRow
                      editFormData={thickness}
                      handleCancelClick={handleCancelClick}
                    />
                  ) : (
                    <CoilThicknessReadOnlyRow
                      thickness={thickness}
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
          <input className="DataHeadingData" value = {inputs.Thickness} placeholder="Thickness" name="Thickness" required onChange={handleChange}/> 
          <input className="DataHeadingData" value = {inputs.BrandID} placeholder="Brand ID" name="BrandID" required onChange={handleChange}/> 
          <input className="DataHeading" value = {inputs.SqftPerMT} placeholder="Sqft Per MT" name="SqftPerMT" required onChange={handleChange}/>
          <input className="DataHeading" value = {inputs.Remarks} placeholder="Remarks" name="Remarks" required onChange={handleChange} /> 
         
          <button type="submit">Add</button>
        </form>
      </div>
    );
}
