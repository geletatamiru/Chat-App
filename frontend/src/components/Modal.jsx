import {createPortal} from "react-dom" 
import "./Modal.css";
const Modal = ({children, onClose}) => {
  return createPortal(
    <>
      <div className='modal-overlay' onClick={onClose}/>
      <div className="modal">
        {children}
      </div>
    </>
  , document.getElementById('portal'))
}

export default Modal;