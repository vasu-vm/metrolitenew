import React, {useState} from "react";
import api from '../../api/metstock'
import { format } from 'date-fns';
import "./metorders.css"

const MetOrdersEditRow = ({
  editFormData,
  handleCancelClick
  }) => {
   //console.log(editFormData)
  const [inputs, setInputs] = useState({
       
      ordernum1:editFormData.ordernum1,
      ordernum2: editFormData.ordernum2,
      orderstatus: editFormData.orderstatus,
      ordertime: editFormData.ordertime,
      completiontime: editFormData.completiontime,
      deliverytime: editFormData.deliverytime,
      users: editFormData.users
  })
  let ordertime = ""
  if(editFormData.ordertime)
        ordertime = format(new Date(editFormData.ordertime), 'yyyy-MM-dd HH:mm');
  let  completiontime = ""
     if(editFormData.completiontime)
        completiontime = format(new Date(editFormData.completiontime), 'yyyy-MM-dd HH:mm');
  let  deliverytime = ""
     if(editFormData.deliverytime)
        deliverytime = format(new Date(editFormData.deliverytime), 'yyyy-MM-dd HH:mm');

  const [oldordstatus, setOldOrdStatus] = useState(      
    editFormData.orderstatus)


  const handleChange = function(e){
    setInputs( function(prev){
        return({...prev, [e.target.name]: e.target.value})
    })
  }
  const handleUpdate = async (event) => {
    event.preventDefault();
    //console.log("handleUpdate")
    if((inputs['orderstatus'] > 3) || (inputs['orderstatus'] < 1))
      return
    if((inputs['orderstatus'] - oldordstatus ) > 1)
      return;

    try {
      const response = await api.put('/metorders', inputs)
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
      <td className="DataHeading">{inputs.ordernum1}</td>
      <td className="DataHeading">{inputs.ordernum2}</td>
      
      <td className="DataHeading">
        <input
          className="DataHeading"
          type="text"
          required="required"
          placeholder="..."
          name="orderstatus"
          value={inputs.orderstatus}
          onChange={handleChange}
        ></input>
      </td>
      <td className="DataHeading">{ordertime}</td>
      <td className="DataHeading">{completiontime}</td>
      <td className="DataHeading">{deliverytime}</td>
      <td className="DataHeading">{inputs.users}</td>
      
      <td>
        <button className="ActionButton1" type="submit" onClick={handleUpdate}>Save</button>
        <button className="ActionButton1" type="button" onClick={handleCancelClick}>
          Cancel
        </button>
      </td>
    </tr>
  );
};

export default MetOrdersEditRow;