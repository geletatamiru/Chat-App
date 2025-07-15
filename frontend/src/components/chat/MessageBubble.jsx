const MessageBubble = ({ from, text }) => {
  return (
    <div className={`message-bubble ${from === "me" ? "me" : "other"}`}>
      <p className="text">{text}</p>
      <p className="time">9:27 PM</p>
    </div>
  );
};

export default MessageBubble;
