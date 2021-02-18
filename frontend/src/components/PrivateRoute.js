import React from 'react';
import {Route, Redirect} from 'react-router-dom';

const PrivateRoute = ({appwrite: appwrite, component: Component, auth: auth, ...rest}) => (
  <Route {...rest} render={(props) => {
    return localStorage.getItem('token') ? <Component {...props} auth = {auth} /> : <Redirect to='/login' />;
    // return localStorage.getItem('token') ? <Redirect to='/signup' /> : <Component {...props} auth = {auth} /> 

  }} />
);

export default PrivateRoute;







// import React from 'react';
// import { Route, Redirect } from 'react-router-dom';
// import { connect } from 'react-redux';
// import PropTypes from 'prop-types';

// const PrivateRoute = ({ component: Component, auth: auth, ...rest }) => (
//   <Route
//     {...rest}
//     render={(props) => {
//       if (auth.isLoading) {
//         return <h2>Loading...</h2>;
//       } else if (!auth.isAuthenticated) {
//         return <Redirect to="/login" />;
//       } else {
//         return <Component {...props} />;
//       }
//     }}
//   />
// );

// const mapStateToProps = (state) => ({
//   auth: state.auth,
// });

// export default connect(mapStateToProps)(PrivateRoute);
