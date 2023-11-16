const XLSX = require('xlsx');
const fs = require('fs');
const db1 = require('../db');

module.exports.printstocks = async function(req){
        console.log("print stock service")
        const db = db1(req.company)
        mysql_select_stock = "select * from metstockdetails order by Brand, Thickness, Colour, GFStatus, AZValue "
        mysql_select_summary = "select * from metstocksummary order by Brand, Thickness, Colour, GFStatus, AZValue"
        const detailsHeaders = ['ID', 'Brand', 'Tkns','Color', 'Wt', 'CM','F-wt', 'Sqft', 'Loc','GF', 'AZ', 'Suplr']; 
        const summaryHeaders = [ 'Brand', 'Tkns','Color','GF', 'AZ', 'Sqft']
        const [stockdetails] = await db.query(mysql_select_stock);
        const [stocksummary] = await db.query(mysql_select_summary);
        // Create an array to hold the data with custom headers
        const datadetails = [detailsHeaders];
        const datasummary = [summaryHeaders]
         // Convert MySQL results to an array of arrays
        stockdetails.forEach(row => {
            datadetails.push(Object.values(row));
        });
        stocksummary.forEach(row => {
                datasummary.push(Object.values(row));
        });

       // Get the current date and time
       const currentDate = new Date();         

       // Define a function to format the date and time
       function formatDate(date) {
               const year = date.getFullYear();
               const month = (date.getMonth() + 1).toString().padStart(2, '0');
               const day = date.getDate().toString().padStart(2, '0');
               return `${year}-${month}-${day}`;
       }
        // Create a new workbook and add a worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(datadetails);

        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
        // Get the current date and time
       
        // Generate the XLSX file
        const xlsxFileName = `./filepath/stock-details-${formatDate(currentDate)}.xlsx`;
        XLSX.writeFile(workbook, xlsxFileName);

        console.log(`XLSX file "${xlsxFileName}" created successfully.`);
         // Create a new workbook and add a worksheet
         const workbooksummary = XLSX.utils.book_new();
         const worksheetsummary = XLSX.utils.aoa_to_sheet(datasummary);
 
         // Add the worksheet to the workbook
         XLSX.utils.book_append_sheet(workbooksummary, worksheetsummary, 'Sheet 1');
         // Get the current date and time
        
         // Generate the XLSX file
         const xlsxFileNameSummary = `./filepath/stock-summary-${formatDate(currentDate)}.xlsx`;
         XLSX.writeFile(workbooksummary, xlsxFileNameSummary);
 
         console.log(`XLSX file "${xlsxFileNameSummary}" created successfully.`);

        return 1;

}
