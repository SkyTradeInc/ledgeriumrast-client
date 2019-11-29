import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import UserLayout from "../../layout/UserLayout";

import login from "./login";
import register from "./register";
import forgotPassword from "./forgot-password";
import resetPassword from "./reset-password";
import verifyEmail from "./verify-email";

const User = ({ match }) => {
  return (
    <UserLayout>
      <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/login`} />
        <Route path={`${match.url}/login`} component={login} />
        <Route path={`${match.url}/register`} component={register} />
        <Route path={`${match.url}/forgot-password`} component={forgotPassword} />
        <Route path={`${match.url}/reset-password`} component={resetPassword} />
        <Route path={`${match.url}/verify-email`} component={verifyEmail} />

        <Redirect to="/error" />
      </Switch>
    </UserLayout>
  );
};

export default User;
