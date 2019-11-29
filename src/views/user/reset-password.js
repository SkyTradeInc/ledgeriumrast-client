import React, { Component } from "react";
import { Row, Card, CardTitle, Form, Label, Input, Button } from "reactstrap";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { resetUserPassword } from "../../redux/actions";
import { Colxx } from "../../components/common/CustomBootstrap";
import IntlMessages from "../../helpers/IntlMessages";
import queryString from 'query-string';

class Reset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resetToken: "",
      email: "",
      password: "",
      passwordConfirm: ""
    };
  }

  componentWillMount() {
    const parsed = queryString.parse(window.location.search);
    const {email, resetToken} = parsed
    this.setState({
      email,
      resetToken
    })
  }

  onUserReset = (e) => {
    e.preventDefault()
    if(this.state.email !== "") {
      this.props.resetUserPassword(this.state, this.props.history);
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
                <IntlMessages id="user.reset-password" />
              </CardTitle>
              <Form onSubmit={this.onUserReset}>
                <Label className="form-group has-float-label mb-4">
                  <Input name="resetToken" type="text" value={this.state.resetToken} />
                  <IntlMessages id="user.reset-token" />
                </Label>
                <Label className="form-group has-float-label mb-4">
                  <Input name="resetToken" type="text" value={this.state.email} />
                  <IntlMessages id="user.email" />
                </Label>
                <Label className="form-group has-float-label mb-4">
                  <Input onChange={this.inputChange} name="password" type="password" defaultValue={this.state.password} />
                  <IntlMessages id="user.password-new" />
                </Label>
                <Label className="form-group has-float-label mb-4">
                  <Input onChange={this.inputChange} name="passwordConfirm" type="password" defaultValue={this.state.passwordConfirm} />
                  <IntlMessages id="user.password-new-confirm" />
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
                  >
                    <IntlMessages id="user.reset-password-button" />
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
    resetUserPassword
  }
)(Reset);
