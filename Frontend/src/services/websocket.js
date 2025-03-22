import { io } from "socket.io-client";

const API_URL = import.meta.env.PROD
  ? "https://api.lawsphere.org" // Change to your production API URL
  : "http://localhost:5000";

// Create a WebSocket connection to the community namespace
const communitySocket = io(`${API_URL}/community`, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Connection event handlers
communitySocket.on("connect", () => {
  console.log("Connected to community WebSocket server");
});

communitySocket.on("connect_error", (error) => {
  console.error("Connection error:", error);
});

communitySocket.on("disconnect", (reason) => {
  console.log("Disconnected from WebSocket server:", reason);
});

// Event handlers setup - to be called from UI components
const setupTopicListeners = (callbacks = {}) => {
  // Listen for new topics
  communitySocket.on("new-topic", (topic) => {
    console.log("New topic received:", topic);
    if (callbacks.onNewTopic) callbacks.onNewTopic(topic);
  });

  // Listen for topic vote updates
  communitySocket.on("topic-vote-update", (data) => {
    console.log("Topic vote update:", data);
    if (callbacks.onTopicVoteUpdate) callbacks.onTopicVoteUpdate(data);
  });
};

// Topic detail event listeners
const setupTopicDetailListeners = (topicId, callbacks = {}) => {
  // Join the topic room
  communitySocket.emit("join-topic", topicId);

  // Listen for new replies
  communitySocket.on("new-reply", (data) => {
    console.log("New reply received:", data);
    if (callbacks.onNewReply && data.topicId === topicId) {
      callbacks.onNewReply(data);
    }
  });

  // Listen for reply vote updates
  communitySocket.on("reply-vote-update", (data) => {
    console.log("Reply vote update:", data);
    if (callbacks.onReplyVoteUpdate && data.topicId === topicId) {
      callbacks.onReplyVoteUpdate(data);
    }
  });

  // Return cleanup function
  return () => {
    communitySocket.emit("leave-topic", topicId);
    communitySocket.off("new-reply");
    communitySocket.off("reply-vote-update");
  };
};

// Cleanup topic list listeners
const cleanupTopicListeners = () => {
  communitySocket.off("new-topic");
  communitySocket.off("topic-vote-update");
};

// Connect to WebSocket server - call this when user logs in
const connectWebSocket = () => {
  if (!communitySocket.connected) {
    communitySocket.connect();
  }
};

// Disconnect from WebSocket server - call this when user logs out
const disconnectWebSocket = () => {
  communitySocket.disconnect();
};

export const communityWebSocket = {
  connectWebSocket,
  disconnectWebSocket,
  setupTopicListeners,
  cleanupTopicListeners,
  setupTopicDetailListeners,
};
