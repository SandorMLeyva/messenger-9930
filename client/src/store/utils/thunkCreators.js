import axios from "axios";
import socket from "../../socket";
import {
  gotConversations,
  addConversation,
  setNewMessage,
  setSearchedUsers,
  readMessages,
} from "../conversations";
import { gotUser, setFetchingStatus } from "../user";
import { setActiveChat } from "../activeConversation";

axios.interceptors.request.use(async function (config) {
  const token = await localStorage.getItem("messenger-token");
  config.headers["x-access-token"] = token;

  return config;
});

// USER THUNK CREATORS

export const fetchUser = () => async (dispatch) => {
  dispatch(setFetchingStatus(true));
  try {
    const { data } = await axios.get("/auth/user");
    dispatch(gotUser(data));
    if (data.id) {
      socket.emit("go-online", data.id);
    }
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setFetchingStatus(false));
  }
};

export const register = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/auth/register", credentials);
    await localStorage.setItem("messenger-token", data.token);
    dispatch(gotUser(data));
    socket.emit("go-online", data.id);
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const login = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/auth/login", credentials);
    await localStorage.setItem("messenger-token", data.token);
    dispatch(gotUser(data));
    socket.emit("go-online", data.id);
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const logout = (id) => async (dispatch) => {
  try {
    await axios.delete("/auth/logout");
    await localStorage.removeItem("messenger-token");
    dispatch(gotUser({}));
    socket.emit("logout", id);
  } catch (error) {
    console.error(error);
  }
};

// CONVERSATIONS THUNK CREATORS

export const fetchConversations = () => async (dispatch) => {
  try {
    const { data } = await axios.get("/api/conversations");
    data.forEach((convo) => {
      joinToConversation(convo.id);
    });
    dispatch(gotConversations(data));
  } catch (error) {
    console.error(error);
  }
};

const saveMessage = async (body) => {
  const { data } = await axios.post("/api/messages", body);
  return data;
};

const sendMessage = (data) => {
  socket.emit("new-message", {
    message: data.message,
    sender: data.sender,
  });
};

const joinToConversation = (conversationId, requestUser) => {
  socket.emit("join-conversation", conversationId, requestUser);
};

// message format to send: {recipientId, text, conversationId}
// conversationId will be set to null if its a brand new conversation
export const postMessage = (body) => async (dispatch) => {
  try {
    const data = await saveMessage(body);

    if (!body.conversationId) {
      joinToConversation(data.message.conversationId, body.recipientId);
      dispatch(addConversation(body.recipientId, data.message));
      setTimeout(() => sendMessage(data), 500);
    } else {
      dispatch(setNewMessage(true, data.message));
      sendMessage(data);
    }
  } catch (error) {
    console.error(error);
  }
};

export const activeChat = (conversation) => async (dispatch) => {
  try {
    // mark messages as read
    if (conversation.id) {
      await readMessage(conversation, true, false)(dispatch);
      dispatch(setActiveChat(conversation.otherUser.id));
    }
  } catch (error) {
    console.error(error);
  }
};

export const readMessage = (conversation, local, isActiveChat) => async (dispatch) => {
  await axios.post("/api/conversations/mark", {
    conversationId: conversation.id,
    user: conversation.otherUser,
  });
  socket.emit("read-message", {
    conversationId: conversation.id,
    userId: conversation.otherUser.id,
  });
  dispatch(readMessages(conversation.id, conversation.otherUser.id, local, isActiveChat));
};

export const searchUsers = (searchTerm) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/users/${searchTerm}`);
    dispatch(setSearchedUsers(data));
  } catch (error) {
    console.error(error);
  }
};
