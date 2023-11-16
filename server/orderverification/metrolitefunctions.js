// functions.js
//import { add, subtract, multiply, divide } from './functions.js';

function returnbrand(inputstring)
{
  // Checking Brand is C+ or P+ or V+ or Asiano not
  let string1 = inputstring
  if ((string1.toLowerCase().includes("olouron")) || (string1.toLowerCase().includes("c+")))
  {
        return "C+"
  }
  if ((string1.toLowerCase().includes("ragati")) || (string1.toLowerCase().includes("p+")))
  {
        return "P+"
  }
  if ((string1.toLowerCase().includes("vishwa")) || (string1.toLowerCase().includes("v+"))
    || (string1.toLowerCase().includes("silve"))|| (string1.toLowerCase().includes("s+")))
  {
        return "V+"
  }
  
  if((string1.toLowerCase().includes("asia")))
  {
      return "Asiano"
  }
  if((string1.toLowerCase().includes("am")) && (string1.toLowerCase().includes("ns")) )
  {
      return "AMNS"
  }
  console.log("returnbrand" ,string1)
  return "None"
}

function returnazvalue(inputstring)
{
    // Checking AZ70 or AZ150
    let string1 = inputstring
    if (string1.toLowerCase().includes("70")) 
    {
        return 70
    }
    if (string1.toLowerCase().includes("150")) 
    {
        return 150
    }
    console.log("returnazvalue" ,string1)
    return 0
}
function returngfvalue(inputstring)
{
    //Checking with out GF or not
    let string1 = inputstring
    if (string1.toLowerCase().includes("out")) 
    {
        return "N"
    }
    if (string1.toLowerCase().includes("with")) 
    {
        return "Y"
    }
    console.log("returngfvalue" ,string1)
    return "U"
}

function calculatefeetttommvalue(inputvalue)
{
    if(inputvalue != "")
        return 304.8 * Number(inputvalue)
    return 0.0
}
function calculateinchttommvalue(inputvalue)
{
    if(inputvalue != "")
        return 25.4 * Number(inputvalue)
    return 0.0
}
function calculateareainsqft(lenft , leninch, widthinput, numberinput)
{
    let feet = 0.0
    let inch = 0.0
    let width = 0.0
    let number = 0.0
    if(lenft != "")
        feet = Number(lenft)
    if(leninch != "")
        inch = Number(leninch)
        
    if(widthinput != "")
        width = Number(widthinput)
    if(numberinput != "")
        number = Number(numberinput)
    
        
    area =  ((feet +  (0.0833333 *inch))* width *number)
    
    return(area)
}   

module.exports = { returnbrand, returnazvalue,returngfvalue,calculatefeetttommvalue,calculateinchttommvalue,calculateareainsqft };