import React, { Component } from "react";
import { Row, Card, CardTitle, Form, Label, Input, Button } from "reactstrap";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { loginUser, loginUserTwoFactor } from "../../redux/actions";
import { Colxx } from "../../components/common/CustomBootstrap";
import IntlMessages from "../../helpers/IntlMessages";
import ReactCodeInput from 'react-verification-code-input';
import { loadReCaptcha, ReCaptcha } from 'react-recaptcha-v3'
import { reCaptchaKey } from "../../constants/defaultValues"
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      require2FA: false,
      password: '',
      message: '',
      twoFactor: '',
      reCaptchaToken: ''
    };
    let recaptchaInstance;
  }

  componentWillMount() {
    loadReCaptcha(reCaptchaKey);

  }

  componentWillUnmount() {
    this.unloadReCaptcha(reCaptchaKey);

  }

  componentWillUpdate(prevProps) {
    if(this.props.status !== prevProps.status && this.props.status === "login_failed") {
      this.recaptchaInstance.execute()
    }
  }

  verifyLoad = () => {
    console.log('Loaded ReCaptcha')
  }

  unloadReCaptcha = (reCaptchaKey) => {
    const nodeBadge = document.querySelector('.grecaptcha-badge');
    if (nodeBadge) {
      document.body.removeChild(nodeBadge.parentNode);
    }

    const scriptSelector = 'script[src=\'https://www.google.com/recaptcha/api.js?render=' +
    reCaptchaKey + '\']';
    const script = document.querySelector(scriptSelector);
    if (script) {
      script.remove();
    }
  }

  onUserLogin = (e) => {
    e.preventDefault()
    if (this.state.email !== "" && this.state.password !== "") {
      this.setState({
        message: ''
      })
      this.props.loginUser(this.state, this.props.history);
    }
  }

  onUserLogin2fa() {
      this.props.loginUser(this.state, this.props.history);
  }

  inputChange = (e) => {
   const { name, value } = e.currentTarget
   this.setState({ [name]:value })
  }

  set2FAandSubmit = (twoFactor) => {
    this.setState({
      twoFactor
    }, this.onUserLogin2fa)
  }

  verifyCallback = (reCaptchaToken) => {
    this.setState({
      reCaptchaToken
    })
}

  render() {
    console.log(this.props)
    if(this.props.require2FA) {
      return (
        <Row className="h-100">
          <Colxx xxs="12" md="10" className="mx-auto my-auto">
            <Card className="auth-card">
              <div className="position-relative image-side ">
                <p className="text-white h2">Two-factor Authentication</p>
                <p className="white mb-0">
                <br/>
                Can't acess Google Authenticator? Contact support@ledgerium.io
                </p>
              </div>
              <div className="form-side">
                <NavLink to={`/`} className="white">
                  <span className="logo-single" />
                </NavLink>
                <CardTitle className="mb-4">
                  Google Authentication
                </CardTitle>
                <p> Input the 6-digit code in your Google Authenticator app </p>
                <p> <strong> Google Authentication Code </strong> </p>
                <ReactCodeInput autoFocus={true} onComplete={this.set2FAandSubmit}/>
                <ReCaptcha
                    ref={e => this.recaptchaInstance = e}
                    sitekey={reCaptchaKey}
                    action='action_name'
                    verifyCallback={this.verifyCallback}
                />
              </div>
            </Card>
          </Colxx>
        </Row>
      );
    } else {
      return (
        <Row className="h-100">

          <Colxx xxs="12" md="10" className="mx-auto my-auto">
            <Card className="auth-card">
              <div className="position-relative image-side ">
                <p className="text-white h2">Welcome to Rast</p>
                <p className="white mb-0">
                </p>
              </div>
              <div className="form-side">
                <NavLink to={`/`} className="white">
                  <span className="logo-single" />
                </NavLink>
                <CardTitle className="mb-4">
                  <IntlMessages id="user.login-title" />
                </CardTitle>
                <Form onSubmit={this.onUserLogin}>
                {this.props.errorMessage === "" ? <p><br/></p> : <p>{this.props.errorMessage}</p>}

                  <Label className="form-group has-float-label mb-4">
                    <Input
                      name="email"
                      type="email"
                      defaultValue={this.state.email}
                      onChange={this.inputChange}
                    />
                    <IntlMessages id="user.email" />
                  </Label>
                  <Label className="form-group has-float-label mb-4">
                    <Input
                    name="password"
                    type="password"
                    onChange={this.inputChange}
                    defaultValue={this.state.password}
                    />
                    <IntlMessages
                      id="user.password"

                    />
                  </Label>
                  <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <NavLink to={`/user/register`}>
                      <IntlMessages id="user.register" />
                    </NavLink>
                    {" "}|{" "}
                    <NavLink to={`/user/forgot-password`}>
                      <IntlMessages id="user.forgot-password-question" />
                    </NavLink>
                  </div>
                    <Button
                      type="submit"
                      color="primary"
                      className="btn-shadow"
                      size="lg"
                    >
                      <IntlMessages id="user.login-button" />
                    </Button>
                  </div>
                </Form>
                <ReCaptcha
                    ref={e => this.recaptchaInstance = e}
                    sitekey={reCaptchaKey}
                    action='action_name'
                    verifyCallback={this.verifyCallback}
                    onloadCallback={this.verifyLoad}
                />
              </div>
            </Card>
          </Colxx>
        </Row>
      );
    }
  }
}
const mapStateToProps = ({ authUser }) => {
  const { user, loading, require2FA, errorMessage, status } = authUser;
  return { user, loading, require2FA, errorMessage, status };
};

export default connect(
  mapStateToProps,
  {
    loginUserTwoFactor,
    loginUser
  }
)(Login);
