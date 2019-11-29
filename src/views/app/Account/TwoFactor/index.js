import React, { Component } from 'react';
import { CardTitle, Button } from "reactstrap";
import api from "../../../../components/api";
import {baseURL} from "../../../../constants/defaultValues"
import ReactCodeInput from 'react-verification-code-input';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import ReactTooltip from 'react-tooltip'

import axios from 'axios'
class AccountExtend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialLoading: false,

      twoFactorEnabled: false,

      stepDisabled: 1,
      stepEnabled: 1,
      message: '',
      confirmationCode: '',
      secret: '',
      imageURI: '',
    }
  }

  componentWillMount() {
      api.get('/user/accountInfo', {
        headers: {
          token: localStorage.getItem('token')
        }
      })
      .then(response => {
        if(response.data.success) {
          this.setState({
            twoFactorEnabled: response.data.data.twoFactorEnabled
          })
        }
      })
      .catch(console.log)
  }

  get2FA() {
    api.get('/user/twoFactor', {
      headers: {
        token: localStorage.getItem('token')
      }
    })
      .then(response => {
        if(response.data.success) {
          console.log(response.data)
          this.setState({
            secret: response.data.data.secret.base32,
            imageURI: response.data.data.imageURI
          })
        }
      })
      .catch(console.log)
  }

  enable2FA() {

    if(this.state.confirmationCode.length === 6) {
      api.post('/user/twoFactor', {twoFactor: this.state.confirmationCode}, {
        headers: {
          token: localStorage.getItem('token')
        }
      })
        .then(response => {
          if(response.data.success) {
            window.location.replace('/app/account?tab=2fa')
          } else {
            this.setState({
              message: response.data.message
            })
          }
        })
        .catch(console.log)
    } else {
      return console.log('false')
    }

  }

  disable2FA() {
    if(this.state.confirmationCode.length === 6) {
      axios.delete(`${baseURL}/user/twoFactor`, {
        headers: {token: localStorage.getItem('token')},
        data: {twoFactor: `${this.state.confirmationCode}`}
      })
        .then(response => {
          if(response.data.success) {
            window.location.replace('/app/account?tab=2fa')
          } else {

              this.setState({
                message: response.data.message
              })
          }
        })
        .catch(console.log)
    } else {
      return console.log('false')
    }

  }

  nextstepDisabled = () => {

    if(this.state.stepDisabled === 1) {
      this.get2FA()
    }
    this.setState({
        message: '',
        stepDisabled: this.state.stepDisabled+1
    })
  }

  prevstepDisabled = () => {
    this.setState({
        message: '',
        stepDisabled: this.state.stepDisabled-1
    })
  }

  nextstepEnabled = () => {
    this.setState({
        message: '',
        stepEnabled: this.state.stepEnabled+1
    })
  }

  prevstepEnabled = () => {
    this.setState({
        message: '',
        stepEnabled: this.state.stepEnabled-1
    })
  }

  set2FA = (confirmationCode) => {
    this.setState({
      confirmationCode,
    })
  }

  render() {
    if(this.state.twoFactorEnabled) {
      return (<div>
        <ReactTooltip />
        {this.state.stepEnabled === 1 ?
          <div>
          <CardTitle>
          Google Authenticator: Enabled
          </CardTitle>
          <Button
            color="primary"
            className="btn-shadow"
            size="lg"
            onClick={() => this.nextstepEnabled()}
          >
          Disable
          </Button>
          </div>
         : null}

         {this.state.stepEnabled === 2 ?
           <div>
           <CardTitle>
           Disable Google Authenticator
           </CardTitle>
           <ReactCodeInput autoFocus={true} onComplete={this.set2FA}/>
           <p></p>
           <p>
           {this.state.message}
           </p>
           <p></p>
           <span className={"float-md-right"}>
           <Button
             color="primary"
             className="btn-shadow"
             size="lg"
             onClick={() => this.disable2FA()}
           >
           Confirm
           </Button>
           </span>
           <Button
             color="primary"
             className="btn-shadow"
             size="lg"
             onClick={() => this.prevstepEnabled()}
           >
           Cancel
           </Button>
           </div>
          : null}


      </div>)
    } else {
      return (<div>

        {this.state.stepDisabled === 1 ?
        <div>
        <CardTitle>
        Enable Google Authenticator - Step 1
        </CardTitle>
        <span> Download and install the Google Authenticator app </span>
        <div>
        <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2" target="_blank">
        <img alt="Download from Google Play" src="/assets/img/download-android.png"/></a> { "   "}
        <a href="https://apps.apple.com/us/app/google-authenticator/id388497605" target="_blank">
        <img alt="Download from Apple Store" src="/assets/img/download-apple.png"/></a>
        </div>
        <div className="d-flex justify-content-end align-items-center">
        <Button
          color="primary"
          className="btn-shadow"
          size="lg"
          onClick={() => this.nextstepDisabled()}
        >
        Next
        </Button>
        </div>

        </div> : null}

        {this.state.stepDisabled === 2 ?
        <div>
        <ReactTooltip />
        <CardTitle>
        Enable Google Authenticator - Step 2
        </CardTitle>
        <h3> Scan this QR code in the Google Authenticator app </h3>
        <img src={this.state.imageURI}/>
        <p></p>
        <p> If you are unable to scan the QR code, please enter this code manually into the app.</p>
        <p>
        <CopyToClipboard text={this.state.secret}
          onCopy={() => this.setState({copied: true})}>
          <a data-tip="Copy to Clipboard" href="#">{this.state.secret} <i className="white far fa-clipboard"/> </a>
        </CopyToClipboard>
        </p>
        <div className="d-flex justify-content-between align-items-center">
        <Button
          color="primary"
          className="btn-shadow"
          size="lg"
          onClick={() => this.prevstepDisabled()}
        >
        Back
        </Button>
        <Button
          color="primary"
          className="btn-shadow"
          size="lg"
          onClick={() => this.nextstepDisabled()}
        >
        Next
        </Button>
        </div>
        </div> : null}

        {this.state.stepDisabled === 3 ?
        <div>
        <ReactTooltip />
        <CardTitle>
        Enable Google Authenticator - Step 3
        </CardTitle>
        <p> Please write down your Google 2FA reset code on paper and store it in a safe place. The code will allow you to recover your Google Authenticator if you lose access to your device </p>
        <p>
        <CopyToClipboard text={this.state.secret}
          onCopy={() => this.setState({copied: true})}>
          <a data-tip="Copy to Clipboard" href="#">{this.state.secret} <i className="white far fa-clipboard"/> </a>
        </CopyToClipboard>
        </p>

        <div className="d-flex justify-content-between align-items-center">
        <Button
          color="primary"
          className="btn-shadow"
          size="lg"
          onClick={() => this.prevstepDisabled()}
        >
        Back
        </Button>
        <Button
          color="primary"
          className="btn-shadow"
          size="lg"
          onClick={() => this.nextstepDisabled()}
        >
        Next
        </Button>
        </div>
        </div> : null}

        {this.state.stepDisabled === 4 ?
        <div>
        <CardTitle>
        Enable Google Authenticator - Step 4
        </CardTitle>

        <ReactCodeInput autoFocus={true} onComplete={this.set2FA}/>
        <p></p>
        <p>
        {this.state.message}
        </p>
        <div className="d-flex justify-content-between align-items-center">
        <Button
          color="primary"
          className="btn-shadow"
          size="lg"
          onClick={() => this.prevstepDisabled()}
        >
        Back
        </Button>
        <Button
          color="primary"
          className="btn-shadow"
          size="lg"
          onClick={() => this.enable2FA()}
        >
        Enable now
        </Button>
        </div>
        </div> : null}

      </div>)
    }

  }

}

export default AccountExtend;
