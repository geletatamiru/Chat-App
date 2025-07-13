const MessageBubble = ({ from, text }) => {
  return (
    <div className={`message-bubble ${from === "me" ? "me" : "other"}`}>
      <p>{text}</p>
    </div>
  );
};

export default MessageBubble;
