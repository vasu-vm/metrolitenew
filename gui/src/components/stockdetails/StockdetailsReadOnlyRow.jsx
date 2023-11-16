import React from 'react'
import './stockdetails.css'

const StockdetailsReadOnlyRow = ({ stock, handleEditClick, handleDeleteClick }) => {
    return (
      <tr>
        <td className="DataHeadingBrand">{stock.CoilID}</td>
        <td className="DataHeadingBrand">{stock.Brand}</td>
        <td className="DataHeadingBrand">{stock.Thickness}</td>
        <td className="DataHeadingBrand">{stock.Colour}</td>
        <td className="DataHeadingBrand">{stock.Weight}</td>
        <td className="DataHeadingBrand">{stock.OpenCM}</td>
        <td className="DataHeadingBrand">{stock.FinalWeight}</td>
        <td className="DataHeadingBrand">{stock.Sqft}</td>
        
        <td className="DataHeading">{stock.Location}</td>
        <td className="DataHeading">{stock.GFStatus}</td>
        <td className="DataHeading">{stock.AZValue}</td>
        <td className="DataHeading">{stock.Supplier}</td>
       
        <td>
          <button
            type="button"
            onClick={(event) => handleEditClick( event, stock.CoilID )}
          >
            Edit
          </button>
          <button type="button" onClick={() => handleDeleteClick(stock.CoilID)}>
            Delete
          </button>
        </td>
      </tr>
    );
  };
  
  export default StockdetailsReadOnlyRow;
