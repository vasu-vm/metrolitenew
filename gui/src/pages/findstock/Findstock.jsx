import React, { useState, useEffect } from 'react';
import api from '../../api/metstock';
import { useNavigate } from "react-router-dom";
import "./findstock.css"

const Findstock = () => {
  // State for the selected values of each dropdown
  const navigate = useNavigate();
  const [sqft , setSqft] = useState(0)
  const [colours, setColours] = useState([]);
  const [thickness, setThickness] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filedaily, setFileDaily] = useState([]);
  const [uploadstatusdaily, setUploadStatusDaily] = useState(false)
  const buttonText = uploadstatusdaily ? 'Uploaded' : 'Upload';
  const [insertstatus, setInsertStatus] = useState(false)
  const [inputs, setInputs] = useState({
    brand: "C+",
    thickness: "0.35",
    colour: "Grey",
    gfstatus: "Y",
    azvalue: "150"
  }) 
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  // Define a function to update the value of an element
  const updateElementValue = (elementName, newValue) => {
  // Create a new object with the updated value
     const updatedData = { ...inputs, [elementName]: newValue };
  
  // Set the state with the updated object
      setInputs(updatedData);
  };


  useEffect(() =>{
    const fetchcolours = async() =>{
      try {
        const response = await api.get('/stocksummary/colours')
        setColours(response.data);
        // console.log(response.data)
      }catch (err) {
        if(err.response){
          //console.log(err.response.data)
          console.log(err.response.status)
          //console.log(err.response.header)
          navigate("/login");
        } else {
          console.log(`Error: ${err.message}`);
          
        }
      }
    }
    const fetchthickness = async() =>{
      try {
        const response = await api.get('/stocksummary/thickness')
        setThickness(response.data);
        console.log(response.data)
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
    const fetchbrands = async() =>{
      try {
        const response = await api.get('/stocksummary/brands')
        setBrands(response.data);
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
    fetchcolours();
    fetchthickness();
    fetchbrands();
    //setSetAvoidInit(1)
},[])
  const handleDropdownChange = (event) => {
    setSqft(0)
    setInputs( function(prev){
      return({...prev, [event.target.name]: event.target.value})
  })
  console.log(event.target.name,event.target.value )
  if((event.target.name === 'brand')&& (event.target.value === 'V+'))
  {
      console.log("Inside")
      setInputs( function(prev){
          return({...prev, ['colour']: "None"})
      })
      setInputs( function(prev){
          return({...prev, ['gfstatus']: "N"})
      })
      setInputs( function(prev){
          return({...prev, ['azvalue']: "150"})
      })
    // Call the function to update the "age" value to 31
      // updateElementValue('gfstatus', 'N');
      // updateElementValue('azvalue', 150);
      // updateElementValue('colour' , "")
      

  } 
}
  // Options for the dropdown lists
  const options1 = [];
  const options2 = [];
  const options3 = [];
  for (let i = 0; i < brands.length; i++) {
    const item = brands[i];
    options1.push(item.Brand)
    // console.log(`Name: ${item.name}, Age: ${item.age}`);
  }
  
  for (let i = 0; i < thickness.length; i++) {
    const item = thickness[i];
    options2.push(item.Thickness)
    // console.log(`Name: ${item.name}, Age: ${item.age}`);
  }
  
  for (let i = 0; i < colours.length; i++) {
    const item = colours[i];
    options3.push(item.Colour)
    // console.log(`Name: ${item.name}, Age: ${item.age}`);
  }
  const options4 = ['Y', 'N' ];
  const options5 = ['150', '70', '0'];


  const handleClick = async() =>{
    try {
      const response = await api.post('/stocksummary' , inputs)
      // setBrand(response.data);
       console.log(response.data[0].sqft)
       setSqft(response.data[0].sqft)
    }catch (err) {
      if(err.response){
        console.log(err.response.data)
        console.log(err.response.status)
        console.log(err.response.header)
        // navigate("/login");
        setSqft(0)
      } else {
        console.log(`Error: ${err.message}`);
        //console.log(brands)
      }
    }
  }
  const fileChangeHandlerDaily = (e) => {
    const fileInput = e.target;
    if(fileInput.files.length === 0)
    {
      setFileDaily([]);
      return
    }
    const fileInputName = fileInput.files[0].name.toLowerCase();
    if((fileInput.files.length > 0) && (fileInputName.includes("daily")))
        setFileDaily(e.target.files[0]);
    else
        setFileDaily([]);
};
const onSubmitHandlerDaily =  (e) => {
  e.preventDefault();

  // Handle File Data from the state Before Sending
  const data = new FormData();

  data.append("xlfile", filedaily);

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
      setUploadStatusDaily(true)
      setFileDaily([])
      
    })
    .catch((err) => {
      console.log(err.message);
      navigate("/login")
    });
};
const handleDailyUpdate = async (event, type) => {
  event.preventDefault();
  console.log("handleInsert")
  
  try {
    const response = await api.get('/daily' )
    console.log(response.data)
    setInsertStatus(true)
    setUploadStatusDaily(false)
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
    <div className="findstockcontainer">
      <h2>Find Available Stock</h2>
      <div className="findstockitem">
        <label>Brand:</label>
        <select value={inputs['brand']} onChange={handleDropdownChange} name="brand">
          <option value=""></option>
          {options1.map((choice, index) => (
            <option key={index} value={choice}>
              {choice}
            </option>
          ))}
        </select>
      </div>
      <div className="findstockitem">
        <label>Thickness:</label>
        <select value={inputs['thickness']} onChange={handleDropdownChange} name="thickness">
          <option value=""></option>
          {options2.map((choice, index) => (
            <option key={index} value={choice}>
              {choice}
            </option>
          ))}
        </select>
      </div>
      <div className="findstockitem">
        <label>Colour:</label>
        <select value={inputs['colour']} onChange={handleDropdownChange} name="colour">
          <option value=""></option>
          {options3.map((choice, index) => (
            <option key={index} value={choice}>
              {choice}
            </option>
          ))}
        </select>
      </div>
      <div className="findstockitem">
        <label>GF Status:</label>
        <select value={inputs['gfstatus']} onChange={handleDropdownChange} name="gfstatus">
          <option value="">Select a choice</option>
          {options4.map((choice, index) => (
            <option key={index} value={choice}>
              {choice}
            </option>
          ))}
        </select>
      </div>
      <div className="findstockitem">
        <label>AZ Value:</label>
        <select value={inputs['azvalue']} onChange={handleDropdownChange} name="azvalue">
          <option value="">Select a choice</option>
          {options5.map((choice, index) => (
            <option key={index} value={choice}>
              {choice}
            </option>
          ))}
        </select>
      </div>
      <div>
        {/* <p>Selected Value 1: {inputs['brand']}</p> */}
        {/* <p>Selected Value 2: {inputs['thickness']}</p> */}
        {/* <p>Selected Value 3: {inputs['colour']}</p> */}
        {/* <p>Selected Value 4: {inputs['gfstatus']}</p> */}
      </div>
      <button className="loginButton" onClick={handleClick}>Find Stock</button>
      <p> `Stock Value is {sqft} sqft`</p>
      <div style={{ marginTop: '5px', display: 'flex' , alignItems: 'center' , gap: '10px'}}>
        <input
          type="file"
          accept= ".xlsx"
          onChange={fileChangeHandlerDaily}
          style={{ display: 'none' }}
          id="fileInput" // Associate a label with this input
        />
        <label htmlFor="fileInput" className="FileSelection">Choose Purchase File</label>
        <p>{filedaily.name}</p>
        <button className="StockButton" onClick={onSubmitHandlerDaily}>{buttonText}</button>
      </div>
      <div className="InsertArea">
            <button className="StockButton" onClick={handleDailyUpdate}>Update Daily Stat</button>
            {insertstatus ? (<p>Updated</p>) :(<p></p>)}
      </div>
      <div>
      <h2>Select Date Range</h2>
      <div>
        <label htmlFor="startDate">From Date:</label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={handleStartDateChange}
        />
      </div>
      <div>
        <label htmlFor="endDate">To Date:</label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={handleEndDateChange}
        />
      </div>
      {startDate && endDate && (
        <p>
          Selected Date Range: {startDate} to {endDate}
        </p>
      )}
    </div>      
    </div>
    
  );
};

export default Findstock;
