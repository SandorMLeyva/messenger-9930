const SET_ACTIVE_CHAT = "SET_ACTIVE_CHAT";

export const setActiveChat = (userId) => {
  return {
    type: SET_ACTIVE_CHAT,
    userId
  };
};

const reducer = (state = "", action) => {
  switch (action.type) {
    case SET_ACTIVE_CHAT: {
      return action.userId;
    }
    default:
      return state;
  }
};

export default reducer;
