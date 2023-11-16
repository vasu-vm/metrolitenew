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

  const [inputs, setInputs] = useState({
    brand: "C+",
    thickness: "0.35",
    colour: "Grey",
    gfstatus: "Y",
    azvalue: "150"
  }) 
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
        <p>Selected Value 1: {inputs['brand']}</p>
        <p>Selected Value 2: {inputs['thickness']}</p>
        <p>Selected Value 3: {inputs['colour']}</p>
        <p>Selected Value 4: {inputs['gfstatus']}</p>
      </div>
      <button className="loginButton" onClick={handleClick}>Find Stock</button>
      <p> `Stock Value is {sqft} sqft`</p>
    </div>
  );
};

export default Findstock;
