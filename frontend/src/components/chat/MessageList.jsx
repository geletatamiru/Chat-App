import MessageBubble from "./MessageBubble";

const dummyMessages = [
  { from: "me", text: "Hey! How's your day going so far?" },
  { from: "other", text: "Just working and trying to stay productive." },
];

const MessageList = ({messages}) => {
  return (
    <div className="message-list">
      {messages.map((msg) => (
        <MessageBubble key={msg._id} from={msg.from} text={msg.text} />
      ))}
    </div>
  );
};
export default MessageList;
