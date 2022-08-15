import { buttonStyles } from "../../utils/styles/styles";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import BracuLogo from "../../assets/bracu-logo.svg";
import { useAuth } from "../../utils/contexts/AuthContext";
import { useEffect } from "react";

const auth = getAuth();

const Login = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user)
            navigate("/");
    }, [navigate, user]);

    const authenticate = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then(result => {
                // const credential = GoogleAuthProvider.credentialFromResult(result);
                // const token = credential.accessToken;
                // user.login(result.user);
                login(result.user);
                navigate("/");
            }).catch(error => {
                alert("Whoops! Something went wrong. Please try again.");
            })
    }

    return <div className="w-[100%] min-h-[100vh] flex flex-col justify-center">
        <div className={`mx-auto ${buttonStyles.primary} flex flex-row w-[70%] rounded-3xl md:w-[40%] lg:w-[25%] gap-10`} onClick={authenticate}>
            <img src={BracuLogo} alt="Brac University" className="w-[40%]" />
            <span className={`text-[1.8rem] inline-block my-auto`}>
                Login
            </span>
        </div>
    </div>
}

export default Login;

