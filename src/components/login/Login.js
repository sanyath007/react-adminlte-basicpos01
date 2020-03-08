import React, { Component } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import swal from 'sweetalert';
import { Link } from 'react-router-dom';

const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, 'Username is too short!!')
    .max(50, 'Username is too long!!')
    .required('Usernam is required!!'),
  password: Yup.string()
    .required('Password is required!!')
});

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      alert: null
    };
  }

  componentDidMount() {
    if(localStorage.getItem('TOKEN_KEY') !== null) {
      return this.props.history.goBack();
    }
  }

  submitForm = (values, history) => {
    axios.post('http://localhost:8080/login', values)
      .then(res => {
        console.log(res);
        if(res.data.result === 'success') {
          localStorage.setItem('TOKEN_KEY', res.data.token);
          swal('Success!', res.data.message, 'success')
            .then(value => {
              history.push('/dashboard');
            });
        }
        swal('Success!', res.data.message, 'success');
      })
      .catch(err => {
        console.log(err);
        swal('Error!', err.message, 'error');
      });
  };

  showForm = ({
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    setFieldValue,
    isSubmitting
  }) => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="input-group has-feedback">
          <input
            type="text"
            name="username"
            onChange={handleChange}
            value={values.username}
            placeholder="Username"
            className={
              errors.username && touched.username
                ? "form-control is-invalid"
                : "form-control"
            }
          />
          <div className="input-group-append">
            <div className="input-group-text">
              <span className="fas fa-user"></span>
            </div>
          </div>
        </div>
        {errors.username && touched.username ? (
          <small id="passwordHelp" className="text-danger">
            {errors.username}
          </small>
        ) : null}

        <div className="input-group mt-3 has-feedback">
          <input
            type="password"
            name="password"
            onChange={handleChange}
            value={values.password}
            className="form-control"
            placeholder="Password"
            className={
              errors.password && touched.password
                ? "form-control is-invalid"
                : "form-control"
            }
          />
          <div className="input-group-append">
            <div className="input-group-text">
              <span className="fas fa-lock"></span>
            </div>
          </div>
        </div>
        {errors.password && touched.password ? (
          <small id="passwordHelp" className="text-danger">
            {errors.password}
          </small>
        ) : null}
        
        <div className="row mt-3">
          <div className="col-8">
            <div className="icheck-primary">
              <input type="checkbox" id="remember" />{" "}
              <label htmlFor="remember">Remember Me</label>
            </div>
          </div>
          <div className="col-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-block"
            >
              Sign In
            </button>
          </div>
        </div>
      </form>
    );
  };

  render() {
    return (
      <div className="login-page">
        <div className="register-box">
          <div className="register-logo">
            <a href="../../index2.html">
              <b>Basic</b>POS
            </a>
          </div>

          <div className="card">
            <div className="card-body register-card-body">
              <p className="login-box-msg">Sign in to start your session</p>
              
              <Formik
                initialValues={{
                  username: "",
                  password: ""
                }}

                onSubmit={(values, { setSubmitting }) => {
                  this.submitForm(values, this.props.history);
                  setSubmitting(false);
                }}

                validationSchema={LoginSchema}
              >
                {props => this.showForm(props)}
              </Formik>

              <p className="mb-1">
                <Link to="/password/forgot">I forgot my password</Link>
              </p>
              <p className="mb-0">
                <Link to="/register">Register a new membership</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;