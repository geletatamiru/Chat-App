import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import { FaRegCopy } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";
import ActionMenu from "./ActionMenu";
import Modal from "../Modal";
import Delete from "./Delete";
import { getSocket } from "../../../socket/socket";
import Edit from "./Edit";

const MessageList = ({messages, setMessages, currentUserId, selectedUserId}) => {
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [id, setId] = useState("");
  const [text, setText] = useState("");
  const [user, setUser] = useState("");
  const [copySuccess, setCopySuccess] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const endOfMessagesRef = useRef(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const socket = getSocket();
  
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleClick = async (type) => {
    if(type === "copy"){
      try {
        await navigator.clipboard.writeText(text);
        setCopySuccess('Message copied to the clipboard!');
        setTimeout(() => setCopySuccess(''), 2000); // Clear message after 2 seconds
      } catch (err) {
        setCopySuccess('Failed to copy!');
        setTimeout(() => setCopySuccess(''), 2000);
      }finally {
        setShowActionMenu(false);
      }
    }else if(type === "delete"){
      setShowDelete(true);
      setShowActionMenu(false);
    }else if(type === "edit"){
      setShowEdit(true);
      setShowActionMenu(false);
    }
  }

  const handleDelete = (action) => {
    if(action === "cancel"){
      setShowDelete(false);
    }else if(action === "delete"){
      socket.emit("delete-message", 
        {msgId: id, receiver: selectedUserId},
        (response) => {
          setError("");
          setSuccess("");
          if(response.success){
            setSuccess(response.message);
            setTimeout(() => setSuccess(''), 2000);
            setMessages(prev => (prev.filter(msg => msg._id !== id)))
          }else {
            setError(response.message);
            setTimeout(() => setError(''), 2000);
          }
        });  
        setShowDelete(false);
        
    }
  }
  const handleEdit = (action, editedText) => {
    if(action === "cancel"){
      setShowEdit(false);
    }else if(action === "edit"){
      if(editedText === text){
        setShowEdit(false);
        return;
      }

      socket.emit("edit-message", 
        {msgId: id, text: editedText, receiver: selectedUserId},
        (response) => {
          setError("");
          setSuccess("");
          if(response.success){
            setSuccess(response.message);
            setTimeout(() => setSuccess(''), 2000);
            setMessages(prev => (prev.map(msg => msg._id === id ? {...msg, text: editedText, edited: true} : msg)))
          }else {
            setError(response.message);
            setTimeout(() => setError(''), 2000);
          }
        });  
        setShowEdit(false);
    }
  }
  return (
    <div className="message-list">
      {messages.map((msg) => (
    
        <MessageBubble
          key={msg._id}
          from={msg.sender === currentUserId ? "me" : "other"}
          text={msg.text}
          time={msg.updatedAt}
          read={msg.read}
          id={msg._id}
          edited={msg.edited}
          onClick={(text, id) => {
            setShowActionMenu(prev => !prev) 
            setId(id);
            setText(text);
            setUser(msg.sender === currentUserId ? "me" : "other")
          }}
        />
      ))}
       <div ref={endOfMessagesRef} />
       {copySuccess && <span className="copy-success"><FaRegCopy /> {copySuccess}</span>}
       {error && <span style={{color: "red", textAlign: "center"}}><MdDeleteOutline  /> {error}</span>}
       {success && <span style={{color: "green", textAlign: "center"}}><MdDeleteOutline  /> {success}</span>}
       {showActionMenu && <Modal onClose={() => setShowActionMenu(false)}><ActionMenu  onClick={handleClick} user={user}/></Modal>}
       {showDelete && 
          <Modal 
            onClose={() => {
              setShowActionMenu(false); 
              setShowDelete(false);
            }}>
            <Delete onClick={handleDelete}/>
          </Modal>}
       {showEdit && 
          <Modal 
            onClose={() => {
              setShowActionMenu(false); 
              setShowEdit(false);
            }}>
            <Edit onClick={handleEdit} text={text} />
          </Modal>}
    </div>
  );
};
export default MessageList;
