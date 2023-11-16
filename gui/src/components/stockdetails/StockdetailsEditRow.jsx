import React, {useState} from "react";
import api from '../../api/metstock';
import './stockdetails.css'

const StockdetailsEditRow = ({
  editFormData,
  handleCancelClick
  }) => {
   console.log(editFormData)
  const [inputs, setInputs] = useState({
      CoilID: editFormData.CoilID,
      Brand: editFormData.Brand,
      Thickness: editFormData.Thickness,
      Colour: editFormData.Colour,
      Weight: editFormData.Weight,
      OpenCM: editFormData.OpenCM,
      FinalWeight: editFormData.FinalWeight,
      Sqft: editFormData.Sqft,
      Location: editFormData.Location,
      GFStatus: editFormData.GFStatus,
      AZValue: editFormData.AZValue,
      Supplier: editFormData.Supplier
     
  })
  

  const handleChange = function(e){
    setInputs( function(prev){
        return({...prev, [e.target.name]: e.target.value})
    })
  }
  const handleUpdate = async (event) => {
    event.preventDefault();
    console.log("handleUpdate")
    try {
      const response = await api.put('/stockdetails', inputs)
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
    
    handleCancelClick()   
  };

  return (
    <tr>
      <td className="DataHeading">{inputs.CoilID}</td>
      <td className="DataHeading">{inputs.Brand}</td>
      <td className="DataHeading">{inputs.Thickness}</td>
      <td className="DataHeading">{inputs.Colour}</td>
      <td className="DataHeading">{inputs.Weight}</td>
      <td className="DataHeading">{inputs.OpenCM}</td>
      <td className="DataHeading">{inputs.FinalWeight}</td>
      <td className="DataHeading">{inputs.Sqft}</td>
      <td className="DataHeading">{inputs.Location}</td>
      <td className="DataHeading">{inputs.GFStatus}</td>
      
      
      <td className="DataHeading">
        <input className="EditData"
          type="text"
          required="required"
          placeholder="Enter AZValue..."
          name="AZValue"
          value={inputs.AZValue}
          onChange={handleChange}
        ></input>
      </td>
      <td className="DataHeading">
        <input className="EditData"
          type="text"
          required="required"
          placeholder="Enter Supplier..."
          name="Supplier"
          value={inputs.Supplier}
          onChange={handleChange}
        ></input>
      </td>
     
      <td>
        <button type="submit" onClick={handleUpdate}>Save</button>
        <button type="button" onClick={handleCancelClick}>
          Cancel
        </button>
      </td>
    </tr>
  );
};

export default StockdetailsEditRow;