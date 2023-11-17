import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from '../../api/metstock'
import './orderverification.css'

function OrderVerification() {
  const [orderfile, setOrderFile] = useState([]);
  const [uploadstatuspurchase, setUploadStatusPurchase] = useState(false)
  const [insertstatus, setInsertStatus] = useState(false)  
  const [verifyresult, setVerifyResult] = useState([])
  // const [selectedFileName, setSelectedFileName] = useState('');
  const buttonText = uploadstatuspurchase ? 'Uploaded' : 'Upload';
 
  const navigate = useNavigate()


  const fileChangeHandlerOrder = (e) => {
      console.log("fileChangeHandler")
      const fileInput = e.target;
      if(fileInput.files.length === 0)
      {
        setOrderFile([]);
        return
      }
      //const fileInputName = fileInput.files[0].name.toLowerCase();
      setOrderFile(e.target.files[0]);
      setUploadStatusPurchase(false)
      /* if((fileInput.files.length > 0) && (fileInputName.includes("purchase")))
        setOrderFile(e.target.files[0]);
      else
        setOrderFile([]); */
  };
  


  const onSubmitHandlerOrder =  (e) => {
    e.preventDefault();

    // Handle File Data from the state Before Sending
    const data = new FormData();

    data.append("xlfile", orderfile);

    fetch(`${process.env.REACT_APP_API_URL}orderverification`, {
      method: "POST",
      credentials: 'include' ,
      body: data,
    })
      .then((result) => {
        console.log(result.status)
        if(result.status > 400)
          navigate("/login")
        console.log("File Sent Successful");
        setUploadStatusPurchase(true)
        // setOrderFile([])
        setInsertStatus(false)
        
      })
      .catch((err) => {
        console.log(err.message);
        navigate("/login")
      });
  };
  
  
const handleVerify = async (event, type) => {
    event.preventDefault();
    if(orderfile.name.length === 0)
    {
      console.log("No file to verify")
      return
    }
    try {
      const response = await api.get(`/orderverification/${orderfile.name}` )
      console.log(response.data)
      setVerifyResult(response.data)
      setInsertStatus(true)
      setUploadStatusPurchase(!uploadstatuspurchase)
      setOrderFile([])
    }catch (err) {
      if(err.response){
        console.log(err.response.data)
        console.log(err.response.status)
        console.log(err.response.header)
      } else {
        console.log('Error: ${err.message}');
        
      }
    }
}



return (
    <div className="FileLoadContainer">
      <h1>Order Verification</h1>
      <div style={{ marginTop: '5px', display: 'flex' , alignItems: 'center' , gap: '10px'}}>
        <input
          type="file"
          accept= ".xlsx"
          onChange={fileChangeHandlerOrder}
          style={{ display: 'none' }}
          id="fileInput" // Associate a label with this input
        />
        <label htmlFor="fileInput" className="FileSelection">Select Order File File</label>
        <p>{orderfile.name}</p>
        <button className="StockButton" onClick={onSubmitHandlerOrder}>{buttonText}</button>
      </div>
      
     
      <div className="fileLoads">
        <div className="InsertArea">
            <button className="StockButton" onClick={handleVerify}>Verify Order</button>
            {insertstatus ? (<p>{verifyresult}</p>) :(<p></p>)}
        </div>

        
      </div>
    </div>
  );
}

export default OrderVerification;