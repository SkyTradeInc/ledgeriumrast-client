import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import {
    LOGIN_USER,
    REGISTER_USER,
    LOGOUT_USER,
    FORGOT_USER_PASSWORD,
    RESET_USER_PASSWORD,
    VERIFY_USER_EMAIL,
} from '../actions';

import {
    loginUserTwoFactor,
    forgotUserPassword,
    loginUserSuccess,
    loginUserFailure,
    registerUserSuccess,
    registerUserFailure,
    forgotUserPasswordSuccess,
    forgotUserPasswordFailure,
    resetUserPasswordSuccess,
    resetUserPasswordFailure,
    verifyUserEmailSuccess,
    verifyUserEmailFailure,

} from './actions';

import api from '../../components/api'

const resetUserPasswordWithTokenAsync = async(resetToken, email, password, passwordConfirm) =>
    api.post('/user/reset', {resetToken, email, password, passwordConfirm})
      .then(authUser => authUser)
      .catch(error => error)

function* resetUserPasswordWithToken({payload}) {
  const {resetToken, email, password, passwordConfirm} = payload.user
  const { history } = payload;
  try {
    const response = yield call(resetUserPasswordWithTokenAsync, resetToken, email, password, passwordConfirm)
    if(response.data.success) {
      yield(resetUserPasswordSuccess(response.data));
      history.push('/user/login');
    } else {
      yield(resetUserPasswordFailure(response.data.message));
    }
  } catch (error) {
    console.log('Reset password error : ', error)
  }
}

const verifyUserEmailWithTokenAsync = async(emailVerifiedToken, email) =>
    api.post('/user/verifyEmail', {emailVerifiedToken, email })
      .then(authUser => authUser)
      .catch(error => error)

function* verifyUserEmailWithToken({payload}) {
  const {emailVerifiedToken, email} = payload.user
  const { history } = payload;
  try {
    const response = yield call(verifyUserEmailWithTokenAsync, emailVerifiedToken, email)
    if(response.data.success) {
      yield(verifyUserEmailSuccess(response.data));
      history.push('/user/login');
    } else {
      yield(verifyUserEmailFailure(response.data.message));
    }
  } catch (error) {
    console.log('Email verification error: ', error)
  }
}

const forgotUserPasswordWithEmailAsync = async(email) =>
    api.post('user/forgot', {email})
      .then(authUser => authUser)
      .catch(error => error)

function* forgotUserPasswordWithEmail({ payload }) {
  const {email} = payload.user
  try {
    const response = yield call(forgotUserPasswordWithEmailAsync, email)
    if(response.data.success) {
      yield(forgotUserPasswordSuccess(response));
    } else {
      yield(forgotUserPasswordFailure(response));
    }

  } catch (error) {
    console.log('Forgot password error : ', error)

  }
}

const loginWithEmailPasswordAsync = async (email, password, twoFactor, reCaptchaToken) =>
    api.post('/user/login', {email, password, twoFactor, reCaptchaToken})
        .then(authUser => authUser)
        .catch(error => error);


function* loginWithEmailPassword({ payload }) {
    const { email, password, twoFactor, reCaptchaToken } = payload.user;
    const { history } = payload;
    try {
        const response = yield call(loginWithEmailPasswordAsync, email, password, twoFactor, reCaptchaToken);
        if (response.data.success) {
          if(response.data.data.require2FA) {
            yield put(loginUserTwoFactor());
          } else {
            localStorage.setItem('token', response.data.data.token);
            yield put(loginUserSuccess(response.data));
            history.push('/app');
          }
        } else {
            yield put(loginUserFailure(response.data.message));
        }
    } catch (error) {
        console.log('Login error : ', error)
    }
}


const registerWithEmailPasswordAsync = async (username, email, password, passwordConfirm) =>
      api.post('/user/register', {username, email, password, passwordConfirm})
          .then(authUser => authUser)
          .catch(error => error);

function* registerWithEmailPassword({ payload }) {
    const { username, email, password, passwordConfirm } = payload.user;
    const { history } = payload
    try {
        const response = yield call(registerWithEmailPasswordAsync, username, email, password, passwordConfirm);
        if (response.data.success) {
            localStorage.setItem('token', response.data.data.token);
            yield put(registerUserSuccess(response));
            history.push('/app');
        } else {
            yield put(registerUserFailure(response.data));
        }
    } catch (error) {
        console.log('Register error : ', error)
    }
}



const logoutAsync = async (history) => {
    history.push('/')
}

function* logout({payload}) {
    const { history } = payload
    try {
        yield call(logoutAsync,history);
        localStorage.removeItem('token');
    } catch (error) {
    }
}



export function* watchRegisterUser() {
    yield takeEvery(REGISTER_USER, registerWithEmailPassword);
}

export function* watchLoginUser() {
    yield takeEvery(LOGIN_USER, loginWithEmailPassword);
}

export function* watchLogoutUser() {
    yield takeEvery(LOGOUT_USER, logout);
}

export function* watchForgotUserPassword() {
  yield takeEvery(FORGOT_USER_PASSWORD, forgotUserPasswordWithEmail);
}

export function* watchResetUserPassword() {
  yield takeEvery(RESET_USER_PASSWORD, resetUserPasswordWithToken);
}

export function* watchVerifyUserEmail() {
  yield takeEvery(VERIFY_USER_EMAIL, verifyUserEmailWithToken);
}


export default function* rootSaga() {
    yield all([
        fork(watchVerifyUserEmail),
        fork(watchResetUserPassword),
        fork(watchForgotUserPassword),
        fork(watchLoginUser),
        fork(watchLogoutUser),
        fork(watchRegisterUser)
    ]);
}
