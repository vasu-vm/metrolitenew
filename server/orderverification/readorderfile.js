
// Define the path to your XLSX file
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path')
// const fs = require('fs');

const readline = require('readline');
const orderutilsheet = require('./sheet'); 
const orderutilridge = require('./ridge'); 
const orderutilscrews = require('./screw'); 
const orderutilsitems = require('./items'); 
const orderutilpathy = require('./pathy'); 
const { customerorder, metroliteorder } = require('./metroliteorders'); 

module.exports.verifyorder = async function(req, res, filename)
{
  const xlsxFilePath = path.join(__dirname, `filepath/${filename}`); // Replace with your actual file path
  //const parts = filename.split('.');
  const parts = filename.replace(/\.[^.]+$/, '');

  const csvFilePath = path.join(__dirname, `filepath/${parts}.csv`); // Replace with your actual file path

// Step 1: Convert XLSX to CSV with column headings
  const workbook = XLSX.readFile(xlsxFilePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const csvData = XLSX.utils.sheet_to_csv(worksheet);
  let customerorderflag = 0
  let sheettokenflag = 0
  let ridgetokenflag = 0
  let itemtokenflag = 0
  let screwtokenflag = 0
  let pathytokenflag = 0
  let ridgeobj1;
  let sheetobj1;
  let screw;
  let miscobj;
  let pathyobj;
  let metorder;  
  let errortext = "";

  fs.writeFileSync(csvFilePath, csvData, 'utf-8');

  // console.log('XLSX converted to CSV with header:', csvFilePath);
  // const fs = require('fs');
  //const readline = require('readline');

  //const csvFilePath = 'path/to/your/output.csv';  // Replace with the path to your CSV file

  // Step 2: Read the CSV line by line without processing the first line (column headings)
  const rl = readline.createInterface({
    input: fs.createReadStream(csvFilePath),
    crlfDelay: Infinity,
  });

  let isFirstLine = false;

  await rl.on('line', (line) => {
  // Skip the first line (column headings)
    if (isFirstLine) {
      isFirstLine = false;
      return;
    }
    //const row = line.split(',');
    const row = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

    //========================================
      if(row[0].toUpperCase() == "M1")
      {
            metorder = new metroliteorder(row[1],row[2],row[3])
            //metrolitefunctions.setlogfilename(metrolitefunctions.getordernumber(inputfile))
            //metrolitefunctions.openlogfile()
            //metrolitefunctions.setordernum(row[1])
            //metorder.print()
          }
          // Customer Details
          // Name, Phone number, Billing Address, GST if any
          else if(row[0].toUpperCase() == "C1")
          {
              //name, phone, billingadd, gst
            metorder.setcustomerdetails(row[1],row[2],row[3],row[4])
              //#metorder.printdetails()
              //#- C2 row need Order in first column, order number in second column
          }
          else if(row[0].toUpperCase() == "C2")
          {
            if(customerorderflag == 1)
            {
                metorder.addcustomerorder(custorder)
            }
            custorder = new customerorder(row[2])
           // console.log(`New customer order creating with order number ${row[2]}`)
            customerorderflag = 1
          //# Sheet,Brand,Thickness,Colour,Rate astext, Rate   
      }  
      else if(row[0].toUpperCase() == "S1")
      {
          if((sheettokenflag == 1) || (ridgetokenflag == 1) ||  (itemtokenflag == 1) 
            || (screwtokenflag == 1))
          {
              console.log("Error in Token")
              errortext = errortext + "Error in Token"
              return(errortext)
              
          }
          sheettokenflag = 1
          sheetobj1 = new orderutilsheet()
          sheetobj1.addattributes(row[2], row[3], row[4],row[6])
          sheetobj1.addType(row[1])
          custorder.setlastsheettype(sheetobj1.getType())
          custorder.addlastsheetattributes(row[2], row[3], row[4],row[6])
          //#special case of missing s3 tokens  
      }  
      else if((row[0] == "") && (sheettokenflag == 1) && (row[3] != ""))
      {
          sheetobj1.addtosheetarray(row[1],row[2],row[3],row[4],row[5],row[6])
      }

      else if(row[0].toUpperCase() == "S3")
      {
          //#ftlength,Inlength, InMM, width ,number,area
          sheetobj1.addtosheetarray(row[1],row[2],row[3],row[4],row[5],row[6])
          //#Total text in first column, total sheets column5, total area in column6
          //# total amount in column 7
      }
      else if(row[0].toUpperCase() == "S4")
      {
          if(customerorderflag == 0)
          {
              console.log("Error in C2 Token")
              errortext = errortext + "Error in C2 Token"
              return(errortext)
              
          }
          sheetobj1.addtotals(row[5],row[6],row[7])
          //#sheetobj.print()
          custorder.addsheets(sheetobj1)
          sheettokenflag = 0
      }
      else if(row[0].toUpperCase() == "R1")
      {
          if((sheettokenflag == 1) || (ridgetokenflag == 1) ||  (itemtokenflag == 1)
            || (screwtokenflag == 1))
          {
              console.log("Error in Token")
              errortext = errortext + "Error in Token"
              return(errortext)
              
          }
          ridgetokenflag = 1
          // #print("Sheet Details")
          ridgeobj1 = new orderutilridge()
          ridgeobj1.addattributes(row[2], row[3], row[4],row[6])
          custorder.verifyridgetosheet(row[2], row[3], row[4],row[6])
      }
      else if(row[0].toUpperCase() == "R3")
      {
          // #ftlength,Inlength, InMM, width ,number,area
          ridgeobj1.addtoridgearray(row[1],row[2],row[4],row[5],row[6])
      }
      else if(row[0].toUpperCase() == "R4")
      {
          if(customerorderflag == 0)
          {
              console.log("Error in C2 Token")
              errortext = errortext + "Error in C2 Token"
              return(errortext)
              
          }
          ridgeobj1.addtotals(row[5],row[6],row[7])
          // #ridgeobj.print()
          custorder.addridges(ridgeobj1)
          ridgetokenflag = 0
      }
      //----------------Pathy--------------
      else if(row[0].toUpperCase() == "V1")
      {
          if((sheettokenflag == 1) || (ridgetokenflag == 1) ||  (itemtokenflag == 1)
            || (screwtokenflag == 1) || (pathytokenflag == 1))
          {
              console.log("Error in Token")
              errortext = errortext + "Error in Token"
              return(errortext)
              
          }
          pathytokenflag = 1
          // #print("Sheet Details")
          pathyobj = new orderutilpathy()
          
      }
      else if(row[0].toUpperCase().includes("V3"))
      {
          // #ftlength,Inlength, InMM, width ,number,area
          pathyobj.addtotypes( row[0],row[5], row[6], row[7])
          
      }
      else if(row[0].toUpperCase() == "V4")
      {
          if(customerorderflag == 0)
          {
              console.log("Error in C2 Token")
              errortext = errortext + "Error in C2 Token"
              return(errortext)
              
          }
          pathyobj.addattributes(row[7])
          // #ridgeobj.print()
          custorder.addpathy(pathyobj)
          pathytokenflag = 0
      }
      //----------------End Pathy tokens----
      else if(row[0].toUpperCase() == "SC1")
      {
          if((sheettokenflag == 1) || (ridgetokenflag == 1) || (itemtokenflag == 1)
            || (screwtokenflag == 1))
            {
              console.log("Error in Token")
              errortext = errortext + "Error in Token"
              return(errortext)
              
            }  
          screwtokenflag =1
          screw = new orderutilscrews()
      }
      else if(row[0].toUpperCase() == "SC3")
      {
          screw.addtoscrewarray(row[1], row[2],row[3], row[4],row[5])
      }
      else if(row[0].toUpperCase() == "SC4")
      {
          if(customerorderflag == 0)
          {
              console.log("Error in C2 Token")
              errortext = errortext + "Error in C2 Token"
              return(errortext)
              
          }
          screw.addattributes(row[4],row[5])
          custorder.addscrews(screw)
          screwtokenflag = 0
      }
      else if(row[0].toUpperCase() == "A1")
      {
          if((sheettokenflag == 1) || (ridgetokenflag == 1) || (itemtokenflag == 1)
            ||  (screwtokenflag == 1))
          {
              console.log("Error in Token")
              errortext = errortext + "Error in Token"
              return(errortext)
              
          }    
          itemtokenflag = 1
          miscobj = new orderutilsitems(row[1])
          miscobj.addattributes(row[2],row[3], row[4], row[6])
      }
      else if(row[0].toUpperCase() == "A3")
      {
          miscobj.addtoitems(row[1],row[2], row[3], row[4], row[5], row[6])
      }
      else if(row[0].toUpperCase() == "A4")
      {
          if(customerorderflag == 0)
          {
              console.log("Error in C2 Token")
              errortext = errortext + "Error in C2 Token"
              return(errortext)
          }
          miscobj.addtotals(row[5], row[6], row[7])
          custorder.addmisc(miscobj)
          itemtokenflag = 0
      }
      else if(row[0].toUpperCase() == "G1")
      {
          metorder.setgranttotal(row[7])
          metorder.addcustomerorder(custorder)
          metorder.verifyorder()
          metorder.verifytotal()
          metorder.print()
          // console.log("Result",metorder.returnerrortext())
          let text1 = metorder.returnerrortext()
          let text2 = metorder.returnwarningtext()
          if(text2.length > 1)
          {
            console.log(`Warning is ${text2}`)
          }
          //console.log(text1)
          if(text1.length > 1)
          {
            console.log(text1.length , "Error text length")
            res.status(201).send(`Result is ${text1}`)
          }
          else if (text2.length > 1)
          {
            res.status(201).send(`Warning -- ${text2}`)
          }
          else
          {
            res.status(201).send("Success")
          }
            

          // return(metorder.returnerrortext())

  
      }
    //========================================
    //console.log(row[0]);

  });
  
  rl.on('close', () => {
    //console.log('CSV File read successfully.');
    fs.unlink(csvFilePath, (err) => {
      if (err) {
        console.error(`Error deleting the file: ${err}`);
      } else {
        //console.log('File deleted successfully.');
      }
    });
    fs.unlink(xlsxFilePath, (err) => {
      if (err) {
        console.error(`Error deleting the file: ${err}`);
      } else {
        //console.log('File deleted successfully.');
      }
    });
  });
  
   
}
//verifyorder("R-846-STEELCREAFT.xlsx")
//module.exports = verifyorder;
