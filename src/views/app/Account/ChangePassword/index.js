import React, { Component } from 'react';
import { CardTitle, Button, Form, Label, Input} from "reactstrap";
import IntlMessages from "../../../../helpers/IntlMessages";
import api from "../../../../components/api";

class AccountExtend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPassword: '',
      password: '',
      passwordConfirm: '',
      loading: false,
      message: '',
    }
  }

  onUserChangePassword() {
    if (this.state.oldPassword !== "" && this.state.password !== "" && this.state.passwordConfirm !== "") {
      this.setState({
        loading: true,
        message: '',
      })
      api.put('/user/update', {
        oldPassword: this.state.oldPassword,
        password: this.state.password,
        passwordConfirm: this.state.passwordConfirm
      }, {
        headers: {
          token: localStorage.getItem('token')
        }
      })
      .then(response => {
        if(response.data.success) {
          this.setState({
            oldPassword: '',
            password: '',
            passwordConfirm: '',
            loading: false,
            message: response.data.message
          })
        } else {
          this.setState({
            message: response.data.message,
            loading: false,
          })
        }
      })
      .catch(error => {
        this.setState({
          message: 'Something went wrong, please try again soon',
          loading: false,

        })
      })
    }
  }

  inputChange = (e) => {
   const { name, value } = e.currentTarget
   this.setState({ [name]:value })
  }

  render() {
    return (
      <Form>
        <CardTitle>
        Change Password
        </CardTitle>
        <div>
        {this.state.message === "" ? <div><br/><br/></div> : <p>{this.state.message}</p>}
        </div>
        <Label className="form-group has-float-label mb-4">
          <Input onChange={this.inputChange} name="oldPassword" type="password" defaultValue={this.state.password}/>
          <IntlMessages id="user.password-current" />
        </Label>
        <Label className="form-group has-float-label mb-4">
          <Input onChange={this.inputChange} name="password" type="password" defaultValue={this.state.password} />
          <IntlMessages id="user.password-new" />
        </Label>
        <Label className="form-group has-float-label mb-4">
          <Input onChange={this.inputChange} name="passwordConfirm" type="password" defaultValue={this.state.passwordConfirm} />
          <IntlMessages id="user.password-new-confirm" />
        </Label>

        <div className="d-flex justify-content-end align-items-center">

          <Button
            color="primary"
            disabled={this.state.loading}
            className="btn-shadow"
            size="lg"
            onClick={() => this.onUserChangePassword()}
          >
            <IntlMessages id="user.change-password-button" />
          </Button>
        </div>
      </Form>
    )
  }

}

export default AccountExtend;
