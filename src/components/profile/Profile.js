import React, { Component } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import swal from 'sweetalert';
import fs from 'fs';

const ProfileSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, 'Username is too short!!')
    .max(50, 'Username is too long!!')
    .required('Username is required!!'),
  first_name: Yup.string()
    .min(2, 'Firstname is too short!!')
    .max(30, 'Firstname is too long!!')
    .required('Firstname is required!!'),
  last_name: Yup.string()
    .min(2, 'Lastname is too short!!')
    .max(30, 'Lastname is too long!!')
    .required('Lastname is required!!'),
  phone: Yup.string()
    .min(10, 'Phone is too short!!')
    .required('Phone is required!!'),
  address: Yup.string()
    .min(12, 'Address is too short!!')
    .max(50, 'Address is too long!!')
    .required('Address is required!!'),
  email: Yup.string()
    .email('Email is invalid!!')
    .required('Email is required!!')
});

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      response: {},
      error_message: null,
      avatar: ''
    }
  }

  submitForm = async formData => {
    console.log(formData);
  }

  showForm = ({
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    onSubmit,
    isSubmitting,
    setFieldValue
  }) => {    
    return (
      <form role="form" onSubmit={handleSubmit}>
        <div className="card-body">
          <input type="hidden" name="id" value={values._id} />
          <div className="form-group has-feedback">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              onChange={handleChange}
              value={values.username}
              className={
                errors.username && touched.username
                  ? "form-control is-invalid"
                  : "form-control"
              }
              id="username"
              placeholder="Enter Username"
            />
            {errors.username && touched.username ? (
              <small id="passwordHelp" class="text-danger">
                {errors.username}
              </small>
            ) : null}
          </div>
          <div className="form-group has-feedback">
            <label htmlFor="username">First Name</label>
            <input
              onChange={handleChange}
              value={values.first_name}
              type="text"
              className={
                errors.first_name && touched.first_name
                  ? "form-control is-invalid"
                  : "form-control"
              }
              id="first_name"
              placeholder="Enter First Name"
            />
            {errors.first_name && touched.first_name ? (
              <small id="passwordHelp" class="text-danger">
                {errors.first_name}
              </small>
            ) : null}
          </div>
          <div className="form-group has-feedback">
            <label htmlFor="last_name">Last Name</label>
            <input
              onChange={handleChange}
              value={values.last_name}
              type="text"
              className={
                errors.last_name && touched.last_name
                  ? "form-control is-invalid"
                  : "form-control"
              }
              id="last_name"
              placeholder="Enter Last Name"
            />
            {errors.last_name && touched.last_name ? (
              <small id="passwordHelp" class="text-danger">
                {errors.last_name}
              </small>
            ) : null}
          </div>
          <div className="form-group has-feedback">
            <label htmlFor="phone">Phone number</label>
            <input
              onChange={handleChange}
              value={values.phone}
              type="text"
              className={
                errors.phone && touched.phone
                  ? "form-control is-invalid"
                  : "form-control"
              }
              id="phone"
              placeholder="Enter phone number"
            />
            {errors.phone && touched.phone ? (
              <small id="passwordHelp" class="text-danger">
                {errors.phone}
              </small>
            ) : null}
          </div>
          <div className="form-group has-feedback">
            <label htmlFor="address">Address</label>
            <textarea
              onChange={handleChange}
              value={values.address}
              className={
                errors.address && touched.address
                  ? "form-control is-invalid"
                  : "form-control"
              }
              id="address"
              placeholder="Address"
            />
            {errors.address && touched.address ? (
              <small id="passwordHelp" class="text-danger">
                {errors.address}
              </small>
            ) : null}
          </div>
        </div>
        {}
        <div className="card-footer">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-block btn-primary"
          >
            Save
          </button>
        </div>
      </form>
    );
  }
  render() {
    let result = this.state.response;

    return (
      <div className="content-wrapper">
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="offset-md-3 col-sm-8">
                <h1>Profile</h1>
              </div>
            </div>
          </div>
          {/* /.container-fluid */}
        </section>

        <section className="content">
          <div className="container-fluid">
            <div className="row">
              {/* left column */}
              <div className="offset-md-3 col-md-6">
                {/* general form elements */}
                <div className="card card-primary">
                  <div className="card-header">
                    <h3 className="card-title">Update Profile</h3>
                  </div>

                  <Formik
                    initialValues={
                      result
                        ? result
                        : {
                          id: '',
                          username: '',
                          email: '',
                          first_name: '',
                          last_name: '',
                          phone: '',
                          address: ''
                        }
                    }

                    onSubmit={(values, { setSubmitting }) => {
                      let formData = new FormData();
                      formData.append("id", values._id);
                      formData.append("username", values.username);
                      formData.append("first_name", values.first_name);
                      formData.append("last_name", values.last_name);
                      formData.append("phone", values.phone);
                      formData.append("address", values.address);
                      formData.append("email", values.email);

                      if(values.avatars) {
                        formData.append("avatars", values.avatars);
                      }
                      
                      console.log(values.avatars);
                      this.submitForm(formData, this.props.history);
                      setSubmitting(false)
                    }}
                  >
                    {props => this.showForm(props)}
                  </Formik>

                </div>{/* /.card */}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default Profile;