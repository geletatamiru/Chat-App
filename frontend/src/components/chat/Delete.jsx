import React from 'react'
import "./Delete.css";
const Delete = ({onClick}) => {
  return (
    <div className='delete-container'>
      <h2>Delete Message</h2>
      <p>Are you sure you want to delete this message?</p>
      <div className='buttons'>
        <button className='cancel-btn' onClick={() => onClick('cancel')}>Cancel</button>
        <button className='delete-btn' onClick={() => onClick('delete')}>Delete</button>
      </div>
    </div>
  )
}

export default Delete