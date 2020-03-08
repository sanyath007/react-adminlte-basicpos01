import React, { Component } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import swal from 'sweetalert';

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, 'Username is too short!!')
    .max(50, 'Username is too long!!')
    .required('Username is required!!'),
  email: Yup.string()
    .email('Invalid email!!')
    .required('Email is required!!'),
  password: Yup.string()
    .required('Password is required!!'),
  confirm_password: Yup.string().oneOf(
    [Yup.ref('password'), null],
    'Both password need to be the same!!'
  )
});

class Register extends Component {
  submitForm = (values, history) => {
    console.log(values);
    axios.post('http://localhost:8080/register', values)
      .then(res => {
        console.log(res);
        if(res.data.result === 'success') {
          swal('Success!', res.data.message, 'success')
          .then(value => {
            history.push('/login');
          });
        } else {
          swal("Error!", res.data.message, "error");
        }
      })
      .catch(err => {
        console.log(err);
        swal('Error!', 'Unexpected error', 'error');
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
        <div className="form-group has-feedback">
          <input 
            type="text"
            name="username"
            onChange={handleChange}
            value={values.username}
            className={
              errors.username && touched.username
                ? "form-control is-invalid"
                : "form-control"
            }
            placeholder="Username"
          />
          {errors.fullname && touched.fullname ? (
            <small id="passwordHelp" className="text-danger">
              {errors.username}
            </small>
          ) : null}
        </div>
        <div className="form-group has-feedback">
          <input
            type="text"
            name="email"
            onChange={handleChange}
            value={values.email}
            className={
              errors.email && touched.email
                ? "form-control is-invalid"
                : "form-control"
            }
            placeholder="Email"
          />
          {errors.email && touched.email ? (
            <small id="passwordHelp" className="text-danger">
              {errors.email}
            </small>
          ) : null}
        </div>
        <div className="form-group has-feedback">
          <input
            type="password"
            name="password"
            onChange={handleChange}
            value={values.password}
            className={
              errors.password && touched.password
                ? "form-control is-invalid"
                : "form-control"
            }
            placeholder="Password"
          />
          {errors.password && touched.password ? (
            <small id="passwordHelp" className="text-danger">
              {errors.password}
            </small>
          ) : null}
        </div>
        <div className="form-group has-feedback">
          <input
            type="password"
            name="confirm_password"
            onChange={handleChange}
            className={
              errors.confirm_password && touched.confirm_password
                ? "form-control is-invalid"
                : "form-control"
            }
            placeholder="Confirm Password"
          />
          {errors.confirm_password && touched.confirm_password ? (
            <small id="passwordHelp" className="text-danger">
              {errors.confirm_password}
            </small>
          ) : null}
        </div>
        <div className="row">
          <div className="col-md-12">
            <button
              disabled={isSubmitting}
              type="submit"
              className="btn btn-primary btn-block btn-flat"
            >
              Confirm
            </button>
          </div>
        </div>
      </form>
    );
  }

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
              <p className="login-box-msg">Register a new membership</p>

              <Formik
                initialValues={{
                  fullname: "",
                  email: "",
                  password: "",
                  confirm_password: ""
                }}

                onSubmit={(values, { setSubmitting }) => {
                  this.submitForm(values, this.props.history);
                  setSubmitting(false);
                }}

                validationSchema={SignupSchema}
              >
                {props => this.showForm(props)}
              </Formik>
              </div>{/* /.form-box */}
          </div>{/* /.card */}
        </div>
      </div>
    );
  }
}

export default Register;