import React, { Component } from 'react';
import api from "../../../../components/api";
import {baseURL} from "../../../../constants/defaultValues"
import axios from 'axios'
import { CardTitle, Button } from "reactstrap";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import ReactTooltip from 'react-tooltip'

class AccountExtend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiKeysEnabled: false,
      twoFactorEnabled: false,
      apiKey: '',
      secretKey: '',
      message: '',
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
            twoFactorEnabled: response.data.data.twoFactorEnabled,
            apiKeysEnabled: response.data.data.apiKeysEnabled,
            apiKey: response.data.data.apiKey
          })
        }
      })
      .catch(console.log)
  }


  deleteAPIKeys = () => {
    axios.delete(`${baseURL}/user/apiKeys`, {
      headers: {token: localStorage.getItem('token')}
    })
    .then(response => {
      if(response.data.success) {
        this.setState({
          apiKeysEnabled: false,
          apiKey: '',
          secretKey: '',
        })
      }
    })
  }

  createAPIKeys = () => {
    api.get('/user/apiKeys', {
      headers: {
        token: localStorage.getItem('token')
      }
    })
      .then(response => {
        if(response.data.success) {
          this.setState({
            apiKeysEnabled: true,
            apiKey: response.data.data.apiKey,
            secretKey: response.data.data.secretKey,
          })
        } else {
          this.setState({
            message: response.data.message
          })
        }
      })
  }

  render() {
    if(this.state.apiKeysEnabled) {
      return (
        <div>
        <ReactTooltip />

          <CardTitle> API Key </CardTitle>
          <CopyToClipboard text={this.state.apiKey}
            onCopy={() => this.setState({copied: true})}>
            <a data-tip="Copy to Clipboard" href="#">{this.state.apiKey} <i className="white far fa-clipboard"/> </a>
          </CopyToClipboard>

          <br/><br/>
          <CardTitle> Secret Key </CardTitle>
          {this.state.secretKey !== '' ? <CopyToClipboard text={this.state.secretKey}
            onCopy={() => this.setState({copied: true})}>
            <a data-tip="Copy to Clipboard" href="#">{this.state.secretKey} <i className="white far fa-clipboard"/> </a>
          </CopyToClipboard> : null}
          {this.state.secretKey === '' ? <p> For Security purposes, you cannot retrieve your Secret Key. You will have to generate a new set of keys if you have lost them.</p> : null}

          <br/>
          {this.state.secretKey !== '' ? <p><br/> Store your Secret Key somewhere safe. It will not be shown again. </p> : null }

          <Button
            color="primary"
            className="btn-shadow"
            size="lg"
            onClick={this.deleteAPIKeys}
          >
          Delete Keys
          </Button>
        </div>

      )
    } else {
      return(
        <div>
          <CardTitle>
          Create API Keys
          </CardTitle>
          {this.state.message === "" ? <p></p> : <p>{this.state.message}</p>}
          <p>
          Creating an API private key provides access to markets and real-time trading services on Cortrex via a third-party site or application. <a href="https://docs.cortrex.org" target="_blank">View API documentation.</a>
          </p>
          {!this.state.twoFactorEnabled ? <p>You must have Google Authenticator enabled to create API keys</p> : null}

          <Button
            color="primary"
            className="btn-shadow"
            size="lg"
            disabled={!this.state.twoFactorEnabled}
            onClick={this.createAPIKeys}
          >
          Create API keys
          </Button>
        </div>


      )
    }
  }


}

export default AccountExtend;
