import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from "../context/AuthProvider";
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { v4 as uuidv4 } from 'uuid'; // Import uuid

const LOGIN_URL = '/login';

interface Auth {
  username: string;
  email: string;
  pwd: string;
  roles: string[];
  accessToken: string;
  roomId: string; // Add roomId to the Auth interface
}

const Login = () => {
    const { setAuth } = useContext(AuthContext);
    const emailRef = useRef<HTMLInputElement>(null);
    const errRef = useRef<HTMLParagraphElement>(null);

    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        emailRef.current?.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [email, pwd])

    const handleSubmit = async (e: React.FormEvent) => {
        console.log("handleSubmit called");
        e.preventDefault();

        try {
            console.log("Submitting login request");
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ email, password: pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            ); 
            console.log("Server response data:", response?.data);
            console.log(JSON.stringify(response?.data));
            const accessToken = response.data.token;
            const roles = response?.data?.roles;
            const username = response?.data?.username; // Retrieve username from response
            const roomId = uuidv4(); // Generate a new roomId
            setAuth({ email, pwd, roles, accessToken, username, roomId }); // Set roomId in the auth object
            setEmail('');
            setPwd('');
            setSuccess(true);
        } catch (err: any) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Email or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current?.focus();
        }
    }

    return (
        <>
            {success ? (
                <section>
                    <h1>Vous êtes connecté !</h1>
                    <br />
                    <p>
                       <Link to="/homepage"> <button>Aller à l'accueil !</button></Link> 
                    </p>
                </section>
            ) : (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Se connecter </h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="email">Email :</label>
                        <input
                            type="email"
                            id="email"
                            ref={emailRef}
                            className="input-field"
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                        />

                        <label htmlFor="password">Mot de passe :</label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                        />
                        <button>Se connecter</button> 
                    </form>
                    <p>
                    Besoin d'un compte ?<br />
                        <span className="line">
              <Link to="/register">S'inscrire</Link>
            </span>
                    </p>
                </section>
            )}
        </>
    )
}

export default Login;
