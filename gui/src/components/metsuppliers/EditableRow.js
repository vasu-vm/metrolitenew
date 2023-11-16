import React, {useState} from "react";
import api from '../../api/metstock'
import "./metsuppliers.css"

const EditableRow = ({
  editFormData,
  handleCancelClick
  }) => {
   console.log(editFormData)
  const [inputs, setInputs] = useState({
      SupplierID: editFormData.SupplierID,
      Address: editFormData.Address,
      Remarks: editFormData.Remarks
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
      const response = await api.put('/metsuppliers', inputs)
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
      
      <td className="DataHeading">{inputs.SupplierID}</td>
      
      <td className="DataHeading">
        <input
          type="text"
          required="required"
          placeholder="Enter Specification..."
          name="Address"
          value={inputs.Address}
          onChange={handleChange}
        ></input>
      </td>
      <td className="DataHeading">
        <input
          type="text"
          required="required"
          placeholder="Enter Remarks..."
          name="Remarks"
          value={inputs.Remarks}
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

export default EditableRow;