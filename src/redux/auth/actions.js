import {
  LOGIN_USER,
  LOGIN_REQUIRE_TWOFACTOR,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAILURE,
  LOGOUT_USER,
  REGISTER_USER,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAILURE,
  FORGOT_USER_PASSWORD,
  FORGOT_USER_PASSWORD_SUCCESS,
  FORGOT_USER_PASSWORD_FAILURE,
  RESET_USER_PASSWORD,
  RESET_USER_PASSWORD_SUCCESS,
  RESET_USER_PASSWORD_FAILURE,
  VERIFY_USER_EMAIL,
  VERIFY_USER_EMAIL_SUCCESS,
  VERIFY_USER_EMAIL_FAILURE,
} from '../actions';

export const loginUserTwoFactor = (require2FA) => ({
  type: LOGIN_REQUIRE_TWOFACTOR,
  payload: require2FA
})

export const loginUser = (user, history) => ({
  type: LOGIN_USER,
  payload: { user, history }
});

export const loginUserSuccess = (user) => ({
  type: LOGIN_USER_SUCCESS,
  payload: user
});

export const loginUserFailure = (user) => ({
  type: LOGIN_USER_FAILURE,
  payload: user
});

export const verifyUserEmail = (user, history) => ({
  type: VERIFY_USER_EMAIL,
  payload: { user, history }
});

export const verifyUserEmailSuccess = (user) => ({
  type: VERIFY_USER_EMAIL_SUCCESS,
  payload: user
});

export const verifyUserEmailFailure = (user) => ({
  type: VERIFY_USER_EMAIL_FAILURE,
  payload: user
});

export const registerUser = (user, history) => ({
  type: REGISTER_USER,
  payload: { user, history }
})

export const registerUserSuccess = (user) => ({
  type: REGISTER_USER_SUCCESS,
  payload: user
})

export const registerUserFailure = (user) => ({
  type: REGISTER_USER_FAILURE,
  payload: user
})

export const forgotUserPassword = (user, history) => ({
  type: FORGOT_USER_PASSWORD,
  payload: { user, history }
})

export const forgotUserPasswordSuccess = (user) => ({
  type: FORGOT_USER_PASSWORD_SUCCESS,
  payload: user
})

export const forgotUserPasswordFailure = (user) => ({
  type: FORGOT_USER_PASSWORD_FAILURE,
  payload: user
})

export const resetUserPassword = (user, history) => ({
  type: RESET_USER_PASSWORD,
  payload: { user, history }
})

export const resetUserPasswordSuccess = (user) => ({
  type: RESET_USER_PASSWORD_SUCCESS,
  payload: user
})

export const resetUserPasswordFailure = (user) => ({
  type: RESET_USER_PASSWORD_FAILURE,
  payload: user
})

export const logoutUser = (history) => ({
  type: LOGOUT_USER,
  payload : {history}
});
