import { buttonStyles, textColorStyles, transitioner } from "../../utils/styles/styles";
import { signInWithPopup, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

import BracuLogo from "../../assets/bracu-logo.svg";
import { useAuth } from "../../utils/contexts/AuthContext";
import { useEffect } from "react";
import { useLoadingScreen } from "../../utils/contexts/LoadingScreenContext";
import { auth } from "../../db/remote/firebase";
import { domainKey, studentDomainValue, staffDomainValue } from "../../utils/contants";

const Login = () => {
    const { showLoadingScreen, hideLoadingScreen } = useLoadingScreen();
    const { user, login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user)
            navigate("/");
    }, [navigate, user]);

    const authenticate = () => {
        showLoadingScreen("Authenticating, please wait");
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then(result => {
                const user = {
                    email: result.user.email,
                    uid: result.user.uid,
                    displayName: result.user.displayName,
                    photoURL: result.user.photoURL,
                    accessToken: result.user.stsTokenManager.accessToken,
                    refreshToken: result.user.stsTokenManager.refreshToken,
                    expirationTime: result.user.stsTokenManager.expirationTime,
                    [domainKey]: result.user.email.endsWith("@bracu.ac.bd") ? staffDomainValue : (result.user.email.endsWith("@g.bracu.ac.bd") ? studentDomainValue : null)
                }
                login(user);
                navigate("/");
                hideLoadingScreen();
            }).catch(error => {
                hideLoadingScreen();
                alert("Whoops! Something went wrong. Please try again.");
            })
    }

    return <div className="w-[100%] min-h-[100vh] flex flex-col justify-center gap-5">
        <div className={`mx-auto ${buttonStyles.primary} flex flex-row w-[90%] rounded-3xl md:w-[40%] lg:w-[25%] gap-10`} onClick={authenticate}>
            <img src={BracuLogo} alt="Brac University" className="w-[40%]" />
            <span className={`text-[1.8rem] inline-block my-auto`}>
                Login
            </span>
        </div>
        <div className="flex md:flex-row w-[90%] rounded-3xl md:w-[40%] lg:w-[25%] mx-auto justify-between px-5">
            <Link className={`${textColorStyles.clickable} ${transitioner.simple}`} target="_blank" rel="noreferrer" to="/privacy-policy">Privacy Policy</Link>
            <Link className={`${textColorStyles.clickable} ${transitioner.simple}`} target="_blank" rel="noreferrer" to="/terms-of-service">Terms of Service</Link>
        </div>
    </div>
}

export default Login;

