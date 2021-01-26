export const loginReducer = (state = {}, action) => {
  switch (action.type) {
    case "updateSignupData":
      return {
        ...state,
        signupData: { ...action.payload },
        validSignupData: true,
      };
      break;
    case "clearSignupData":
      return {};
    default:
      return state;
  }
};
