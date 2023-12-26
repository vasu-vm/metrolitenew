const { returnbrand, returnazvalue,returngfvalue,calculatefeetttommvalue,
    calculateinchttommvalue,calculateareainsqft } = require('./metrolitefunctions');

class element
{
    // types are gutter, joint, end drop, end cap, center drop , clamp
    // valid values are G, J, ED, EC, CD , C
    constructor( type,qty, rate, amt)
    {
        this.type = type
        this.qty = qty
        this.rate = rate
        this.amt = amt
        this.errortext = ""
        this.calamt = 0.0
    }
        
    print()
    {
        console.log("Pathy element details are")
        console.log(this.type,this.qty, this.rate, this.amt)
    }
    verify()
    {
        this.calamt = Number(this.qty) * Number(this.rate) 
        let lprice = Number(this.amt) - Number(this.calamt)
        if(Math.abs(lprice) > 1)
        {
            this.errortext = `Gutter price error calculted ${this.calamt} XL is ${this.amt}`
        }
    }
    returnnumber()
    {
       return(Number(this.qty))
    }
    returnprice()
    {
        return(Number(this.amt))
    }
    returnerrortext()
    {
        return(this.errortext)
    }
}
class pathy
{
    constructor()
    {
        this.types = []
        this.numtypes = 0
        this.totalamt = 0.0
        this.errortext = ""
        this.lprice = 0.0
    
    }
    addattributes( amt)
    {
        this.totalamt = amt
        
    }
           
    print()
    {
        this.types.forEach(obj => {
            obj.print()
            
        });
        console.log("Total Price of Pathy")
        console.log(this.totalamt)
    }        
    addtotypes( type,qty, rate, amt)
    {
        if(type == "")
        {
            type = "N"
            this.errortext = "Pathy item not in XL - error"
        }
        if(qty == "")
        {
            
            qty = 0
            this.errortext = "Quantity is not in XL - error"
        }
        if(rate == "")
        {
            rate = 0
            this.errortext = "Pathy Rate is not in XL - error"
        }
        if(amt == "")
        {
            amt = 0
            this.errortext = "Amount is not in XL - error"
        }
        let items = new element(type,qty, rate, amt)
        this.types.push(items)
        
    }
    verify()
    {
        // console.log("Inside verify Screws")
        this.types.forEach(obj => {
            obj.verify()
            
            this.lprice = Number(this.lprice) + Number(obj.returnprice())
        });
        diffval = Number(this.lprice) - Number(this.totalamt)
        if(Math.abs(diffval) > 1)
        {
            this.errortext = `Pathy Error - Calculated Price ${this.lprice} from XL ${this.totalamt}`
           
        }
    }    
    returntotal()
    {
        return(Number(this.totalamt))  
    }   
    returnerrortext()
    {
        this.types.forEach(obj => {
            this.errortext = this.errortext + obj.returnerrortext()
           
          });
        return(this.errortext)  
    }    
}

module.exports = pathy;
