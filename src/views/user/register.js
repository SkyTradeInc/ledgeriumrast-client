import React, { Component } from "react";
import { Row, Card, CardTitle, Form, Label, Input, Button } from "reactstrap";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { registerUser } from "../../redux/actions";
import IntlMessages from "../../helpers/IntlMessages";
import { Colxx } from "../../components/common/CustomBootstrap";
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
      loading: false,
      message: ""
    };
  }

  onUserRegister = (e) =>{
    e.preventDefault()
    if (this.state.username !== "" && this.state.email !== "" && this.state.password !== "" && this.state.passwordConfirm !== "") {
      this.setState({
        message: ''
      })
      this.props.registerUser(this.state, this.props.history);
    }
  }

  inputChange = (e) => {
   const { name, value } = e.currentTarget
   this.setState({ [name]:value })
  }

  render() {
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
                <IntlMessages id="user.register" />
              </CardTitle>
              <Form onSubmit={this.onUserRegister}>
                {this.state.message === "" ? <p><br/></p> : <p>{this.state.message}</p>}
                <Label className="form-group has-float-label mb-4">
                  <Input
                    name="username"
                    type="username"
                    defaultValue={this.state.username}
                    onChange={this.inputChange}
                 />
                  <IntlMessages id="user.username" />
                </Label>
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
                    defaultValue={this.state.password}
                    onChange={this.inputChange}
                  />
                  <IntlMessages
                    id="user.password"
                  />
                </Label>
                <Label className="form-group has-float-label mb-4">
                  <Input
                    name="passwordConfirm"
                    type="password"
                    onChange={this.inputChange}
                    defaultValue={this.state.passwordConfirm}
                  />
                  <IntlMessages
                    id="user.password-confirm"
                  />
                </Label>
                <div className="d-flex justify-content-between align-items-center">
                  <NavLink to={`/`}>
                    <IntlMessages id="user.login-title" />
                  </NavLink>
                  <Button
                    type="submit"
                    color="primary"
                    className="btn-shadow"
                    size="lg"
                    disabled={this.state.loading}
                  >
                    <IntlMessages id="user.register-button" />
                  </Button>
                </div>
              </Form>
            </div>
          </Card>
        </Colxx>
      </Row>
    );
  }
}
const mapStateToProps = ({ authUser }) => {
  const { user, loading } = authUser;
  return { user, loading };
};

export default connect(
  mapStateToProps,
  {
    registerUser
  }
)(Register);
