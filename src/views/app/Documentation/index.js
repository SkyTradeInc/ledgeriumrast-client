import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Colxx } from "../../../components/common/CustomBootstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import classnames from 'classnames';
import Highlight from 'react-highlight'
import axios from 'axios';

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


const methods = [
  {
    name: 'eth_blockNumber',
    description: 'Returns the current "latest" block number.',
    params: []
  },
  {
    name: 'eth_call',
    description: 'Executes a new message call immediately without creating a transaction on the block chain.',
    params: []
  },
  {
    name: 'eth_getBlockByNumber',
    description: 'Returns information about a block by block number.',
    params: [
      {
        name: 'QUANTITY|TAG',
        description: 'integer of a block number, or the string "earliest", "latest" or "pending"',
        types: ['string', 'number'],
        required: true
      },
      {
        name: 'Boolean',
        description: 'If true it returns the full transaction objects, if false only the hashes of the transactions.',
        types: ['boolean'],
        required: true
      }
    ]
  },
  {
    name: 'eth_getTransactionByHash',
    description: 'Returns information about a transaction for a given hash.',
    params: [
      {
        name: 'Transaction Hash',
        description: 'a string representing the hash (32 bytes) of a transaction',
        types: ['string'],
        required: true
      }
    ]
  }
]

export default class Documentation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      rpcObject: {
        jsonrpc: "2.0",
        method: "",
        params: [],
        id: 1
      },
      selectedMethod: false,
      response: '',
      apiKey: '601b14ce1ed44770d8376c90360deae18a8d4dbf41264748924f86ae76664638'
    };
  }

  inputChange = (e) => {
    let { id, value } = e.currentTarget
    let { rpcObject } = this.state
    if(value === "true") value = true
    if(value === "false") value = false
    rpcObject.params[id] = value
    this.setState({ rpcObject })
  }

  callRPC = (rpc) => {
    this.setState({
      response: '',
    })
    axios.post('http://localhost:2906/api/rpc/', this.state.rpcObject, {
      headers: {
        Authorization: this.state.apiKey
      }
    })
    .then(result => {
      this.setState({
        response: JSON.stringify(result.data)
      })
    })
  }

  toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
   }

  setMethod = (i) => {
    let { rpcObject } = this.state
    rpcObject.method = methods[i].name
    rpcObject.params = []
    this.setState({
      selectedMethod: methods[i],
      rpcObject
    })
  }


  render() {

    return (
    <Row>
      <Colxx sm="12">
        <CardTitle> Rast - API playground </CardTitle>
        <Card>
          <CardBody>
           <Dropdown size="xs" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
              <DropdownToggle caret>
                Select a Method
              </DropdownToggle>
              <DropdownMenu>
              {methods.map((method, i) => {
                return <DropdownItem onClick={()=>{this.setMethod(i)}}> { method.name } </DropdownItem>
              })}

              </DropdownMenu>
            </Dropdown>
            <br/>
            {this.state.selectedMethod ?
              <>
                <h2> {this.state.selectedMethod.name}</h2>
                <p> {this.state.selectedMethod.description} </p>
                <h3> Parameters </h3>
                {this.state.selectedMethod.params.length > 0 ? this.state.selectedMethod.params.map((param, i) => {
                  return (
                    <>
                    {param.name}{" "}<strong>{param.required ? '(required)' : '(optional)'}</strong>
                    {param.types.includes("boolean") ? <>
                    <br/>
                    <FormGroup>
                    <p>{param.description}</p>
                    {"True"}  <Input type="radio" value={true} id={i} onChange={this.inputChange}/>
                    {"False"} <Input type="radio" value={false} id={i} onChange={this.inputChange}/>
                    </FormGroup>
                    </> : <Input type="text" id={i} onChange={this.inputChange} placeholder={param.description}/>}
                    <br/>
                    </>
                  )
                }) : <>None<br/></> }
                <br/>
                <h3> Request </h3>
                <Input type="text" disabled={true} value={JSON.stringify(this.state.rpcObject)}/>
                <br/>
                <Button size="xs" onClick={this.callRPC}> Call RPC </Button>
                <br/><br/>
                <h3> Response </h3>
                <Highlight language={"json"}>
                {this.state.response === '' ? '' : this.state.response}
                </Highlight>
              </>
            : null}

          </CardBody>
        </Card>
      </Colxx>
    </Row>
    );
  }
}
