import React from 'react';
import { Link } from 'react-router-dom';

interface Props {}

const LandingPage: React.FC<Props> = () => {
  return (
    <div>
      <h1>Bienvenue sur Chess King</h1>
      <div>
        <Link to="/login">
          <button>Connexion</button>
        </Link>
        <Link to="/register">
          <button>S'inscrire</button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;