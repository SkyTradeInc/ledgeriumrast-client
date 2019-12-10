import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Colxx } from "../../../components/common/CustomBootstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import classnames from 'classnames';
import Highlight from 'react-highlight'
import axios from 'axios';
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

const web3WS = new Web3(new Web3.providers.WebsocketProvider("ws://localhost:2906/bb1590a268f3a09841ae9903bdb4dddd3cf5e74afb1728c21ca8b46cf8c7b32e"));
const web3HTTP = new Web3(new Web3.providers.HttpProvider("http://localhost:2906/bb1590a268f3a09841ae9903bdb4dddd3cf5e74afb1728c21ca8b46cf8c7b32e"));
export default class Documentation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
      apiKey: 'bb1590a268f3a09841ae9903bdb4dddd3cf5e74afb1728c21ca8b46cf8c7b32e'
    }
  }

  componentDidMount() {
    this.listen()
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
