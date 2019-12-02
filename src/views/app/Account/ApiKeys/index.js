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
          Create an API key to gain access to the Rast develoepr endpoints
          </p>

          <Button
            color="primary"
            className="btn-shadow"
            size="lg"
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
