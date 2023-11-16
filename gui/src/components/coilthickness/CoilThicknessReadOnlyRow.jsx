import React from 'react'

const CoilThicknessReadOnlyRow = ({ thickness, handleEditClick, handleDeleteClick }) => {
    return (
      <tr>
        <td className="DataHeadingBrand">{thickness.Thickness}</td>
        <td className="DataHeadingBrand">{thickness.BrandID}</td>
        <td className="DataHeading">{thickness.SqftPerMT}</td>
        <td className="DataHeading">{thickness.Remarks}</td>
        <td>
          <button
            type="button"
            onClick={(event) => handleEditClick( event, thickness.BrandID + thickness.Thickness)}
          >
            Edit
          </button>
          <button type="button" onClick={() => handleDeleteClick(thickness.BrandID)}>
            Delete
          </button>
        </td>
      </tr>
    );
  };
  
  export default CoilThicknessReadOnlyRow;
