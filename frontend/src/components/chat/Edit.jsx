import { useState } from 'react';
import "./Edit.css"
const Edit = ({text, onClick}) => {
  const [editedText, setEditedText] = useState(text);
  return (
    <div className='edit-container'>
      <h3>Edit Message</h3>
      <input 
        type="text" 
        value={editedText}
        onChange={e => setEditedText(e.target.value)}
      />
      <div className='buttons'>
        <button className='cancel-btn' onClick={() => onClick('cancel')}>Cancel</button>
        <button className='edit-btn' onClick={() => onClick('edit', editedText)}>Edit</button>
      </div>
    </div>
  )
}

export default Edit