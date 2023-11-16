const { returnbrand, returnazvalue,returngfvalue,calculatefeetttommvalue,
    calculateinchttommvalue,calculateareainsqft } = require('./metrolitefunctions');
class ridgearray
{
    constructor(ftlength, Inlength,width, number,area)
    {
        this.LenInFt = ftlength
        this.LenInInch = Inlength
        this.Width = width
        this.Num = number
        this.Area = Number(area)
        this.errortext = ""
    }
        
    print()
    {
        console.log(this.LenInFt, this.Num, this.Area)
        
    }
    verify()
    {
        this.verifyarea()
    }
    
    verifyarea()
    {
        let area = calculateareainsqft(this.LenInFt,
               this.LenInInch,this.Width,this.Num)
        let larea = Number(area) - Number(this.Area)
        if(Math.abs(larea) > 1)
        {
            this.errortext = `Ridge Calculated area = ",${area}, "Area from XL is", ${this.Area}`
            // console.log("Error in Area Calculation")
            // console.log4("Ridge Calculated area = ",area, "Area from XL is", this.Area )
        }
    }
    returnarea()
    {
        return Number(this.Area)
    }
    returnnumber()
    {
        return Number(this.Num)
    }
    returnerrortext()
    {
        return(this.errortext)
    }
}
class ridge
{
    rate = 0.0
    totalridges1 = 0
    totalarea1 = 0.0
    totalamount1 = 0.0
    thickness = 0.00
    brand =""
    colour =""
    gfvalue = ""
    azvalue = ""
    ridgearray =[]
    totalnumridges = 0
    totalarea = 0.0
    totalamount = 0.0
    
    constructor()
    {
        this.rate = 0.0
        this.totalridges1 = 0
        this.totalarea1 = 0.0
        this.totalamount1 = 0.0
        this.thickness = 0.00
        this.brand =""
        this.colour =""
        this.gfvalue = ""
        this.azvalue = ""
        this.ridgearray =[]
        this.totalnumridges = 0
        this.totalarea = 0.0
        this.totalamount = 0.0
        this.errortext = ""
    }
        
     addattributes( Brand,Thickness,Colour,Rate)
     {
        
        this.brand = returnbrand(Brand)
        this.gfvalue = returngfvalue(Brand)
        this.azvalue = returnazvalue(Brand)
       
        this.thickness = Thickness
        this.colour = Colour
        this.rate = Rate
        this.ridgearray = []
     }
    addtotals(numridges, totarea, totamt)
    {
        if(numridges == "")
        {
            this.totalnumridges = 0;
            this.errortext = "Number of ridges not in XL - Error"
            //console.log(" Number of ridges not in XL - Error")
        }
        else{
            this.totalnumridges = Number(numridges)
        }
        if(totarea == "")
        {
            this.errortext = "Ridge area not in XL - Error"
            //console.log(" Ridge area not in XL - Error")
            this.totalarea = 0;
        }
        else
        {
            this.totalarea = Number(totarea)
        }
        if(totamt == "")
        {
            this.errortext = "Ridge total amount not in XL - Error"
            //console.log(" Ridge total amount not in XL - Error")
            this.totalamount = 0;
        }
        else
        {
            this.totalamount = Number(totamt)
        }
    }    
    print()
    {
        console.log("Ridge attributes are", "Brand ",this.brand,"AZ Value",this.azvalue,
              "GF status",this.gfvalue, this.thickness, this.colour, this.rate)
        console.log("Ridge Details are")
        this.ridgearray.forEach(obj => {
            obj.print();
        });
        console.log("Total Ridges, Area, Amount")
        console.log(this.totalnumridges, this.totalarea, this.totalamount)
        this.verify()
    }        
    addtoridgearray(ftlength, Inlength,width,number,area)
    {
        let ridgeelement = new ridgearray(ftlength,Inlength, width ,number,area)
        this.ridgearray.push(ridgeelement)
    }
    returntotal()
    {
        return(Number(this.totalamount))
    }
   
    returnerrortext()
    {
        this.ridgearray.forEach(obj => {
            this.errortext = this.errortext + obj.returnerrortext()
           
          });
        return(this.errortext)  
    } 
        
//verify the sheet details
    verify()
    {
        // console.log("Inside verify ridge")
        this.ridgearray.forEach(obj => {
            obj.verify();
            this.totalarea1 = Number(this.totalarea1) + Number(obj.returnarea())
            this.totalridges1 = Number(this.totalridges1) + Number(obj.returnnumber())

        });
        this.totalamount1 = Number(this.totalarea1) * Number(this.rate)
        //this.totalamount1 = "{:.2f}".format(this.totalamount1)
        
        let diffval = Number(this.totalarea1) - Number(this.totalarea)
        // console.log(this.brand, this.colour, this.thickness,
        //        this.gfvalue, this.azvalue,this.totalarea, "Ridge")
        if(Math.abs(diffval) >= 1)
        {
            this.errortext = "#RTArea#" + this.totalarea1 + "#" + this.totalarea
            /* console.log("Ridge details verification")
            console.log("==============================")
            console.log("Error in Total Area Calculation")
            console.log("Total Calculated = ",this.totalarea1, "From XL file = ",this.totalarea) */
        }
        diffval = Number(this.totalridges1) - Number(this.totalnumridges)
        if(Math.abs(diffval) >= 1)
        {
            this.errortext = `Total Ridges Calculated = ${this.totalridges1}, From XL file = ${this.totalnumridges}`
            /* console.log("Ridge details verification")
            console.log("==============================")
            console.log("Error in Total Number of Ridges")
            console.log("Total Ridges Calculated = ",this.totalridges1, "From XL file = ",this.totalnumridges) */
        }
        diffval = Number(this.totalamount1) - Number(this.totalamount)
        if(Math.abs(diffval) >= 1)
        {
            this.errortext = `Total Amount Calculated = ${this.totalamount1}, From XL file = ${this.totalamount}`
            /*console.log("Ridge details verification")
            console.log("==============================")
            console.log("Error in Total Amount Calculation")
            console.log("Total Amount Calculated = ",this.totalamount1, "From XL file = ",this.totalamount) */
        }
    }
}

module.exports = ridge;

