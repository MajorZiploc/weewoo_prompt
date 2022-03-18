import React from 'react';
import { Navigate } from 'react-router-dom';
import DataContext from '../context/DataContext';

const PrivateComponent = ({ element }) => {
  const data = React.useContext(DataContext);
  return data.getAccessToken() ? element : <Navigate to='/login' />;
};

export default PrivateComponent;
