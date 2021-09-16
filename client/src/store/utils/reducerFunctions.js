export const addMessageToStore = (state, payload) => {
  const { message, sender, local } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
      latestMessageText: message.text,
      unreadMessageCount: 1,
    };
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const convoCopy = { ...convo };
      convoCopy.messages.push(message);
      convoCopy.latestMessageText = message.text;
      if (!local) convoCopy.unreadMessageCount++;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const convoCopy = { ...convo };
      convoCopy.id = message.conversationId;
      convoCopy.messages.push(message);
      convoCopy.latestMessageText = message.text;
      convoCopy.unreadMessageCount = 0;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

// Change state of messages and set the count of unread messages to 0
// [local] is a flag to define whether the user is local or not
export const setReadMessages = (state, payload) => {
  const { conversationId, userId, local, isActiveChat } = payload;
  const index = state.findIndex((convo) => convo.id === conversationId);
  const convoCopy = {
    ...state[index],
  };

  if (local) {
    if (convoCopy.unreadMessageCount > 0) {
      convoCopy.unreadMessageCount = 0;
      state[index] = convoCopy;
      return [...state];
    }
  } else {
    const isRead = convoCopy.messages? convoCopy.messages.some((msg) => !msg.read && msg.senderId === userId): false;
    // if at least one message is unread, change the state
    if (isRead) {
      convoCopy.unreadMessageCount = isActiveChat
        ? 0
        : convoCopy.unreadMessageCount;

      convoCopy.messages = convoCopy.messages.map((message) => {
        if (message.senderId === userId && !message.read) {
          return {
            ...message,
            read: true
          }
        }
        return message;
      });

      state[index] = convoCopy;
      return [...state];
    }
  }
  return state;
};
