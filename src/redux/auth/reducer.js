import {
    LOGIN_USER,
    LOGIN_REQUIRE_TWOFACTOR,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAILURE,
    REGISTER_USER,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAILURE,
    LOGOUT_USER,
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

const INIT_STATE = {
    user: localStorage.getItem('token'),
    errorMessage: '',
    require2FA: false,
    loading: false,
    status: ''
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case LOGIN_USER:
            return { ...state, loading: true, status: "login-new", errorMessage: ''};
        case LOGIN_REQUIRE_TWOFACTOR:
            return { ...state, loading: false, status: "", require2FA: true };
        case LOGIN_USER_SUCCESS:
            return { ...state, loading: false, status: "login_success", user: action.payload};
        case LOGIN_USER_FAILURE:
            return { ...state, loading: false, status: "login_failed", user: null, errorMessage: action.payload };
        case REGISTER_USER:
            return { ...state, loading: true };
        case REGISTER_USER_SUCCESS:
            return { ...state, loading: false, user: action.payload };
        case REGISTER_USER_FAILURE:
            return { ...state, loading: false, user: action.payload };
        case FORGOT_USER_PASSWORD:
            return { ...state, loading: true };
        case FORGOT_USER_PASSWORD_SUCCESS:
            return { ...state, loading: false, user: action.payload };
        case FORGOT_USER_PASSWORD_FAILURE:
            return { ...state, loading: false, user: action.payload };
        case RESET_USER_PASSWORD:
            return { ...state, loading: true };
        case RESET_USER_PASSWORD_SUCCESS:
            return { ...state, loading: false, user: action.payload };
        case RESET_USER_PASSWORD_FAILURE:
            return { ...state, loading: false, user: action.payload };
        case VERIFY_USER_EMAIL:
            return { ...state, loading: true, status: "verify-new" };
        case VERIFY_USER_EMAIL_SUCCESS:
            return { ...state, loading: false, status: "verify-success", user: action.payload };
        case VERIFY_USER_EMAIL_FAILURE:
            return { ...state, loading: false, status: "verify-failed", user: action.payload };
        case LOGOUT_USER:
            return { ...state ,user:null};
        default: return { ...state };
    }
}
