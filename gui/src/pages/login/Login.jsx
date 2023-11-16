import "./login.css"
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

export default function Login() {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
    company: "Roofing"
  })  

  const [err, setErr] = useState();
  

  const navigate = useNavigate();

  const handleChange = function(e){
    setInputs( function(prev){
        return({...prev, [e.target.name]: e.target.value})
    })
  }

  const {login} = useContext(AuthContext);

  const handleLogin = async function(e)
  {
    e.preventDefault();
    
    try{
        await login(inputs);
        navigate("/");
    }catch(err){
        //console.log(err.response)        
        setErr(err.response.data)
    }
    
  }
  const handleRegister = async function(e)
  {
    e.preventDefault();
    navigate("/register");   
    
  }
  const handleDropdownChange = (event) => {
  
    setInputs( function(prev){
      return({...prev, [event.target.name]: event.target.value})
  })
    
  }

  return (
    <div className="login">
        <div className="loginWrapper">
            <div className="loginLeft">
                <h3 className="loginLogo">Metrolite</h3>
                <span className="loginDesc">Order Management</span>
            </div>
            <div className="loginRight">
                <div className="loginBox">
                <label htmlFor="dropdown" className="selectcompany">Select a Company: </label>
                      <select id="dropdown" className="dropdown" name="company" value={inputs['company']} onChange={handleDropdownChange}>
                          <option value="Roofing">Roofing</option>
                          <option value="Heavy">Heavy</option>
                      </select>
                    <p>{inputs['company']}</p>
                    <input placeholder="username" name="username" className="loginInput" onChange={handleChange}/>
                    <input placeholder="password" className="loginInput" name="password" type="password" onChange={handleChange}/>
                    <button className="loginButton" onClick={handleLogin}>Log In</button>
                    <button className="registerButton" onClick={handleRegister}>Create New Account</button>
                    {err && <p>{err}</p>}  
                </div>               
            </div>
        </div>
      
    </div>
  )
}
