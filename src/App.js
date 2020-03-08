import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';

import Login from './components/login';
import Register from './components/register';
import Header from './components/header';
import Sidebar from './components/sidebar';
import Footer from './components/footer';
import Dashboard from './components/dashboard';

const isLoggegIn = () => {
  return localStorage.getItem('TOKEN_KEY') !== null;
}

const SecuredRoute = ({ component: Component, ...rest }) => (
  <Route
    { ...rest }
    render={props => 
      isLoggegIn() === true ? (
        <Component { ...props } />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <div>
            { isLoggegIn() && <Header /> }
            { isLoggegIn() && <Sidebar /> }
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <SecuredRoute path="/dashboard" component={Dashboard} />
            { isLoggegIn() && <Footer /> }
          </div>
        </Switch>
      </Router>
    );
  }
}

export default App;
