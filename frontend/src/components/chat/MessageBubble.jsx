const MessageBubble = ({ from, text, time }) => {
  const formatTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
};
const formatedTime = formatTime(time);
  return (
    <div className={`message-bubble ${from === "me" ? "me" : "other"}`}>
      <p className="text">{text}</p>
      <p className="time">{formatedTime}</p>
    </div>
  );
};

export default MessageBubble;
