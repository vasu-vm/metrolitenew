import React from "react";
import "./metsuppliers.css"

const ReadOnlyRow = ({ supplier, handleEditClick, handleDeleteClick }) => {
  return (
    <tr>
      
      <td className="DataHeadingBrand">{supplier.SupplierID}</td>
      <td className="DataHeading">{supplier.Address}</td>
      <td className="DataHeading">{supplier.Remarks}</td>
      <td className="DataHeading">
        <button className="ActionButton"        
          type="button"
          onClick={(event) => handleEditClick( event, supplier.SupplierID)}
        >
          Edit
        </button>
        <button className="ActionButton" type="button" onClick={() => handleDeleteClick(supplier.SupplierID)}>
          Delete
        </button>
      </td>
    </tr>
  );
};

export default ReadOnlyRow;