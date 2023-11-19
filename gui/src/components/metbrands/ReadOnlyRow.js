import React from "react";
import "./metbrands.css"

const ReadOnlyRow = ({ brand, handleEditClick, handleDeleteClick }) => {
  return (
    <tr>
      <td className="DataHeadingBrand">{brand.BrandID}</td>
      <td className="DataHeadingBrand">{brand.SupplierID}</td>
      <td className="DataHeading">{brand.Specification}</td>
      <td className="DataHeading">{brand.Remarks}</td>
      <td className="DataHeading">
        <button className="ActionButton"
          type="button"
          onClick={(event) => handleEditClick( event, brand.BrandID)}
        >
          Edit
        </button>
        <button className="ActionButton" type="button" onClick={() => handleDeleteClick(brand.BrandID)}>
          Delete
        </button>
      </td>
    </tr>
  );
};

export default ReadOnlyRow;