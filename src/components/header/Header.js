import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import swal from 'sweetalert';

class Header extends Component {
  constructor(props) {
    super(props);
  }

  logout = (e) => {    
    e.preventDefault();
    
    swal('Are you sure logout?', {
      buttons: {
        nope: {
          text: 'Let me back',
          value: 'nope'
        },
        sure: {
          text: "I'm, Sure",
          value: 'sure'
        }
      }
    })
    .then(value => {
      switch(value) {
        case "sure":
          swal("Logout Successfully", "success")
          .then(val => {
            localStorage.removeItem("TOKEN_KEY");
            return this.props.history.push("/login");
          });
          break;
        case "nope":
          swal("OK", "success");
          break;
        default:
          swal("Got away safely!!");
      }
    })
  }

  render() {
    return (
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        {/* Left navbar links */}
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" data-widget="pushmenu" href="#">
              <i className="fas fa-bars"></i>
            </a>
          </li>
          <li className="nav-item d-none d-sm-inline-block">
            <a href="#" className="nav-link">Home</a>
          </li>
          <li className="nav-item d-none d-sm-inline-block">
            <a href="#" className="nav-link">Contact</a>
          </li>
        </ul>

        {/* SEARCH FORM */}
        <form className="form-inline ml-3">
          <div className="input-group input-group-sm">
            <input
              type="search"
              className="form-control form-control-navbar"
              placeholder="Search"
              aria-label="Search"
            />
            <div className="input-group-append">
              <button className="btn btn-navbar" type="submit">
                <i className="fas fa-search"></i>
              </button>
            </div>
          </div>
        </form>
        
        {/* Right navbar links */}
        <ul className="navbar-nav ml-auto">
          <li className="nav-item dropdown">
            <a className="nav-link" data-toggle="dropdown" href="#">
              <i className="far fa-user" />
            </a>
            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
              <span className="dropdown-item dropdown-header">Profile</span>
              <div className="dropdown-divider" />
              <a
                href="#"
                onClick={e => this.logout(e)}
                className="dropdown-item"
              >
                <i className="fas fa-sign-out-alt mr-2" /> Logout
              </a>
            </div>
          </li>
        </ul>
      </nav>
    );
  }
}

export default withRouter(Header);