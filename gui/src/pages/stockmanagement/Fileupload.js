import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import fileDownload from 'js-file-download';
import axios from 'axios';

import api from '../../api/metstock'
import './fileupload.css'

function Fileupload() {
  const [fileDataPurchase, setFileDataPurchase] = useState([]);
  const [fileDataPlant, setFileDataPlant] = useState([]);
  const [uploadstatuspurchase, setUploadStatusPurchase] = useState(false)
  const [uploadstatusdetails, setUploadStatusDetails] = useState(false)
  const [insertstatus, setInsertStatus] = useState(false)
  const [insertcoildaystat, setInsertCoilDayStat] = useState(false)
  const [preparestockstat, setPrepareStockStat] = useState(false)
  const [printstockstat, setPrintStockStat] = useState(false)
  // const [selectedFileName, setSelectedFileName] = useState('');
  const buttonText = uploadstatuspurchase ? 'Uploaded' : 'Upload';
  const buttonText1 = uploadstatusdetails ? 'Uploaded' : 'Upload';
  const navigate = useNavigate()


  const fileChangeHandlerPurchase = (e) => {
      const fileInput = e.target;
      if(fileInput.files.length === 0)
      {
        setFileDataPurchase([]);
        return
      }
      const fileInputName = fileInput.files[0].name.toLowerCase();
      if((fileInput.files.length > 0) && (fileInputName.includes("purchase")))
          setFileDataPurchase(e.target.files[0]);
      else
      setFileDataPurchase([]);
  };
  const fileChangeHandlerPlant = (e) => {
    const fileInput = e.target;
    if(fileInput.files.length === 0)
    {
        setFileDataPlant([]);
        return
    }
    const fileInputName = fileInput.files[0].name.toLowerCase();
    if((fileInput.files.length > 0) && (fileInputName.includes("coildaystat")))
        setFileDataPlant(e.target.files[0]);
    else
        setFileDataPlant([]);
    
  };

  /* const handleFileChange = (e) => {
    const fileInput = e.target;
    // console.log(fileInput.files)
    if (fileInput.files.length > 0) {
      // If files are selected, set the custom text to the selected file names
      setSelectedFileName(`${fileInput.files[0].name} selected`);
    } else {
      // If no files are selected, set the custom text to "No file chosen"
      setSelectedFileName('No file chosen');
    }

  }; */

  const onSubmitHandlerPurchase =  (e) => {
    e.preventDefault();

    // Handle File Data from the state Before Sending
    const data = new FormData();

    data.append("xlfile", fileDataPurchase);

    fetch("http://localhost:3002/api/fileupload", {
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
        setFileDataPurchase([])
        
      })
      .catch((err) => {
        console.log(err.message);
        navigate("/login")
      });
  };
  const onSubmitHandlerPlant = (e) => {
    e.preventDefault();

    // Handle File Data from the state Before Sending
    const data = new FormData();

    data.append("xlfile", fileDataPlant);

    fetch("http://localhost:3002/api/fileupload", {
      method: "POST",
      credentials: 'include' ,
      body: data,
    })
      .then((result) => {
        console.log(result.status)
        if(result.status > 400)
          navigate("/login")
        console.log("File Sent Successful");
        setFileDataPlant([])
        setUploadStatusDetails(true)
      })
      .catch((err) => {
        console.log(err.message);
        navigate("/login")
      });
  };
  
const handleInsert = async (event, type) => {
    event.preventDefault();
    console.log("handleInsert")
    
    try {
      const response = await api.get('/stockmanagement' )
      console.log(response.data)
      setInsertStatus(true)
      setUploadStatusPurchase(!uploadstatuspurchase)
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

const handleInsertcoildaystat = async (event, type) => {
  event.preventDefault();
  console.log("handleInsert")
  try {
    const response = await api.get('/stockmanagement/coil' )
    console.log(response.data)
    setInsertCoilDayStat(true)
    setUploadStatusDetails(!uploadstatusdetails)
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
const handlePrepareStock = async (event, type) => {
  event.preventDefault();
  console.log("handlePrepareStock")
  try {
    const response = await api.get('/preparestock' )
    setPrepareStockStat(true)
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
}
const handlePrintStock= async (event, type) => {
  event.preventDefault();
  console.log("handlePrintStock")
  try {
    const response = await api.get('/printstock' )
    setPrintStockStat(true)
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
}

const downloadsummary = (e , type) => {
  e.preventDefault()
  //console.log("downloadsummary called")
  const apiUrl = process.env.REACT_APP_API_URL;
  let uploadfilename = "";
  const currentDate = new Date();  
     // Define a function to format the date and time
  function formatDate(date) {
             const year = date.getFullYear();
             const month = (date.getMonth() + 1).toString().padStart(2, '0');
             const day = date.getDate().toString().padStart(2, '0');
             return `${year}-${month}-${day}`;
  }
  if(type.includes("summary"))
        uploadfilename = `stock-summary-${formatDate(currentDate)}.xlsx`
  else
        uploadfilename = `stock-details-${formatDate(currentDate)}.xlsx`

  axios({url:`${apiUrl}download/${type}`, 
    responseType: "blob" ,
    method: "GET"
} ).then((res) => {
    fileDownload(res.data , uploadfilename)
  })
}
return (
    <div className="FileLoadContainer">
      <h1>Stock Management</h1>
      <div style={{ marginTop: '5px', display: 'flex' , alignItems: 'center' , gap: '10px'}}>
        <input
          type="file"
          accept= ".xlsx"
          onChange={fileChangeHandlerPurchase}
          style={{ display: 'none' }}
          id="fileInput" // Associate a label with this input
        />
        <label htmlFor="fileInput" className="FileSelection">Choose Purchase File</label>
        <p>{fileDataPurchase.name}</p>
        <button className="StockButton" onClick={onSubmitHandlerPurchase}>{buttonText}</button>
      </div>
      <div style={{ marginTop: '5px', marginBottom: '5px', display: 'flex' , alignItems: 'center' , gap: '10px'}}>
        <input
          type="file"
          accept= ".xlsx"
          onChange={fileChangeHandlerPlant}
          style={{ display: 'none' }}
          id="fileInput1" // Associate a label with this input
        />
        <label htmlFor="fileInput1" className="FileSelection">Choose Detail File</label>
        <p>{fileDataPlant.name}</p>
        <button className="StockButton" onClick={onSubmitHandlerPlant}>{buttonText1}</button>
      </div>

     
      <div className="fileLoads">
        <div className="InsertArea">
            <button className="StockButton" onClick={handleInsert}>Save Purchase</button>
            {insertstatus ? (<p>Inserted</p>) :(<p></p>)}
        </div>
        <div className="InsertArea">
            <button className="StockButton" onClick={handleInsertcoildaystat}>Save CoilDayStat</button>
            {insertcoildaystat ? (<p>Inserted</p>) :(<p></p>)}
        </div>
        <div className="PrintStock">
            <button className="DownLoadButton" onClick={handlePrepareStock}>Prepare Stock</button>
            {preparestockstat ? (<p style={{color: 'green' , fontWeight: 'bold'}}>Success</p>) :(<p></p>)}

        </div>
        <div className="PrintStock">
            <button className="DownLoadButton" onClick={handlePrintStock}>Print Stock</button>
            {printstockstat ? (<p style={{color: 'green', fontWeight: 'bold'}}>Success</p>) :(<p></p>)}
        </div>        
        <button className="DownLoadButton" onClick={(e)=>downloadsummary(e, "summary")}>Down Load Summary</button>
        <button className="DownLoadButton" onClick={(e)=>downloadsummary(e, "details")}>Down Load Details</button>
        
      </div>
    </div>
  );
}

export default Fileupload;