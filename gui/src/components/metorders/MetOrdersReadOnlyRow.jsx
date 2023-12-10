import React from 'react'
import { format } from 'date-fns';

import "./metorders.css"

const MetOrdersReadOnlyRow = ({ metorder, handleEditClick, handleDeleteClick }) => {

     let  ordertime = ""
     if(metorder.ordertime)
        ordertime = format(new Date(metorder.ordertime), 'yyyy-MM-dd HH:mm');
     let  completiontime = ""
     if(metorder.completiontime)
        completiontime = format(new Date(metorder.completiontime), 'yyyy-MM-dd HH:mm');
     let  deliverytime = ""
     if(metorder.deliverytime)
        deliverytime = format(new Date(metorder.deliverytime), 'yyyy-MM-dd HH:mm');


    return (
      <tr>
        <td className="DataHeadingBrand">{metorder.ordernum1}</td>
        <td className="DataHeadingBrand">{metorder.ordernum2}</td>
        <td className="DataHeading">{metorder.orderstatus}</td>
        <td className="DataHeading">{ordertime}</td>
        <td className="DataHeading">{completiontime}</td>
        <td className="DataHeading">{deliverytime}</td>
        <td className="DataHeading">{metorder.users}</td>
        <td >
          <button className='ActionButton1'
            type="button"
            onClick={(event) => handleEditClick( event, metorder.ordernum1)}
          >
            Edit
          </button>
          <button className='ActionButton1' type="button" onClick={() => handleDeleteClick(metorder.ordernum1)}>
            Delete
          </button>
        </td>
      </tr>
    );
  };
  
  export default MetOrdersReadOnlyRow;
