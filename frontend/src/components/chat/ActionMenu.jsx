import { MdDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { FaRegCopy } from "react-icons/fa6";
import "./ActionMenu.css";
const ActionMenu = ({onClick, user}) => {
  return (
    <div className="action-menu">
      <div className="copy" onClick={() => onClick("copy")}><FaRegCopy /> <span>Copy</span></div>
      {user === "me" && <div className="edit" onClick={() => onClick("edit")}><CiEdit /> <span>Edit</span></div> }
      <div className="delete" onClick={() => onClick("delete")}><MdDeleteOutline /> <span>Delete</span></div>
    </div>
    )
}

export default ActionMenu;