import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { addMessage, getMessages } from "../../chatSlice";
import chatStyles from "./Chat.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const nestURL = import.meta.env.VITE_NEST_URI;

const Chat = ({ participantId }) => {
  const dispatch = useDispatch();
  const roomId = useSelector((state) => state.chat.currentRoomId);
  const messages = useSelector((state) => state.chat.messages[roomId] || []);
  const [socket, setSocket] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const currentUser = useSelector((state) => state.authUser.currentUser);
  const hasMoreMessages = useSelector((state) => state.chat.hasMoreMessages);
  const currentPage = useSelector((state) => state.chat.currentPage);
  const loading = useSelector((state) => state.chat.loading);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    const newSocket = io(nestURL);
    setSocket(newSocket);

    newSocket.emit("joinRoom", roomId);

    if (!messages.length) {
      dispatch(getMessages({ roomId, page: 1 }));
    }

    newSocket.on("newMessage", (message) => {
      dispatch(addMessage(message));
    });

    return () => {
      newSocket.emit("leaveRoom", roomId);
      newSocket.disconnect();
    };
  }, [roomId, dispatch, messages.length]);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (container.scrollTop === 0 && !loading && hasMoreMessages) {
      dispatch(getMessages({ roomId, page: currentPage + 1 }));
    }
  };

  const sendMessage = () => {
    if (messageInput.trim() && socket) {
      const messageData = {
        roomId,
        message: messageInput,
        sender: participantId,
      };
      socket.emit("sendMessage", messageData);
      setMessageInput("");
    }
  };
  return (
    <div className={chatStyles.chatContainer}>
      <div
        className={chatStyles.messagesContainer}
        ref={messagesContainerRef}
        onScroll={handleScroll}
      >
        {loading && <div className={chatStyles.loading}>Loading...</div>}
        {messages?.map((msg, index) => (
          <div
            key={index}
            className={`${chatStyles.message} ${
              msg.sender === currentUser._id
                ? chatStyles.sent
                : chatStyles.received
            }`}
          >
            <div className={chatStyles.messageContent}>{msg.content}</div>
          </div>
        ))}
      </div>
      <div className={chatStyles.inputContainer}>
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          className={chatStyles.messageInput}
          placeholder="Type a message"
        />
        <button onClick={sendMessage} className={chatStyles.sendButton}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </div>
  );
};

export default Chat;
