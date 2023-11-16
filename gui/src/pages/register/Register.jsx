import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./register.css"
import axios from "axios";

export default function Register() {

  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
    company: "Roofing"
    
  })
  const [err, setErr] = useState(null);

  
  

  const handleChange = function(e) {
    setInputs(function(prev){
        return({ ...prev, [e.target.name]: e.target.value })
    })
  }
  const handleDropdownChange = (event) => {
  
    setInputs( function(prev){
      return({...prev, [event.target.name]: event.target.value})
  })}
  const handleClick = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3002/api/auth/register", inputs);
    } catch (err) {
      setErr(err.response.data);
    }
    navigate("/login")
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    navigate("/login")
  };

  console.log(err)


  return (
    <div className="login">
        <div className="loginWrapper">
            <div className="loginLeft">
                <h3 className="loginLogo">Metrolite</h3>
                <span className="loginDesc">Operational Software</span>
            </div>
            <div className="loginRight">
                <div className="loginBox">
                <label htmlFor="dropdown" className="selectcompany">Select a Company: </label>
                      <select id="dropdown" className="dropdown" name="company" value={inputs['company']} onChange={handleDropdownChange}>
                          <option value="Roofing">Roofing</option>
                          <option value="Heavy">Heavy</option>
                      </select>
                    <p>{inputs['company']}</p>
                
                    <input type="text" placeholder="username" className="loginInput" name="username" onChange={handleChange}/>
                    <input placeholder="password" className="loginInput" name="password" type="password" onChange={handleChange}/>
                    <button className="loginButton" onClick={handleClick}>Register</button>
                    <button className="registerButton" onClick={handleLogin}>Log into Your Account</button>  
                </div>
               
            </div>
        </div>
      
    </div>
  )
}
