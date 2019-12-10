import React, { Component } from "react";
import { Route, withRouter, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import AppLayout from "../../layout/AppLayout";
import account from "./Account/"
import documentation from "./Documentation"
import visual from './Visual'

import {baseURL} from "../../constants/defaultValues";

class App extends Component {
  render() {
    const { match } = this.props;
    return (
      <AppLayout>
        <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/account`} />
          <Route path={`${match.url}/account`} component={account} />
          <Route path={`${match.url}/documentation`} component={documentation} />
          <Route path={`${match.url}/visual`} component={visual} />

          <Redirect to="/error" />
        </Switch>
      </AppLayout>
    );
  }
}
const mapStateToProps = ({ menu }) => {
  const { containerClassnames } = menu;
  return { containerClassnames };
};

export default withRouter(
  connect(
    mapStateToProps,
    {}
  )(App)
);
