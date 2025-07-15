import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

const MessageList = ({messages, currentUserId}) => {
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="message-list">
      {messages.map((msg, index) => (
    
        <MessageBubble
          key={index}
          from={msg.sender === currentUserId ? "me" : "other"}
          text={msg.text}
        />
      ))}
       <div ref={endOfMessagesRef} />
    </div>
  );
};
export default MessageList;
