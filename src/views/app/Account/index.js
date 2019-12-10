import React, { Component } from "react";
import { Row, Card, CardBody, TabPane, NavItem, Nav, TabContent } from "reactstrap";
import { NavLink } from "react-router-dom";
import { Colxx } from "../../../components/common/CustomBootstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import classnames from 'classnames';
import Overview from './Overview'
import TwoFactor from './TwoFactor'
import Metamask from './Metamask'
import ApiKeys from './ApiKeys'
import ChangePassword from './ChangePassword'

export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "overview"
    };
  }

  componentWillMount = () => {
    const tab = this.props.location
    if(tab.search) {
      if(tab.search.split('=')[0] === "?tab"){
        this.setState({
          activeTab: tab.search.split('=')[1]
        })
      }
    }

  }

  toggleTab = (tab) => {
    if (this.state.activeTab !== tab) {
      this.setState({
          activeTab: tab
      });
    }
  };

  render() {

    return (
    <Row>
      <Colxx sm="12">
        <Card>
          <CardBody>
            <Nav tabs className="separator-tabs ml-0 mb-5">
              <NavItem>
                <NavLink
                  className={classnames({
                    active: this.state.activeTab === "overview",
                    "nav-link": true,
                    "hand-pointer": true
                    })}
                  onClick={() => {
                    this.toggleTab("overview")
                  }}
                  to="#"
                  >
                    <IntlMessages id="tab.overview" />
                  </NavLink>
                </NavItem>


                <NavItem>

                <NavLink
                  className={classnames({
                    active: this.state.activeTab === "2fa",
                    "nav-link": true,
                    "hand-pointer": true
                    })}
                  onClick={() => {
                    this.toggleTab("2fa")
                  }}
                  to="#"
                  >
                    <IntlMessages id="tab.google-auth" />
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === "api",
                      "nav-link": true,
                      "hand-pointer": true
                      })}
                    onClick={() => {
                      this.toggleTab("api")
                    }}
                    to="#"
                    >
                      <IntlMessages id="tab.api-keys" />
                    </NavLink>
                  </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === "metamask",
                      "nav-link": true,
                      "hand-pointer": true
                      })}
                    onClick={() => {
                      this.toggleTab("metamask")
                    }}
                    to="#"
                    >
                      <IntlMessages id="tab.metamask" />
                    </NavLink>
                  </NavItem>

                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "changePassword",
                        "nav-link": true,
                        "hand-pointer": true
                        })}
                      onClick={() => {
                        this.toggleTab("changePassword")
                      }}
                      to="#"
                      >
                        <IntlMessages id="tab.change-password" />
                      </NavLink>
                    </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab}>

             <TabPane tabId="overview">
             <Overview/>
            </TabPane>



            <TabPane tabId="2fa">
             <TwoFactor/>
            </TabPane>

            <TabPane tabId="metamask">
               <Metamask/>
            </TabPane>

            <TabPane tabId="api">
               <ApiKeys/>
            </TabPane>

            <TabPane tabId="changePassword">
              <ChangePassword/>
            </TabPane>

          </TabContent>
          </CardBody>
        </Card>
      </Colxx>
    </Row>
    );
  }
}
