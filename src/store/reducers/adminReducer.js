export const adminReducer = (state = {}, action) => {
  switch (action.type) {
    case "storeMessage":
      return {
        ...state,
        message: action.payload,
      };
      break;
    default:
      return state;
  }
};
