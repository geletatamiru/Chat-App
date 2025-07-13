import { useState } from "react";
const ChatInput = ({onClick}) => {
  const [text, setText] = useState("");
  const handleClick = () => {
    onClick(text);
    setText("");
  }
  return (
    <div className="chat-input">
      <input 
        type="text" 
        placeholder="Send a message" 
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleClick}>Send</button>
    </div>
  );
};

export default ChatInput;
