const { returnbrand, returnazvalue,returngfvalue,calculatefeetttommvalue,
    calculateinchttommvalue,calculateareainsqft } = require('./metrolitefunctions');

class screwarray
{
    constructor( brand,length, rate, number, price)
    {
        this.brand = brand
        this.len = length
        this.rate = rate
        this.number = number
        this.totalprice = price
        this.price1= 0.0
        this.errortext = ""
    }
        
    print()
    {
        console.log("Screw details are")
        console.log(this.brand,this.len, this.rate, this.number,this.totalprice)
    }
    verify()
    {
        this.price1 = Number(this.number) * Number(this.rate) 
        let lprice = Number(this.price1) - Number(this.totalprice)
        if(Math.abs(lprice) > 1)
        {
            this.errortext = `Screw price error calculted ${this.price1} XL is ${this.totalprice}`
            console.log("Screw price error")
            //console.log2("Calculated Price = ",this.price1)
            //console.log2("Rate from XL = ", this.totalprice)
        }
    }
    returnnumber()
    {
       return(Number(this.number))
    }
    returnprice()
    {
        return(Number(this.totalprice))
    }
    returnerrortext()
    {
        return(this.errortext)
    }
}
class screw
{
    constructor()
    {
        this.screwarray = []
        this.lnumber = 0
        this.lprice = 0.0
        this.errortext = ""
    
    }
    addattributes( num, price)
    {
        this.screwtotalnum = num
        this.screwtotalprice = price
    }
           
    print()
    {
        this.screwarray.forEach(obj => {
            obj.print()
            
        });
        console.log("Total Num Screws and Total Price")
        console.log(this.screwtotalnum, this.screwtotalprice)
    }        
    addtoscrewarray( brand,length, rate, number ,price)
    {
        if(rate == "")
        {
            console.log("Screw rate is not in XL - error")
            rate = 0
            this.errortext = "Screw rate is not in XL - error"
        }
        if(number == "")
        {
            console.log("Screw number is not in XL - error")
            number = 0
            this.errortext = "Screw number is not in XL - error"
        }
        if(price == "")
        {
            console.log("Screw price is not in XL - error")
            price = 0
            this.errortext = "Screw price is not in XL - error"
        }
        let screwdetail = new screwarray(brand,length, rate, number ,price)
        this.screwarray.push(screwdetail)
        
    }
    verify()
    {
        // console.log("Inside verify Screws")
        this.screwarray.forEach(obj => {
            obj.verify()
            this.lnumber = Number(this.lnumber) + Number(obj.returnnumber())
            this.lprice = Number(this.lprice) + Number(obj.returnprice())
        });
        let diffval = Number(this.lnumber) - Number(this.screwtotalnum)
        if(Math.abs(diffval) > 1)
        {
            this.errortext = `Error - Calculated num of screws is ${this.lnumber} from XL ${this.screwtotalnum}`
            console.log("====Error in Calculated num of screws = ",this.lnumber,
              "Calculated from XL price = ",this.screwtotalnum)
        }
        diffval = Number(this.lprice) - Number(this.screwtotalprice)
        if(Math.abs(diffval) > 1)
        {
            this.errortext = `Error - Calculated Price ${this.lprice} from XL ${this.screwtotalprice}`
            console.log("=====Error in price of screws- Calculated = ",this.lprice,
              "Total Price from XL = ",this.screwtotalprice)
        }
    }    
    returntotal()
    {
        return(Number(this.screwtotalprice))  
    }   
    returnerrortext()
    {
        this.screwarray.forEach(obj => {
            this.errortext = this.errortext + obj.returnerrortext()
           
          });
        return(this.errortext)  
    }    
}

module.exports = screw;
