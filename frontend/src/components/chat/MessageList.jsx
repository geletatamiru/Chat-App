import MessageBubble from "./MessageBubble";

const dummyMessages = [
  { from: "me", text: "Hey! How's your day going so far?" },
  { from: "other", text: "Just working and trying to stay productive." },
];

const MessageList = () => {
  return (
    <div className="message-list">
      {dummyMessages.map((msg, index) => (
        <MessageBubble key={index} from={msg.from} text={msg.text} />
      ))}
    </div>
  );
};
export default MessageList;
