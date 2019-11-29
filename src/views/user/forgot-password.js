import React, { Component } from "react";
import { Row, Card, CardTitle, Form, Label, Input, Button } from "reactstrap";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { forgotUserPassword } from "../../redux/actions";
import { Colxx } from "../../components/common/CustomBootstrap";
import IntlMessages from "../../helpers/IntlMessages";

class Forgot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ""
    };
  }

  onUserForgot = (e) => {
    e.preventDefault()
    if(this.state.email !== "") {
      console.log('submit forgot')
      this.props.forgotUserPassword(this.state, this.props.history);
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
                <IntlMessages id="user.forgot-password" />
              </CardTitle>
              <Form onSubmit={this.onUserForgot}>
                <Label className="form-group has-float-label mb-4">
                  <Input onChange={this.inputChange} name="email" type="email" defaultValue={this.state.email} />
                  <IntlMessages id="user.email" />
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
    forgotUserPassword
  }
)(Forgot);
