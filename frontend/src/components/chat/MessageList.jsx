import MessageBubble from "./MessageBubble";

const MessageList = ({messages, currentUserId}) => {
  return (
    <div className="message-list">
      {messages.map((msg, index) => (
    
        <MessageBubble
          key={index}
          from={msg.sender === currentUserId ? "me" : "other"}
          text={msg.text}
        />
      ))}
    </div>
  );
};
export default MessageList;
