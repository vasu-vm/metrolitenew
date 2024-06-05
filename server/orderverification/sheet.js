const { returnbrand, returnazvalue,returngfvalue,calculatefeetttommvalue,
    calculateinchttommvalue,calculateareainsqft } = require('./metrolitefunctions');

class sheetarray 
{
    constructor(ftlength,Inlength, InMM, width, number,area) 
    {
      this.errortext = ""
      this.warningtext = ""
      this.LenInFt = ftlength
      this.LenInInch = Inlength  
      if(InMM == "")
            InMM = 0
      this.LenInMM = InMM
      this.Width = width
      this.Num = number
      this.Area = area
      if((this.LenInFt =="" ) && (this.LenInInch =="" ) && (Number(this.LenInMM) > 1))
            this.LenInFt = (Number(this.LenInMM) * 0.00328084)
    }

    verify()
    {
        this.verifymm()
        this.verifyarea()
    }
    verifymm()
    {
        let mmvalue = (Number(this.LenInFt) * 304.8) +(Number(this.LenInInch) * 25.4)
        if(Math.abs(mmvalue - Number(this.LenInMM)) >= 1)
        {    
            this.errortext = this.errortext + `Calculated mm = ${mmvalue}, MM from XL is, ${this.LenInMM}`
            //console.log("Error in MM calculation")
            //console.log("Calculated mm =",mmvalue, "MM from XL is",this.LenInMM )
        }
    }

    verifyarea()
    {
        let area = ((Number(this.LenInFt) + Number(this.LenInInch/12)) *this.Width *this.Num)
        let larea = area - Number(this.Area)
        if(Math.abs(larea) >= 1)
        {
            this.errortext = this.errortext + `Sheet Calculated area = ${area}, Area from XL is ${this.Area}`
            //console.log("Error in Area Calculation")
            //console.log("Sheet Calculated area = ",area, "Area from XL is", this.Area )
        }
    }
    print()
    {
        console.log(this.LenInFt,this.LenInMM, this.Num, this.Area)
        this.verifymm()
        this.verifyarea()
    }
        
    returnarea()
    {
        return (this.Area)
    }
    returnnumber()
    {
        return (this.Num)
    }
    returnerrortext()
    {
        return(this.errortext);
    }
    returnwarningtext()
    {
        return(this.warningtext);
    }
}
  
class Sheet 
{
    constructor()
    {
        this.errortext = "";
        this.warningtext = ""
        this.rate = 0.0
        this.totalsheets1 = 0
        this.totalarea1 = 0.0
        this.totalamount1 = 0.0
        this.thickness = 0.00
        this.brand =""
        this.colour =""
        this.gfvalue = ""
        this.azvalue = ""
        //#liner or 6 rib
        this.sheettype = ""
        //#sheetarray list saves every sheet details
        this.sheetarray =[]
        this.totalnumsheet = 0
        this.totalarea = 0.0
        this.totalamount = 0.0
        this.type = 0
    }
    //def __init__(this)
    addType(SheetType)
    {
        const lowerCaseStr = SheetType.toLowerCase();
        if ((lowerCaseStr.includes("6")) && ((lowerCaseStr.includes("trafford"))
        || (lowerCaseStr.includes("sheet"))))
        {
            this.type = 1;
            console.log("Normal 6 rib sheet")
           
        }
        else if((lowerCaseStr.includes("21")) && (lowerCaseStr.includes("liner"))) 
        {
            this.type = 2;    
            console.log("Liner 21 rib sheet")        
        }
        else if((lowerCaseStr.includes("23")) && (lowerCaseStr.includes("liner"))) 
        {
            this.type = 3; 
            console.log("Liner 23 rib sheet")           
        }
        else if((lowerCaseStr.includes("14")) && (lowerCaseStr.includes("liner"))) 
        {
            this.type = 4;   
            console.log("Liner 14 rib sheet")         
        }
        else{
            this.errortext = this.errortext + "Invalid sheet type"
        }
    }
    getType()
    {
        return(this.type)
    }   
    addattributes(Brand,Thickness,Colour,Rate)
    {
        //Checking Brand is C+ or not
        this.brand = returnbrand(Brand)
        this.gfvalue = returngfvalue(Brand)
        this.thickness = Thickness
        this.colour = Colour
        this.azvalue = returnazvalue(Brand)
        this.rate = Rate
        this.sheetarray = []
        if((this.brand == "C+") && (this.gfvalue)== "U")
        {
            this.errortext = this.errortext + `Guard film status not mentioned in XL - Error`
            //console.log("Guard film status not mentioned in XL - Error")
        }
    }
    addtotals(numsheets, totarea, totamt)
    {
        if(numsheets == "")
        {
            this.errortext = this.errortext + "Number of sheets not in XL - Error"
            //console.log(" Number of sheets not in XL - Error")   
            this.totalnumsheet = 0         
        }
        else
        {
            this.totalnumsheet = Number(numsheets)
        }
        if(totarea == "")
        {
            this.errortext = this.errortext + "Sheet area not in XL - Error"
            console.log(" Sheet area not in XL - Error")
            this.totalarea = 0;
        }
        else
        {
            this.totalarea = Number(totarea);
        }
        if(totamt == "")
        {
            this.errortext = this.errortext + "Sheet total amount not in XL - Error"
            // metrolitefunctions.writelog(" Sheet total amount not in XL - Error")
            this.totalamount = 0;
        }   
        else
        {
            this.totalamount = Number(totamt)
        } 
        
        
    }    
    print()
    {
        console.log(`Sheet attributes are", ${this.brand},"AZ Value",${this.azvalue},
              "GF status is",${this.gfvalue}, ${this.thickness},
              ${this.colour}, ${this.rate}`)
        console.log("Sheet Details are")
        this.sheetarray.forEach(sheet => {
            sheet.print()
          });
        console.log("Total Sheets, Area, Amount")
        console.log(this.totalnumsheet, this.totalarea, this.totalamount)
        this.verify()
    }        
    addtosheetarray(ftlength,Inlength, InMM, width ,number,area)
    {
        if((this.type == 1) && (width != 3.61))
        {
            this.warningtext = this.warningtext + `Width may not be correct ${width},expected is 3.61`
        }
        if((this.type == 2) && (width != 3.8))
        {
            this.warningtext = this.warningtext + `Width may not be correct ${width},expected is 3.8`
        }
        if((this.type == 3) && (width != 3.83))
        {
            this.warningtext = this.warningtext + `Width may not be correct ${width},expected is 3.83`
        }
        if((this.type == 4) && (width != 3.75))
        {
            this.warningtext = this.warningtext + `Width may not be correct ${width},expected is 3.75`
        }
        // console.log("addtosheetarray",ftlength,Inlength, InMM, width ,number,area)
        let sheetelement = new sheetarray(ftlength,Inlength, InMM, width ,number,area)
        this.sheetarray.push(sheetelement)
    }
        
    returntotal()
    {
        return(this.totalamount)
    } 
    returnerrortext()
    {
        let lerrortext = "";
        this.sheetarray.forEach(sheet => {
         
            lerrortext = lerrortext + sheet.returnerrortext()
           
          });
        this.errortext =  this.errortext + lerrortext;
        
        return(this.errortext)  
    }   
    returnwarningtext()
    {
        let lwarningtext= "";
        this.sheetarray.forEach(sheet => {
         
            lerrortext = lerrortext + sheet.returnwarningtext()
           
          });
        this.warningtext =  this.warningtext + lwarningtext;
        
        return(this.warningtext)  
    }
// #verify the sheet details
    verify()
    {
        this.sheetarray.forEach(sheet => {
            sheet.verify()
            // console.log("returnnumber", sheet.returnnumber())
            this.totalarea1 = Number(this.totalarea1) + Number(sheet.returnarea())
            this.totalsheets1 = Number(this.totalsheets1) + Number(sheet.returnnumber())
          });
        
        this.totalamount1 = Number(this.totalarea1) * Number(this.rate)
        this.totalamount1 = Number(this.totalamount1)
        /*console.log("Inside verify sheet")
        
        console.log(`${this.brand}, ${this.colour}, ${this.thickness},
                ${this.gfvalue}, ${this.azvalue},${this.totalarea}, Sheet`) */
        let diffval = Number(this.totalarea1) - Number(this.totalarea)
        if(Math.abs(diffval) >= 1)
        {
            this.errortext = this.errortext + `Total Calculated = ${this.totalarea1}, From XL file = ${this.totalarea}`
            /*console.log("Sheet details verification")
            console.log("==============================")
            console.log("Error in Total Area Calculation")
            console.log("Total Calculated = ",this.totalarea1, "From XL file = ",this.totalarea) */
        }
        diffval = Number(this.totalsheets1) - Number(this.totalnumsheet)
        // console.log("Sheet Number detais",this.totalsheets1,this.totalnumsheet )
        if(Math.abs(diffval) >= 1)
        {
            let lerrtext= `Total Sheets Calculated = ${this.totalsheets1}, From XL file = ${this.totalnumsheet}`
            this.errortext = this.errortext + lerrtext
            /* metrolitefunctions.writelog("Error in Total Number of Sheets")
            metrolitefunctions.writelog("==============================")
            metrolitefunctions.writelog4("Total Sheets Calculated = ",this.totalsheets1, "From XL file = ",this.totalnumsheet)
            */
        }
        diffval = Number(this.totalamount1) - Number(this.totalamount)
        if(Math.abs(diffval) >= 1)
        {
            //console.log(this.errortext,"===========")
            let lerrtext= this.errortext + `Sheet Total Amount Calculated = ${this.totalamount1}, From XL file = ${this.totalamount}`
            this.errortext = lerrtext
            //console.log(this.errortext,"+++++++++")
            /*metrolitefunctions.writelog("Error in Total Amount Calculation")
            metrolitefunctions.writelog("==============================")
            metrolitefunctions.writelog4("Total Amount Calculated = ",this.totalamount1, "From XL file = ",this.totalamount)
            */
        }
    }
} 

module.exports = Sheet;

