const { returnbrand, returnazvalue,returngfvalue,calculatefeetttommvalue,
    calculateinchttommvalue,calculateareainsqft } = require('./metrolitefunctions');

class items
{
    constructor( ftlength,Inlength, InMM, width, number,area)
    {
        this.LenInFt = ftlength
        this.LenInInch = Inlength
        this.LenInMM = InMM
        if(InMM != "")
        {
            this.LenInMM = Number(InMM)
        }
        this.Width = width
        this.Num = number
        this.Area = Number(area)
        this.errortext = ""
        if((this.LenInFt =="" ) && (this.LenInInch =="" ) && (Number(this.LenInMM) > 1))
            this.LenInFt = Number(this.LenInMM) * 0.00328084
    }
    print()
    {
        console.log(this.LenInFt,this.LenInMM, this.Num, this.Area)
        this.verifyarea()
    }
    verify()
    {
        this.verifyarea()
    }
    verifyarea()
    {
        let area = calculateareainsqft(this.LenInFt,
               this.LenInInch,this.Width,this.Num)
        larea = Number(area) - Number(this.Area)
        if(abs(larea) >= 1)
        {
            this.errortext = `Area Calc Error ${area} from XL ${this.Area}`
            //console.log("Error in area calculation items")
            //console.log("Items Calculated area = ",area, "Area from XL is", this.Area )
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
class misc
{
    
    constructor( name)
    {
        this.totalarea1 = 0.0
        this.totalitems1 = 0
        this.totalamount1 = 0.0
        this.rate = 0.0
        this.thickness = 0.00
        this.brand =""
        this.colour =""
        this.gfvalue = ""
        this.azvalue = ""
        this.itemsarray =[]
        this.totalnumsheet = 0
        this.totalarea = 0.0
        this.totalamount = 0.0
        this.name = name
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
        this.itemsarray = []
    }
    addtotals(numsheets, totarea, totamt)
    {
        if(numsheets == "")
        {
            //console.log(" Number of Items not in XL - Error")
            numsheets = 0
            this.errortext = "Number of Items not in XL - Error"
        }
        if(totarea == "")
        {
            //console.log(" Items area not in XL - Error")
            totarea = 0
            this.errortext = "Items area not in XL - Error"
        }
        if(totamt == "")
        {
            //console.log(" Items total amount not in XL - Error")
            totamt = 0
            this.errortext = "Items total amount not in XL - Error"
        }
        this.totalnumsheet = numsheets
        this.totalarea = Number(totarea)
        this.totalamount = Number(totamt)
    }    
    print()
    {
        console.log("Item name is ", this.name)
        console.log("Item attributes are","Brand ", this.brand,"AZ Value", this.azvalue,
              "GF Status",this.gfvalue,this.thickness, this.colour, this.rate)
        console.log("Item Details are")
        itemsarray.forEach(obj => {
            obj.print()
            
          });
        
        console.log("Total", this.name," Items , Area, Amount")
        console.log(this.totalnumsheet, this.totalarea, this.totalamount)
        this.verify()
    }        
    addtoitems( ftlength,Inlength, InMM, width ,number,area)
    {
        itemstype = new items(ftlength,Inlength, InMM, width ,number,area)
        this.itemsarray.push(itemstype)
    }
        
    returntotal()
    {
        return(Number(this.totalamount))
    }
    returnerrortext()
    {
        this.itemsarray.forEach(obj => {
            this.errortext = this.errortext + obj.returnerrortext()
           
          });
        return(this.errortext)  
    }
    verify()
    {
        itemsarray.forEach(obj => {
            obj.verify()
            this.totalarea1 = Number(this.totalarea1) + Number(obj.returnarea())
            this.totalitems1 = Number(this.totalitems1) + Number(obj.returnnumber())
             
          });
        
            
        this.totalamount1 = Number(this.totalarea1) * Number(this.rate)
        /* metrolitefunctions.printarea(this.brand, this.colour, this.thickness,\
                this.gfvalue, this.azvalue,this.totalarea,this.name)
        */
        diffval = Number(this.totalarea1) - Number(this.totalarea)
        if(Math.abs(diffval) >= 1)
        {
            this.errortext = `Error Total Calculated = ${this.totalarea1}, From XL file = ${this.totalarea}`
           /* console.log(this.name," === details verification")
            console.log("==============================")
            console.log("Error in Total Area Calculation")
            console.log("Total Calculated = ",this.totalarea1, "From XL file = ",this.totalarea) */
        }
        diffval = Number(this.totalitems1) - Number(this.totalnumsheet)
        if(Math.abs(diffval) >= 1)
        {
            this.errortext = `Error in total num ${this.totalitems1} ${this.totalnumsheet}`
           /* console.log(this.name," === details verification")
            console.log("==============================")
            console.log("Error in Total Number of Items")
            console.log("Total Ridges Calculated = ",this.totalridges1, "From XL file = ",this.totalnumridges) */
        }
        diffval = Number(this.totalamount1) - Number(this.totalamount)
        if(Math.abs(diffval) >= 1)
        {
            this.errortext = `Total Amount Error - Calculated ${this.totalamount1} from XL ${this.totalamount}`
            /* console.log(this.name," === details verification")
            console.log("==============================")
            console.log("Error in Total Amount Calculation")
            console.log("Total Amount Calculated = ",this.totalamount1, "From XL file = ",this.totalamount) */
        }
    }        
}
module.exports = misc;
