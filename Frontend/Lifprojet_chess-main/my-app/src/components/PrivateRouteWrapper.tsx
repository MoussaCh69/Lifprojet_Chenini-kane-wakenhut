import React from 'react';
import { useLocation } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthProvider';
import { Navigate } from 'react-router-dom';
import Referee from './Referee/Referee';
import Homepage from './homepage';

interface PrivateRouteWrapperProps {
  component: React.ComponentType<any>;
}

const PrivateRouteWrapper: React.FC<PrivateRouteWrapperProps> = ({ component: Component }) => {
  const { auth } = useContext(AuthContext);

  if (auth) {
    return <Component />;
  }

  return <Navigate to="/login" />;
};

export default PrivateRouteWrapper;
