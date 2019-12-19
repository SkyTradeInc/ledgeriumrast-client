import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import api from '../../../components/api'
import { Colxx } from "../../../components/common/CustomBootstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import classnames from 'classnames';
import Highlight from 'react-highlight'
import Web3 from 'web3';

import {
  Row,
  Card,
  CardBody,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
  Label,
  CardTitle,
  Button,
  FormGroup
} from "reactstrap";

const web3WS = new Web3(new Web3.providers.WebsocketProvider("ws://localhost:2906/8cff2ea26a96a1024c646bbc648381a29764686de368e8ce6445b0d3db051d3d"));
const web3HTTP = new Web3(new Web3.providers.HttpProvider("http://localhost:2906/8cff2ea26a96a1024c646bbc648381a29764686de368e8ce6445b0d3db051d3d"));

export default class Visual extends Component {

  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
      apiKey: '8cff2ea26a96a1024c646bbc648381a29764686de368e8ce6445b0d3db051d3d',
      accountInfo: null,
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
          this.listen()
        }
      })
      .catch(console.log)
  }

  listen() {
    const self = this
    web3WS.eth.subscribe('pendingTransactions', function(error, result){
      if (!error) return;
    })
    .on("data", function(tx){
      let { transactions } = self.state
      web3HTTP.eth.getTransaction(tx)
        .then(txObject => {
          console.log(txObject)
          transactions.push(txObject)
          if(transactions.length > 20) {
            transactions.shift()
          }
          self.setState({
            transactions
          })
        })
    })
    .on("error", console.error);
  }

  render() {

    return (
    <Row>
      <Colxx sm="12">
        <CardTitle> [Toorak Mainnet] Live Transactions</CardTitle>
        <Card>
          <CardBody>
          {this.state.transactions.length > 0 ? this.state.transactions.map((tx) => {
            return(<p key={tx.hash}>{tx.from} -> {tx.to}. Value: {tx.value}</p>)
          }) : "Waiting for transactions..."}

          </CardBody>
        </Card>
      </Colxx>
    </Row>
    );
  }
}
