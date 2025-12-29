import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { CreateSocket } from "../utils/socket";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import moment from "moment";
const Chat = () => {
  const { toUserId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isInitialScrollDone, setIsInitialScrollDone] = useState(false);
  const socket = CreateSocket();
  const messagesEndRef = useRef(null);
  const loadMoreTriggerRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const isInitialLoadRef = useRef(true);
  const shouldScrollToBottomRef = useRef(false);
  const hasUserScrolledUpRef = useRef(false);

  const fetchChatHistory = async (toUserId, cursor = null) => {
    try {
      const url = new URL(BASE_URL + "/chat/" + toUserId);
      if (cursor) {
        url.searchParams.append("cursor", cursor);
      }
      url.searchParams.append("limit", "10");

      const res = await axios.get(url.toString(), {
        withCredentials: true,
      });
      
      const fetchedMessages = res.data.data.messages.map((message) => {
        return {
          text: message.text,
          createdAt: message.createdAt,
          firstName: message.senderId?.firstName,
          lastName: message.senderId?.lastName,
          _id: message._id,
        };
      });

      // Reverse messages since API returns newest first, but we want oldest first (newest at bottom)
      const reversedMessages = fetchedMessages.reverse();

      const pagination = res.data.data.pagination;

      if (cursor) {
        // Loading more messages - prepend older messages to existing messages
        setMessages((prevMessages) => [...reversedMessages, ...prevMessages]);
        shouldScrollToBottomRef.current = false;
      } else {
        // Initial load - replace messages (oldest first, newest at bottom)
        setMessages(reversedMessages);
        isInitialLoadRef.current = true;
        shouldScrollToBottomRef.current = true;
        hasUserScrolledUpRef.current = false; // Reset scroll flag on new chat
        setIsInitialScrollDone(false); // Reset initial scroll flag
      }

      setNextCursor(pagination.nextCursor);
      setHasMore(pagination.hasMore);
    } catch (err) {
      console.log(err);
    }
  };

  const loadMoreMessages = useCallback(async () => {
    if (!hasMore || isLoadingMore || !nextCursor || !toUserId) return;

    setIsLoadingMore(true);
    
    // Store current scroll position
    const container = messagesContainerRef.current;
    const previousScrollHeight = container.scrollHeight;
    const previousScrollTop = container.scrollTop;

    await fetchChatHistory(toUserId, nextCursor);

    // Restore scroll position after new messages are loaded
    setTimeout(() => {
      const newScrollHeight = container.scrollHeight;
      const scrollDifference = newScrollHeight - previousScrollHeight;
      container.scrollTop = previousScrollTop + scrollDifference;
      setIsLoadingMore(false);
    }, 0);
  }, [hasMore, isLoadingMore, nextCursor, toUserId]);

  useEffect(() => {
    if (!user?._id || !toUserId) return;
    // Reset states when switching chats
    setIsInitialScrollDone(false);
    hasUserScrolledUpRef.current = false;
    fetchChatHistory(toUserId);
  }, [user?._id, toUserId]);

  // Intersection Observer for load more when scrolling up
  useEffect(() => {
    // Don't set up observer until initial scroll is complete and user has scrolled up
    if (!hasMore || !isInitialScrollDone) return;

    const container = messagesContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        // Only trigger if user has scrolled up from bottom
        const isNearTop = container.scrollTop < 200;
        if (
          firstEntry.isIntersecting &&
          hasMore &&
          !isLoadingMore &&
          isNearTop &&
          hasUserScrolledUpRef.current &&
          isInitialScrollDone
        ) {
          loadMoreMessages();
        }
      },
      {
        root: container,
        rootMargin: "50px",
        threshold: 0.1,
      }
    );

    const triggerElement = loadMoreTriggerRef.current;
    if (triggerElement) {
      observer.observe(triggerElement);
    }

    return () => {
      if (triggerElement) {
        observer.unobserve(triggerElement);
      }
    };
  }, [hasMore, isLoadingMore, loadMoreMessages, messages.length, isInitialScrollDone]);

  useEffect(() => {
    if (!user?._id || !toUserId) return;
    socket.emit("join-chat", { userId: user?._id, toUserId: toUserId });
    socket.on("received-message", (message) => {
      console.log(message);
      shouldScrollToBottomRef.current = true;
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    return () => {
      socket.disconnect();
    };
  }, [user?._id, toUserId]);

  // Scroll to bottom when new messages arrive (socket messages or initial load)
  useEffect(() => {
    if (shouldScrollToBottomRef.current && messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: isInitialLoadRef.current ? "auto" : "smooth" });
        if (isInitialLoadRef.current) {
          isInitialLoadRef.current = false;
          // Mark initial scroll as done after a delay to ensure scroll is complete
          setTimeout(() => {
            setIsInitialScrollDone(true);
          }, 300);
        }
        shouldScrollToBottomRef.current = false;
      }, 100);
    }
  }, [messages.length]);

  // Track scroll position to detect when user scrolls up from bottom
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Check if user has scrolled up from bottom
      const scrollBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
      const isNearBottom = scrollBottom < 100;
      
      // Mark that user has scrolled up if they're not near bottom
      if (!isNearBottom) {
        hasUserScrolledUpRef.current = true;
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [messages.length]);

  const handleSendMessage = () => {
    if (!newMessage) return;
    if (!user?._id || !toUserId) return;
    socket.emit("send-message", {
      firstName: user?.firstName,
      lastName: user?.lastName,
      userId: user?._id,
      toUserId: toUserId,
      createdAt: new Date(),
      text: newMessage,
    });
    setNewMessage("");
  };
  return (
    <>
      <div className="w-1/2 mx-auto border border-gray-300 rounded-lg m-5 h-[80vh]">
        <div className="flex justify-between items-center border-b border-gray-300 p-2">
          <h1 className="text-2xl font-bold">{searchParams.get("name")}</h1>
          <span
            className="cursor-pointer text-blue-500"
            onClick={() => navigate("/connections")}
          >
            Back
          </span>
        </div>
        <div
          ref={messagesContainerRef}
          className="p-2 h-[60vh] overflow-y-auto"
        >
          {/* Load more trigger - invisible element at the top for Intersection Observer */}
          {/* Only render trigger after initial scroll is complete to prevent premature API calls */}
          {hasMore && isInitialScrollDone && (
            <div ref={loadMoreTriggerRef} className="h-10 w-full"></div>
          )}
          
          {/* Loading indicator */}
          {isLoadingMore && (
            <div className="text-center py-2 text-gray-500">
              Loading older messages...
            </div>
          )}

          {messages?.map((message) => (
            <div
              className={`chat ${
                message?.firstName === user?.firstName
                  ? "chat-end"
                  : "chat-start"
              }`}
              key={message._id}
            >
              <div className="chat-header">
                {message?.firstName} {message?.lastName}
                <time className="text-xs opacity-50">
                  {message?.createdAt
                    ? moment(message?.createdAt).format("DD/MM/YYYY HH:mm")
                    : ""}
                </time>
              </div>
              <div className="chat-bubble">{message?.text}</div>
            </div>
          ))}
          
          {/* Scroll anchor for new messages */}
          <div ref={messagesEndRef}></div>
        </div>
        <div className="p-2 border-t border-gray-300"></div>
        <div className="flex m-2 justify-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full input input-bordered w-1/2 mr-2"
            placeholder="Message"
          />
          <button className="btn btn-primary" onClick={handleSendMessage}>
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default Chat;
