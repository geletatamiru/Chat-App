import sent from "../../assets/sent.png";
import seen from "../../assets/seen.png";
const MessageBubble = ({ from, text, time, read, onClick, id }) => {
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
    <div className={`message-bubble ${from === "me" ? "me" : "other"}`} onClick={() => onClick(text, id)}>
      <p className="text">{text}</p>
      <p className="time">{formatedTime}</p>
      {
        from === "me" && 
        <div className="icon-cont">
          <img src={`${read ? seen : sent}`} alt="sent-icon" />
        </div>
      }
      
    </div>
  );
};

export default MessageBubble;
