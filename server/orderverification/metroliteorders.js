const Sheet = require('./sheet');
const { returnbrand, returnazvalue,returngfvalue,calculatefeetttommvalue,
    calculateinchttommvalue,calculateareainsqft } = require('./metrolitefunctions');

/* import csv
import pandas as pd
from orderutilsheet import sheet
from orderutilridge import ridge
from orderutilscrews import screw
import metrolitefunctions */

class customerorder
{
    constructor( ordernumber)
    {
        this.sheets = []
        this.ridges = []
        this.screws = []
        this.miscs = []
        this.pathy = []
        this.OrderNumber = ordernumber
        this.ltotal = 0.0
        this.errortext = "";
        this.warningtext = ""
        this.lastsheetthickness = 0.00
        this.lastsheetbrand =""
        this.lastsheetcolour =""
        this.lastsheetgfvalue = ""
        this.lastsheetazvalue = ""
        this.lastsheettype = 0
    }
    setlastsheettype(sheettype)
    {
        this.lastsheettype = sheettype;
    }
    addlastsheetattributes(Brand,Thickness,Colour,Rate)
    {
        //Checking Brand is C+ or not
        this.lastsheetbrand = returnbrand(Brand)
        this.lastsheetgfvalue = returngfvalue(Brand)
        this.lastsheetthickness = Thickness
        this.lastsheetcolour = Colour
        this.lastsheetazvalue = returnazvalue(Brand)
       
    }
    verifyridgetosheet(Brand,Thickness,Colour,Rate)
    {
        // Checking Brand is C+ or not
        // console.log(`ridgetosheet ${Brand} - ${Thickness} - ${Colour} `)
        let ridgebrand = returnbrand(Brand)
        let ridgegfvalue = returngfvalue(Brand)
        let ridgethickness = Thickness
        let ridgecolour = Colour 
        let ridgeazvalue = returnazvalue(Brand)
        if(this.lastsheettype > 1)
        {
            this.warningtext = this.warningtext + "ridge order with liner sheet - abnormal"  
        }
        if(ridgebrand != this.lastsheetbrand)
            this.warningtext = this.warningtext + "mismatch in sheet and ridge brand"
        if(ridgegfvalue != this.lastsheetgfvalue )
            this.warningtext = this.warningtext + "mismatch in sheet and ridge GF status"
        if(ridgethickness != this.lastsheetthickness )
            this.warningtext = this.warningtext + "mismatch in sheet and ridge thickness"
        if(ridgecolour != this.lastsheetcolour)
            this.warningtext = this.warningtext + "mismatch in sheet and ridge colour"
        if(ridgeazvalue != this.lastsheetazvalue)
            this.warningtext = this.warningtext + "mismatch in sheet and ridge az value"
       
    }
    print()
    {
        console.log("Customer Order Number is ",this.OrderNumber )
       /* this.sheets.forEach(sheet => {
            sheet.print()
          });
        this.ridges.forEach(ridge => {
            ridge.print()
          });
        this.screws.forEach(screw => {
            screw.print()
          });
        this.miscs.forEach(misc => {
            misc.print()
          }); */
        this.pathy.forEach(gutter => {
            gutter.print()
          });
       
    }
    verify()
    {
        //console.log("Customer Order Number is ",this.OrderNumber )
        this.sheets.forEach(sheet => {
            sheet.verify()
          });
        this.ridges.forEach(ridge => {
            ridge.verify()
          });
        this.screws.forEach(screw => {
            screw.verify()
          });
        this.miscs.forEach(misc => {
            misc.verify()
          });
    }
    returntotal()
    {
        // console.log("Fetching customer order totals from order ",this.OrderNumber )
        this.sheets.forEach(obj => {
            this.ltotal = this.ltotal + obj.returntotal()
          });
        this.ridges.forEach(obj => {
            this.ltotal = this.ltotal + obj.returntotal()
          });
        this.screws.forEach(obj => {
            this.ltotal = this.ltotal + obj.returntotal()
          });
        this.miscs.forEach(obj => {
            this.ltotal = this.ltotal + obj.returntotal()
          });
        this.pathy.forEach(obj => {
            this.ltotal = this.ltotal + obj.returntotal()
          });
        
        return(Number(this.ltotal))
    }
    returnwarningtext()
    {
        
        let lerrortext = "";
        //console.log(this.OrderNumber, "Customer Order")
        this.sheets.forEach(obj => {
            lerrortext = obj.returnwarningtext()
            if(lerrortext.length > 1)
            {
                this.warningtext = this.warningtext + lerrortext
                
            }
          });
          return(this.warningtext)
    }
    returnerrortext()
    {
        let lerrortext = "";
        //console.log(this.OrderNumber, "Customer Order")
        this.sheets.forEach(obj => {
            lerrortext = obj.returnerrortext()
            if(lerrortext.length > 1)
            {
                this.errortext = this.errortext + lerrortext
                
            }
          });
        
        this.ridges.forEach(obj => {
            lerrortext = obj.returnerrortext()
            if(lerrortext.length > 1)
            {
                this.errortext = this.errortext + lerrortext
                
            }
          });
       
        this.screws.forEach(obj => {
            lerrortext = obj.returnerrortext()
            if(lerrortext.length > 1)
            {
                this.errortext = this.errortext + lerrortext
                
            }
          });
       
        this.miscs.forEach(obj => {
            lerrortext =  obj.returnerrortext()
            if(lerrortext.length > 1)
            {
                this.errortext = this.errortext + lerrortext
                
            }
          });
        
        this.errortext = this.errortext
        
        return(this.errortext);
    }
    addsheets( sheet)
    {
       this.sheets.push(sheet)
    }
    addridges( ridge)
    {    
        this.ridges.push(ridge)
    }
    addscrews( screword)
    {
        this.screws.push(screword)
    }
    addmisc( misc)
    {
        this.miscs.push(misc)
    }
    addpathy( misc)
    {
        this.pathy.push(misc)
    }
}
class metroliteorder
{
    
    constructor(orderid, date, name)
    {
        this.granttotal = 0.0
        this.customername =""
        this.customerphone = ""
        this.billingaddress = ""
        this.gstnumber = ""
        this.customerorders = []
        this.OrderID = orderid
        this.Date = date
        this.Name = name
        this.ltotal = 0.0
        this.errortext = ""
        this.warningtext = ""
    }
    print()
    {
        console.log("Metrolite Order Details are")
        console.log(this.OrderID, this.Date, this.Name)
        this.printdetails()
        console.log("Grant total is  ", this.granttotal)
    }
    setgranttotal(amount)
    {        
        if(amount == "")
        {
            //console.log("Grand Total is empty in XL - Error")
            amount = 0
            this.errortext = "#GTErr#"
        }     
        this.granttotal = Number(amount)
        
    }
    setcustomerdetails( name, phone, billingadd, gst)
    {
        this.customername = name
        this.customerphone = phone
        this.billingaddress = billingadd
        this.gstnumber = gst
    }
    printdetails()
    {
        console.log("Customer Details are")
        console.log(`${this.customername}, ${this.customerphone}, ${this.billingaddress}, 
            ${this.gstnumber}`)
        this.customerorders.forEach(obj => {
            obj.print()
            });
        
    }
    verifyorder()
    {
        //console.log("Customer Verification Details are")
        //console.log(`${this.customername}, ${this.customerphone}, ${this.billingaddress}, 
        //    ${this.gstnumber}`)
        this.customerorders.forEach(obj => {
                obj.verify()
        });
       
    }
    addcustomerorder(custorder)
    {
        //console.log("addcustomer order called")
        let custordertemp = custorder
        this.customerorders.push(custordertemp)
    }
        
    returntotal()
    {
        this.customerorders.forEach(obj => {
            this.ltotal = this.ltotal + obj.returntotal()
        });
       
    }
    returnerrortext()
    {
        // console.log("metrolite Order Errortext Checking")
        let lerrortext = ""
        this.customerorders.forEach(obj => {
            // console.log("metrolite Order Errortext Checking Inside")
            lerrortext=  obj.returnerrortext()
            if(lerrortext.length > 1)
            {
                // console.log(lerrortext, "********************")
                this.errortext = this.errortext + lerrortext
            }
        });
        return(this.errortext)
    }

    returnwarningtext()
    {
        // console.log("metrolite Order Errortext Checking")
        let lwarningtext = ""
        this.customerorders.forEach(obj => {
            // console.log("metrolite Order Errortext Checking Inside")
            lwarningtext=  obj.returnwarningtext()
            if(lwarningtext.length > 1)
            {
                // console.log(lerrortext, "********************")
                this.warningtext = this.warningtext + lwarningtext
            }
        });
        return(this.warningtext)
    }
         
    verifytotal()
    {
        //console.log("Grant total verification")
        //console.log("Grant total from XL is ",this.granttotal)
        this.returntotal()
        //console.log("Grant total from Calculated is ",this.ltotal)
        let diffval = Number(this.ltotal) - Number(this.granttotal)
        if(Math.abs(diffval) > 1)
        {
            this.errortext = "#GTMismatch#"+ this.ltotal + "#" + this.granttotal
            /* console.log("Error in  Final Total Amount Calculation")
            console.log("==============================")
            console.log("Final Amount Calculated = ",this.ltotal, "From XL file = ",this.granttotal) */
        }
    }
}   
        
module.exports = {
    customerorder,
    metroliteorder,
};