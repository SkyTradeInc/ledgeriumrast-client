import React, { Component } from "react";
import { Row, Card, CardTitle, Form, Label, Input, Button } from "reactstrap";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { verifyUserEmail, verifyUserEmailFailure } from "../../redux/actions";
import { Colxx } from "../../components/common/CustomBootstrap";
import IntlMessages from "../../helpers/IntlMessages";
import queryString from 'query-string';

class Verify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailVerifiedToken: "",
      email: "",
    };
  }

  componentDidUpdate(){
      console.log(this.props)
  }

  componentWillMount() {
    const parsed = queryString.parse(window.location.search);
    const {email, emailVerifiedToken} = parsed
    this.setState({
      email,
      emailVerifiedToken,
    })
  }

  onUseVerify = (e) => {
    e.preventDefault()
    if(this.state.email !== "") {
      this.props.verifyUserEmail(this.state, this.props.history);
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
                <IntlMessages id="user.email-verification" />
              </CardTitle>
              <Form onSubmit={this.onUseVerify}>
                <Label className="form-group has-float-label mb-4">
                  <Input name="resetToken" type="text" value={this.state.emailVerifiedToken} />
                  <IntlMessages id="user.email-verification-token" />
                </Label>
                <Label className="form-group has-float-label mb-4">
                  <Input name="resetToken" type="text" value={this.state.email} />
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
                    <IntlMessages id="user.verify-email-button" />
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
  const { user, loading, status} = authUser;
  return { user, loading, status };
};

export default connect(
  mapStateToProps,
  {
    verifyUserEmail,
    verifyUserEmailFailure,
  }
)(Verify);
