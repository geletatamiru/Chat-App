const ChatHeader = ({name}) => {
  return (
    <div className="chat-header">
      <h3>{name}</h3>
      <p>Online</p>
    </div>
  );
};

export default ChatHeader;
