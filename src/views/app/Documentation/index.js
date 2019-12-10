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
    params: [
      {
        name: 'Transaction Call Object',
        description: 'integer of a block number, or the string "earliest", "latest" or "pending"',
        types: ['string', 'number'],
        required: true,
        subParams: [
          {
            name: 'from',
            description: 'The address the transaction is sent from',
            types: ['string'],
            required: false
          },
          {
            name: 'to',
            description: 'The address the transaction is directed to',
            types: ['string'],
            required: true
          },
          {
            name: 'gas',
            description: 'Integer of the gas provided for the transaction execution. eth_call consumes zero gas, but this parameter may be needed by some executions.',
            types: ['string', 'number'],
            required: false
          },
          {
            name: 'gasPrice',
            description: 'Integer of the gasPrice used for each paid gas.',
            types: ['string', 'number'],
            required: false
          },
          ,
          {
            name: 'value',
            description: 'Integer of the value sent with this transaction.',
            types: ['string', 'number'],
            required: false
          },
          ,
          {
            name: 'data',
            description: 'Hash of the method signature and encoded parameters. For details see Ethereum Contract ABI',
            types: ['string', 'number'],
            required: false
          },
        ]
      },
      {
        name: 'Block Paramater',
        description: 'integer block number, or the string "latest", "earliest" or "pending"',
        types: ['string', 'number'],
        required: true
      }
    ]
  },
  {
    name: 'eth_estimateGas',
    description: 'Generates and returns an estimate of how much gas is necessary to allow the transaction to complete. The transaction will not be added to the blockchain. Note that the estimate may be significantly more than the amount of gas actually used by the transaction, for a variety of reasons including EVM mechanics and node performance.',
    params: [
      {
        name: 'Transaction Call Object',
        description: 'integer of a block number, or the string "earliest", "latest" or "pending"',
        types: ['string', 'number'],
        required: true,
        subParams: [
          {
            name: 'from',
            description: 'The address the transaction is sent from',
            types: ['string'],
            required: false
          },
          {
            name: 'to',
            description: 'The address the transaction is directed to',
            types: ['string'],
            required: true
          },
          {
            name: 'gas',
            description: 'Integer of the gas provided for the transaction execution. eth_call consumes zero gas, but this parameter may be needed by some executions.',
            types: ['string', 'number'],
            required: false
          },
          {
            name: 'gasPrice',
            description: 'Integer of the gasPrice used for each paid gas.',
            types: ['string', 'number'],
            required: false
          },
          ,
          {
            name: 'value',
            description: 'Integer of the value sent with this transaction.',
            types: ['string', 'number'],
            required: false
          },
          ,
          {
            name: 'data',
            description: 'Hash of the method signature and encoded parameters. For details see Ethereum Contract ABI',
            types: ['string', 'number'],
            required: false
          },
        ]
      }
    ]
  },
  {
    name: 'eth_getBalance',
    description: 'Returns the balance of the account of given address.',
    params: [
      {
        name: 'Address',
        description: 'a string representing the address (20 bytes) to check for balance',
        types: ['string'],
        required: true
      },
      {
        name: 'Block Paramater',
        description: 'integer of a block number, or the string "earliest", "latest" or "pending"',
        types: ['string', 'number'],
        required: true
      }
    ]
  },
  {
    name: 'eth_getBlockByHash',
    description: 'Returns information about a block by hash.',
    params: [
      {
        name: 'Block Hash',
        description: 'a string representing the hash (32 bytes) of a block',
        types: ['string'],
        required: true
      },
      {
        name: 'Show Transaction Details Flag',
        description: 'If true it returns the full transaction objects, if false only the hashes of the transactions.',
        types: ['boolean'],
        required: true
      }
    ]
  },
  {
    name: 'eth_getBlockByNumber',
    description: 'Returns information about a block by block number.',
    params: [
      {
        name: 'Block Paramater',
        description: 'integer of a block number, or the string "earliest", "latest" or "pending"',
        types: ['string', 'number'],
        required: true
      },
      {
        name: 'Show Transaction Details Flag',
        description: 'If true it returns the full transaction objects, if false only the hashes of the transactions.',
        types: ['boolean'],
        required: true
      }
    ]
  },
  {
    name: 'eth_getBlockTransactionCountByHash',
    description: 'Returns the number of transactions in the block with the given block hash.',
    params: [
      {
        name: 'Block Hash',
        description: 'a string representing the hash (32 bytes) of a block',
        types: ['string'],
        required: true
      }
    ]
  },
  {
    name: 'eth_getBlockTransactionCountByNumber',
    description: 'Returns the number of transactions in the block with the given block number.',
    params: [
      {
        name: 'Block Paramater',
        description: 'integer of a block number, or the string "earliest", "latest" or "pending"',
        types: ['string', 'number'],
        required: true
      }
    ]
  },
  {
    name: 'eth_getCode',
    description: 'Returns the compiled smart contract code, if any, at a given address.',
    params: [
      {
        name: 'Address',
        description: 'a string representing the address (20 bytes) of the code',
        types: ['string'],
        required: true
      },
      {
        name: 'Block Paramater',
        description: 'integer of a block number, or the string "earliest", "latest" or "pending"',
        types: ['string', 'number'],
        required: true
      }
    ]
  },
  {
    name: 'eth_getTransactionByBlockHashAndIndex',
    description: 'Returns information about a transaction by block hash and transaction index position.',
    params: [
      {
        name: 'Block Hash',
        description: 'a string representing the hash (32 bytes) of a block',
        types: ['string'],
        required: true
      },
      {
        name: 'Transaction Index Position',
        description: 'a hex of the integer representing the position in the block',
        types: ['string'],
        required: true
      }
    ]
  },
  {
    name: 'eth_getTransactionByBlockNumberAndIndex',
    description: 'Returns information about a transaction by block number and transaction index position.',
    params: [
      {
        name: 'Block Paramater',
        description: 'integer of a block number, or the string "earliest", "latest" or "pending"',
        types: ['string', 'number'],
        required: true
      },
      {
        name: 'Transaction Index Position',
        description: 'a hex of the integer representing the position in the block',
        types: ['string'],
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
  },
  {
    name: 'eth_getTransactionCount',
    description: 'Returns the number of transactions sent from an address.',
    params: [
      {
        name: 'Address',
        description: 'a string representing the address (20 bytes) of the code',
        types: ['string'],
        required: true
      },
      {
        name: 'Block Paramater',
        description: 'integer of a block number, or the string "earliest", "latest" or "pending"',
        types: ['string', 'number'],
        required: true
      }
    ]
  },
  {
    name: 'eth_getTransactionReceipt',
    description: 'Returns the receipt of a transaction by transaction hash. Note that the receipt is not available for pending transactions.',
    params: [
      {
        name: 'Transaction Hash',
        description: 'a string representing the hash (32 bytes) of a transaction',
        types: ['string'],
        required: true
      }
    ]
  },
  {
    name: 'eth_getUncleByBlockHashAndIndex',
    description: 'Returns information about the "Uncle" of a block by hash and the Uncle index position.',
    params: [
      {
        name: 'Block Hash',
        description: 'a string representing the hash (32 bytes) of a block',
        types: ['string'],
        required: true
      },
      {
        name: 'Uncle Index Position',
        description: 'hex of the integer indicating the uncles index position.',
        types: ['string'],
        required: true
      }
    ]
  },
  {
    name: 'eth_getTransactionByBlockNumberAndIndex',
    description: 'Returns information about a transaction by block number and transaction index position.',
    params: [
      {
        name: 'Block Paramater',
        description: 'integer of a block number, or the string "earliest", "latest" or "pending"',
        types: ['string', 'number'],
        required: true
      },
      {
        name: 'Uncle Index Position',
        description: 'hex of the integer indicating the uncles index position.',
        types: ['string'],
        required: true
      }
    ]
  },
  {
    name: 'eth_getUncleCountByBlockHash',
    description: 'Returns the number of uncles in a block from a block matching the given block hash.',
    params: [
      {
        name: 'Block Hash',
        description: 'a string representing the hash (32 bytes) of a block',
        types: ['string'],
        required: true
      },
    ]
  },
  {
    name: 'eth_getUncleCountByBlockNumber',
    description: 'Returns the number of uncles in a block from a block matching the given block number.',
    params: [
      {
        name: 'Block Paramater',
        description: 'integer of a block number, or the string "earliest", "latest" or "pending"',
        types: ['string', 'number'],
        required: true
      },
    ]
  },
  {
    name: 'eth_getWork',
    description: 'Returns the hash of the current block, the seedHash, and the boundary condition to be met ("target").',
    params: []
  },
  {
    name: 'eth_hashrate',
    description: 'Returns the number of hashes per second that the node is mining with. Only applicable when the node is mining.',
    params: []
  },
  {
    name: 'eth_mining',
    description: 'Returns true if client is actively mining new blocks.',
    params: []
  },
  {
    name: 'eth_protocolVersion',
    description: 'Returns the current ethereum protocol version.',
    params: []
  },
  {
    name: 'eth_sendRawTransaction',
    description: 'Submits a pre-signed transaction for broadcast to the Ethereum network.',
    params: [
      {
        name: 'Transaction Data',
        description: 'The signed transaction data.',
        types: ['string'],
        required: true
      }
    ]
  },
  {
    name: 'eth_syncing',
    description: 'Returns an object with data about the sync status or false.',
    params: []
  },
  {
    name: 'net_listening',
    description: 'Returns true if client is actively listening for network connections.',
    params: []
  },
  {
    name: 'net_peerCount',
    description: 'Returns the number of peers currently connected to the client.',
    params: []
  },
  {
    name: 'net_version',
    description: 'Returns the current network id.',
    params: []
  },
  {
    name: 'web3_clientVersion',
    description: 'Returns the current client version.',
    params: []
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
      apiKey: 'bb1590a268f3a09841ae9903bdb4dddd3cf5e74afb1728c21ca8b46cf8c7b32e'
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
      response: '',
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
                {this.state.response === '' ? '\n' : this.state.response}
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
