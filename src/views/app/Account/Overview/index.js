import React, { Component } from 'react';
import api from "../../../../components/api";
import { CardTitle } from "reactstrap";

class AccountExtend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountInfo: {
        emailVerified: false,
        apiKeysEnabled: false,
        canDeposit: false,
        canTrade: true,
        canWithdraw: false,
        twoFactorEnabled: false
      }
    }
  }

  componentDidMount() {
    api.get('/user/accountInfo', {
      headers: {
        token: localStorage.getItem('token')
      }
    })
      .then(response => {
        if(response.data.success) {
          this.setState({
            accountInfo: response.data.data
          })
        }
      })
      .catch(console.log)
  }



  render() {
    return (
      <div>
        <CardTitle>
          Account Overview
        </CardTitle>
        <p>Email Verified {this.state.accountInfo.emailVerified ? <i className="fas fa-check"/> : <i className="fas fa-times"/> }</p>
        <p>Two Factor Authentication {this.state.accountInfo.twoFactorEnabled ? <i className="fas fa-check"/> : <i className="fas fa-times"/> }</p>
        <p>API Keys {this.state.accountInfo.apiKeysEnabled ? <i className="fas fa-check"/> : <i className="fas fa-times"/> }</p>


      </div>
    )
  }

}

export default AccountExtend;
