import React, { Component, Fragment } from "react";
import { Colxx, Separator } from "../../components/common/CustomBootstrap";
import io from 'socket.io-client'
import {baseURL} from "../../constants/defaultValues"
import TradingViewWidget, { Themes } from 'react-tradingview-widget';
import '../../assets/css/format.css';
import { NotificationManager } from "../../components/common/react-notifications";
import api from '../../components/api';


import {
  Row,
  Table,
  Card,
  CardTitle,
  CardBody,
  CardHeader,
  FormGroup,
  Label,
  Input
} from "reactstrap";

export default class BlankPage extends Component {

    constructor(props){
      super(props)
      this.state = {
        connected: false,
        token: localStorage.getItem('token'),
        showAlerts: true,
        bidPrice: '',
        bidAmount: '',
        bidTotal: '',
        askPrice: '',
        askAmount: '',
        askTotal: '',
        balances: [
          {
            asset: 'BTC',
            free: 0
          },
          {
            asset: 'USDT',
            free: 0
          }
        ],
        change: "",
        changeIcon: "",

        lastPrice: '0',
        lastPriceOrderbook: '0',
        change24h: '0  0',
        high24: '0',
        low24: '0',
        volume: '0',
        tradeHistory: [],
        bids: [],
        asks: [],
        openOrders: [],
        closedOrders: [],
      }
      this.socket = null
      this.BTCticker()
    }

    componentDidMount() {
      global.serverSocket.on('message', (message) => {
        const payload = JSON.parse(message)
        if(payload.e === 'outboundAccountInfo') {
          this.setState({
            balances: payload.B,
            openOrders: payload.O.reverse(),
            closedOrders: payload.C.reverse()
          })
        }
        if(payload.e === 'executionReport') {
          if(payload.X === "FILLED") {
            const title = `${payload.s} ${payload.S} Filled`
            const message = `Your ${payload.S} order has filled ${payload.z} units at ${payload.L} per unit`
            this.triggerFill(title, message)
          } else if (payload.X === "PARTIALLY_FILLED") {
            const title = `${payload.s} ${payload.S} Partially Filled`
            const message = `Your ${payload.S} order has partially filled ${payload.z} units at ${payload.L} per unit`
            this.triggerFill(title, message)
          }
        }
      })

      global.serverSocket.on('depthUpdate', (data) => {
        const bid = data.bids.slice(0, 16)
        let ask = data.asks.slice(0,16)
        ask.reverse()
        let bids = [], asks = []
        let length = bid.length > ask.length ? ask.length : bid.length
        length = length > 16 ? 16 : length
        for(let i=0; i<length; i++) {
          bids.push({
            price: bid[i].price.toFixed(2),
            amount: bid[i].quantity.toFixed(8),
            total: parseFloat(bid[i].price * bid[i].quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            temporary: bid[i].temporary
          })
          asks.push({
            price: ask[i].price.toFixed(2),
            amount: ask[i].quantity.toFixed(8),
            total: parseFloat(ask[i].price * ask[i].quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            temporary: ask[i].temporary
          })
        }
        if(length !== 16) {
          for(let i=0; i<16-length; i++) {
            bids.push({
              price: "-",
              amount: "-",
              total: "-",
              temporary: true
            })
            asks.push({
              price: "-",
              amount: "-",
              total: "-",
              temporary: true
            })
          }
        }
        this.setState({
          bids,
          asks,
        })
      })


    }

    componentWillUnmount() {
      global.serverSocket.off('message')
      global.serverSocket.off('depthUpdate')
    }


    componentWillMount(){
      let tradeHistory = []
      let bids = [], asks = []
      for(let i=0; i<34; i++) {
        tradeHistory.push({price: 0, parsedPrice: 0, amount: 0, timestamp: 0, buyer: null})
      }
      for(let i=0; i<16; i++) {
        bids.push({price: 0, amount: 0, total: 0})
        asks.push({price: 0, amount: 0, total: 0})
      }
      this.setState({
        tradeHistory,
        bids,
        asks
      })
    }


    addTradeHistory(response) {
      let tradeHistory = this.state.tradeHistory
      tradeHistory.pop()
      tradeHistory.unshift({
        price: parseFloat(response.p).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        parsedPrice: response.p,
        amount: response.q,
        timestamp: new Date(response.T).toLocaleTimeString('en-GB'),
        buyer: response.m
      })
      let change = ""
      let changeIcon = ""
      if(parseFloat(response.p) > parseFloat(this.state.lastPriceOrderbook)) {
          change = "changeUp"
          changeIcon = "fas fa-long-arrow-alt-up"
      } else if (parseFloat(response.p) < parseFloat(this.state.lastPriceOrderbook)) {
          change = "changeDown"
          changeIcon = "fas fa-long-arrow-alt-down"

      }
      this.setState({
        change,
        changeIcon,
        lastPrice: parseFloat(response.p).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        lastPriceOrderbook: parseFloat(response.p).toFixed(2),
      })
    }


    BTCticker() {
      const self = this
      const ws = new WebSocket('wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/btcusdt@trade');

      ws.onopen = function() {
        self.setState({
          connected: true
        })
      }

      ws.onping = function () {
        ws.pong(()=>{})
      }

    	ws.onclose = function() {
        self.setState({
          connected: false
        })
      }

        ws.onmessage = function(msg) {
            let response = JSON.parse(msg.data);
            response = response.data
            if(response.e === "24hrTicker") {
              let change = ""
              let changeIcon = ""
              if(parseFloat(response.c) > parseFloat(self.state.lastPriceOrderbook)) {
                  change = "changeUp"
                  changeIcon = "fas fa-long-arrow-alt-up"
              } else if (parseFloat(response.c) < parseFloat(self.state.lastPriceOrderbook)) {
                  change = "changeDown"
                  changeIcon = "fas fa-long-arrow-alt-down"
              }
              document.title = `${parseFloat(response.c).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} | BTCUSDT | Cortrex`
              self.setState({
                change,
                changeIcon,
                lastPrice: parseFloat(response.c).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                lastPriceOrderbook: parseFloat(response.c).toFixed(2),
                volume: parseFloat(response.q).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                high24: parseFloat(response.h).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                low24: parseFloat(response.l).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                change24h: `${parseFloat(response.p).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}   ${parseFloat(response.P).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              })
            } else if (response.e === "trade") {
              self.addTradeHistory(response)
            }
        }
    }

    handleInput = (e) => {
      const { name, value } = e.currentTarget
      this.setState({
        [name]: value
      })
      switch(name) {
        case "bidPrice":
          if(this.state.bidAmount) {
            this.setState({
              bidTotal: (this.state.bidAmount*value).toFixed(8)
            })
          }
          break;
        case 'bidAmount':
          if(this.state.bidPrice) {
            this.setState({
              bidTotal: (this.state.bidPrice*value).toFixed(8)
            })
          }
          break;
        case 'bidTotal':
          if(this.state.bidPrice) {
            this.setState({
              bidAmount: (value/this.state.bidPrice).toFixed(8)
            })
          }
          break;
          case "askPrice":
            if(this.state.askAmount) {
              this.setState({
                askTotal: (this.state.askAmount*value).toFixed(8)
              })
            }
            break;
          case 'askAmount':
            if(this.state.askPrice) {
              this.setState({
                askTotal: (this.state.askPrice*value).toFixed(8)
              })
            }
            break;
          case 'askTotal':
            if(this.state.askPrice) {
              this.setState({
                askAmount: (value/this.state.askPrice).toFixed(8)
              })
            }
            break;
        default:
          break;
      }
    }

    triggerSuccess = (title, message) => {
      if(!this.state.showAlerts) return
      return(
        NotificationManager.success(
          <span>{message}</span>,
          <span>{title}</span>,
          5000,
          null,
          null,
          ''
        )
      )
    }

    triggerWarning = (title, message) => {
      if(!this.state.showAlerts) return
      return(
        NotificationManager.warning(
          <span>{message}</span>,
          <span>{title}</span>,
          5000,
          null,
          null,
          ''
        )
      )
    }

    triggerFill = (title, message) => {
      if(!this.state.showAlerts) return
      return(
        NotificationManager.primary(
          <span>{message}</span>,
          <span>{title}</span>,
          5000,
          null,
          null,
          ''
        )
      )
    }

    submitBuyOrder = () => {
      const params = `symbol=BTCUSDT&side=BUY&type=LIMIT&timeInForce=GTC&quantity=${this.state.bidAmount}&price=${this.state.bidPrice}&timestamp=${Date.now()}`
      api.post(`http://localhost:3002/api/v1/private/order?${params}`, {}, {
        headers: {
          token: localStorage.getItem('token')
        }
      })
      .then(response => {
        if(response.status === 200) {
          const title = "BTC Buy Placed"
          const message = `Your Buy order of ${response.data.order.origQty.toFixed(8)} units at $${response.data.order.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} per unit has processed`
          this.triggerSuccess(title, message)
        } else {
          const title = "BTC Buy Error"
          const message = response.data.msg
          this.triggerWarning(title, message)
        }
      })
      .catch(error => {
        console.log(error.response.data.msg)
      })
    }

    submitSellOrder = () => {
      const params = `symbol=BTCUSDT&side=SELL&type=LIMIT&timeInForce=GTC&quantity=${this.state.askAmount}&price=${this.state.askPrice}&timestamp=${Date.now()}`
      api.post(`http://localhost:3002/api/v1/private/order?${params}`, {}, {
        headers: {
          token: localStorage.getItem('token')
        }
      })
      .then(response => {
        if(response.status === 200) {
          const title = "BTC Sell Placed"
          const message = `Your Sell order of ${response.data.order.origQty.toFixed(8)} units at $${response.data.order.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} per unit has processed`
          this.triggerSuccess(title, message)
        } else {
          const title = "BTC Sell Error"
          const message = response.data.msg
          this.triggerWarning(title, message)
        }
      })
      .catch(error => {
        console.log(error.response.data.msg)
      })

    }

    submitDeleteOrder = (orderId) => {
      const params = `symbol=BTCUSDT&orderId=${orderId}&timestamp=${Date.now()}`
      api.delete(`http://localhost:3002/api/v1/private/order?${params}`, {
        headers: {
          token: localStorage.getItem('token')
        }
      })
      .then(response => {
        if(response.status === 200) {
          const title = "Cancel Processed"
          const message = `Order ID #${response.data.order.orderId} per unit has cancelled`
          this.triggerSuccess(title, message)
        } else {
          const title = "Cancel Error"
          const message = response.data.msg
          this.triggerWarning(title, message)
        }
      })
      .catch(error => {
        console.log(error.response.data.msg)
      })
    }
//              <input type="checkbox" checked={this.state.showAlerts} onChange={()=>{this.setState({showAlerts: !this.state.showAlerts})}}/>

    render() {
        return (
            <Fragment>
            <div className="maxWidthContainer">
            <Row>

              <Colxx xl="12" lg="12" className="mb-4">
                  <Card>
                    <CardHeader className="p-0 position-relative">

                    </CardHeader>
                    <CardBody className="d-flex justify-content-between align-items-center">
                    <div> <h3 className="white"><strong>BTC</strong>/USDT </h3><img alt="Bitcoin logo" src="https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png?1547033579"/> Bitcoin</div>
                    <div></div>
                    <div> <h4 className="white">Last Price</h4><span className={this.state.change}>{this.state.lastPrice}</span> </div>
                    <div> <h4 className="white">24h Change</h4>{this.state.change24h.includes('-') ? <span className="changeDown">{this.state.change24h}%</span> : <span className="changeUp">{this.state.change24h}%</span>} </div>
                    <div> <h4 className="white">24h High</h4>{this.state.high24}  </div>
                    <div> <h4 className="white">24h Low</h4> {this.state.low24} </div>
                    <div> <h4 className="white">24h Volume</h4>{this.state.volume} USDT  </div>
                    <div></div>
                    </CardBody>
                  </Card>
              </Colxx>

              </Row>

              <Row>
                  <Colxx md="3">
                    <Card>
                      <CardBody>
                        <Table className="table table-borderless">
                        <thead>
                          <tr>
                            <th className="white" scope="col">Price (USDT)</th>
                            <th className="white" scope="col">Amount (BTC)</th>
                            <th className="white" scope="col">Total (USDT)</th>
                          </tr>
                        </thead>
                        </Table>
                        <Table className="table table-borderless marginLeft">

                          <tbody>
                          {this.state.asks.length > 0 ? this.state.asks.map((book, i) => {
                              return(<tr key={"ask"+i}className={!book.temporary ? "highlight" : null}>
                                <td onClick={()=>{this.setState({bidPrice: book.price, askPrice: book.price})}}className="changeDown">{book.price}</td>
                                <td onClick={()=>{this.setState({bidAmount: book.amount})}}>{book.amount}</td>
                                <td onClick={()=>{this.setState({bidTotal: parseFloat(book.total.split(',').join(''))})}}>{book.total}</td>
                            </tr>)}) : null}
                          </tbody>
                        </Table>
                        <div className="d-flex justify-content-between align-items-center">
                          <span></span>
                          <span onClick={()=>{this.setState({bidPrice: this.state.lastPriceOrderbook, askPrice: this.state.lastPriceOrderbook})}} className={this.state.change}>{this.state.lastPriceOrderbook} <i className={this.state.changeIcon}/></span>
                          <span className={this.state.connected ? "changeUp" : "changeDown"}><i className="fas fa-signal"/></span>
                        </div>
                        <br/>
                        <Table className="table table-borderless marginLeft">
                          <tbody>
                          {this.state.bids.length > 0 ? this.state.bids.map((book, i) => {
                              return(<tr key={"bid"+i} className={!book.temporary ? "highlight" : null}>
                                <td onClick={()=>{this.setState({askPrice: book.price, bidPrice: book.price})}} className="changeUp">{book.price}</td>
                                <td onClick={()=>{this.setState({askAmount: book.amount})}}>{book.amount}</td>
                                <td onClick={()=>{this.setState({askTotal: parseFloat(book.total.split(',').join(''))})}}>{book.total}</td>
                            </tr>)}) : null}
                          </tbody>
                        </Table>
                      </CardBody>
                    </Card>
                  </Colxx>
                  <Colxx md="6">



                      <Row>
                        <Colxx md="12" className="heightAdjust">
                              <TradingViewWidget
                                symbol="BINANCE:BTCUSDT"
                                theme={Themes.DARK}
                                autosize
                              />

                        </Colxx>

                      </Row>
                      <Separator/>
                      <br/>
                      <Row>

                        <Colxx md="12">
                        <Card>
                          <CardBody>
                            <Row>
                              <Colxx md="6">
                                <div className="d-flex justify-content-between align-items-center">
                                  <span className="changeUp"> BUY BTC </span>
                                  <span> Available USDT: {this.state.balances[1].free.toFixed(2)} </span>
                                </div>
                                <FormGroup row>
                                  <Label className="labelLength" sm={2}>
                                  Price
                                  </Label>
                                  <Colxx sm={10}>
                                    <Input
                                      onChange={this.handleInput}
                                      value={this.state.bidPrice}
                                      type="number"
                                      name="bidPrice"
                                      step="0.01"
                                      min="0.01"
                                    />
                                  </Colxx>
                                </FormGroup>
                                <FormGroup row>
                                  <Label sm={2}>
                                  Amount
                                  </Label>
                                  <Colxx sm={10}>
                                    <Input
                                      onChange={this.handleInput}
                                      value={this.state.bidAmount}
                                      type="number"
                                      name="bidAmount"
                                      step="0.000001"
                                      min="0.000001"
                                    />
                                  </Colxx>
                                </FormGroup>

                                <FormGroup row>
                                  <Label sm={2}>
                                  Total
                                  </Label>
                                  <Colxx sm={10}>
                                    <Input
                                      onChange={this.handleInput}
                                      value={this.state.bidTotal}
                                      type="number"
                                      name="bidTotal"
                                      step="1"
                                      min="1"
                                    />
                                  </Colxx>
                                </FormGroup>
                                <button className="buyButton" onClick={this.submitBuyOrder}>
                                Buy BTC
                                </button>
                              </Colxx>


                              <Colxx md="6">
                              <div className="d-flex justify-content-between align-items-center">
                                <span className="changeDown"> SELL BTC </span>
                                <span> Available BTC: {this.state.balances[0].free.toFixed(8)} </span>
                              </div>
                              <FormGroup row>
                                <Label sm={2}>
                                Price
                                </Label>
                                <Colxx sm={10}>
                                  <Input
                                    onChange={this.handleInput}
                                    value={this.state.askPrice}
                                    type="number"
                                    name="askPrice"
                                    step="0.01"
                                    min="0.01"
                                  />
                                </Colxx>
                              </FormGroup>
                              <FormGroup row>
                                <Label sm={2}>
                                Amount
                                </Label>
                                <Colxx sm={10}>
                                  <Input
                                    onChange={this.handleInput}
                                    value={this.state.askAmount}
                                    type="number"
                                    name="askAmount"
                                    step="0.000001"
                                    min="0.000001"
                                  />
                                </Colxx>
                              </FormGroup>

                              <FormGroup row>
                                <Label sm={2}>
                                Total
                                </Label>
                                <Colxx sm={10}>
                                  <Input
                                    onChange={this.handleInput}
                                    value={this.state.askTotal}
                                    type="number"
                                    name="askTotal"
                                    step="1"
                                    min="1"
                                  />
                                </Colxx>
                              </FormGroup>
                              <button className="sellButton" onClick={this.submitSellOrder}>
                              Sell BTC
                              </button>
                              </Colxx>
                            </Row>
                          </CardBody>
                        </Card>
                        </Colxx>
                      </Row>



                  </Colxx>
                  <Colxx md="3">
                    <Card>
                      <CardBody>
                      <div className="d-flex justify-content-between align-items-center">
                        <div></div>
                        <h4 className="white"> Trade History </h4>
                        <div></div>
                      </div>
                      <br/>
                      <Table className="table table-borderless marginLeft">
                        <tbody>
                          {this.state.tradeHistory.length > 0 ? this.state.tradeHistory.map((trade, i) => {
                              return(<tr key={"trade"+i}>
                                <td onClick={()=>{this.setState({bidPrice: parseFloat(trade.parsedPrice).toFixed(2), askPrice: parseFloat(trade.parsedPrice).toFixed(2)})}} className={trade.buyer ? "changeDown" : "changeUp"}>{trade.price}</td>
                                <td>{trade.amount}</td>
                                <td>{trade.timestamp}</td>
                            </tr>)}) : null}
                        </tbody>
                      </Table>
                      </CardBody>
                    </Card>

              </Colxx>
            </Row>
            <br/>
            <Row>
              <Colxx md="12">
              <CardTitle> Open orders ({this.state.openOrders.length}) </CardTitle>
                <Card>
                  <CardBody>
                    <table className="maxwidth">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Pair</th>
                          <th>Type</th>
                          <th>Side</th>
                          <th>Price</th>
                          <th>Amount</th>
                          <th>Filled%</th>
                          <th>Total</th>
                          <th>Trigger Conditions</th>
                          <th>Cancel</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.openOrders.length > 0 ? this.state.openOrders.map((trade, i) => {
                          return (<tr key={"open"+trade.orderId}>
                            <td>{new Date(trade.transactTime).toLocaleTimeString('en-GB')}</td>
                            <td>{trade.symbol}</td>
                            <td>{trade.type}</td>
                            <td className={trade.side === "SELL" ? "changeDown" : "changeUp" }>{trade.side}</td>
                            <td>{trade.price}</td>
                            <td>{trade.origQty}</td>
                            <td>{(((trade.origQty-trade.quantity)/(trade.origQty))*100).toFixed(2)}%</td>
                            <td>{(trade.price*trade.origQty).toFixed(2)}</td>
                            <td>{trade.timeInForce}</td>
                            <td><button className="cancelButton" onClick={()=>{this.submitDeleteOrder(trade.orderId)}}>Cancel</button></td>
                          </tr>)
                        }) : null }
                      </tbody>
                    </table>
                    <br/>
                    {this.state.openOrders.length === 0 ? <div className="d-flex justify-content-between align-items-center"><div></div><div>You have no open orders</div><div></div></div> : null}
                  </CardBody>
                </Card>
              </Colxx>
            </Row>
            <br/>
            <Row>
              <Colxx md="12">
              <CardTitle> Closed Orders</CardTitle>
                <Card>
                  <CardBody>
                    <table className="maxwidth">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Pair</th>
                          <th>Type</th>
                          <th>Side</th>
                          <th>Price</th>
                          <th>Amount</th>
                          <th>Filled%</th>
                          <th>Total</th>
                          <th>Trigger Conditions</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.closedOrders.length > 0 ? this.state.closedOrders.map((trade, i) => {
                          return (<tr key={"closed"+trade.orderId+''+i}>
                            <td>{new Date(trade.transactTime).toLocaleTimeString('en-GB')}</td>
                            <td>{trade.symbol}</td>
                            <td>{trade.type}</td>
                            <td className={trade.side === "SELL" ? "changeDown" : "changeUp" }>{trade.side}</td>
                            <td>{trade.price}</td>
                            <td>{trade.origQty}</td>
                            <td>{(((trade.origQty-trade.quantity)/(trade.origQty))*100).toFixed(2)}%</td>
                            <td>{(trade.price*trade.origQty).toFixed(2)}</td>
                            <td>{trade.timeInForce}</td>
                            <td>{trade.status}</td>
                          </tr>)
                        }) : null }
                      </tbody>
                    </table>
                    <br/>
                    {this.state.closedOrders.length === 0 ? <div className="d-flex justify-content-between align-items-center"><div></div><div>You have no order history</div><div></div></div> : null}
                  </CardBody>
                </Card>
              </Colxx>
            </Row>
            </div>
          </Fragment>
        )
    }
}
