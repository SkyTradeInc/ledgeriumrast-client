import React, { Component } from 'react';
import { CardTitle, Button, Form, Label, Input} from "reactstrap";
import IntlMessages from "../../../../helpers/IntlMessages";
import api from "../../../../components/api";
import Web3 from 'web3';

class AccountExtend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      enabled: false,
      publicKey: '',
      message: '',
      connected: false,
      localWeb3: null,
      walletKey: '',
    }
  }

  async connectToWallet() {
    if(window.ledgerium) {
      const localWeb3 = new Web3(window.ledgerium)
      try {
        await window.ledgerium.enable()
        this.setState({
          connected: true,
          walletKey: window.ledgerium.selectedAddress,
          localWeb3
        })
      } catch (error) {
        console.log(error)
      }
    }
  }

  fetchState() {
    api.get('/user/publicKey', {
      headers: {
        token: localStorage.getItem('token')
      }
    })
    .then(response => {
        const payload = response.data.data
        this.setState({
          loading: false,
          enabled: payload.enabled,
          publicKey: payload.publicKey
        })

      })
  }

  componentWillMount() {
    this.fetchState()
  }

  toggleMetamask() {
    this.connectToWallet()
  }

  enableMetamask() {
    api.post('/user/publicKey', { publicKey: this.state.walletKey }, {
      headers: {
        token: localStorage.getItem('token')
      }
    })
    .then(response => {
      this.fetchState()
    })
  }

  disableMetamask() {
    api.delete('/user/publicKey', {
      headers: {
        token: localStorage.getItem('token')
      }
    })
    .then(response => {
      this.fetchState()
    })
  }

  inputChange = (e) => {
   const { name, value } = e.currentTarget
   this.setState({ [name]:value })
  }

  render() {
    return (
      <Form>
        <CardTitle>
        One-click Login with the Blockchain
        </CardTitle>
        <div>
        {this.state.message === "" ? <div><br/></div> : <p>{this.state.message}</p>}
        </div>
        { !this.state.enabled ?
        <div>
        <h3> Step 1 - Connect to wallet< /h3>
        {this.state.connected ? <span>Connected Wallet: {this.state.walletKey} <br/> </span> : <span>Connected Wallet: NULL <br/> </span>}
        <Button
          color="primary"
          disabled={this.state.connected}
          className="btn-shadow"
          size="lg"
          onClick={() => this.toggleMetamask(!this.state.enabled)}
        >
          Connect
        </Button>
        <br/><br/>
        <h3> Step 2 - Confirm </h3>
        <Button
          color="primary"
          disabled={!this.state.connected}
          className="btn-shadow"
          size="lg"
          onClick={() => this.enableMetamask(!this.state.enabled)}
        >
          Enable
        </Button>
        </div>  :
        <div>
        <p> Connected Public Key: {this.state.publicKey} </p>
        <Button
          color="primary"
          disabled={!this.state.enabled}
          className="btn-shadow"
          size="lg"
          onClick={() => this.disableMetamask()}
        >
          Disable
        </Button>
        </div>}
      </Form>
    )
  }

}

export default AccountExtend;
