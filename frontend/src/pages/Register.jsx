import RegisterForm from "../components/RegisterForm.jsx"
import LoginForm from "../components/LoginForm.jsx"
import {useEffect} from "react";
import "../components/Navbar.jsx"
import { Link } from "react-router-dom";
import styles from "../styles/home.module.css";
import blob3 from "../imgs/blob3.svg";
import blob4 from "../imgs/blob4.svg";

function Register({login}) {
    if (login===1) {
        return(
        <>
            <img id="blob1" src={blob4} alt="blob"/>
            <RegisterForm />
            <img id="blob2" src={blob3} alt="blob4"/>

        </>);
    } else {
        return(
        <>
            <img id="blob1" src={blob4} alt="blob"/>
            <LoginForm />
            <img id="blob2" src={blob3} alt="blob4"/>
        </>);
    }
}




/*
import RegisterForm from "../components/RegisterForm.jsx";
import '../styles/Register.css';


function Register() {

    return(
    <>
        <MainContent />
    </>
    );
}

function MainContent() {
    return (
        <>
            <div className={'RegisterMainContent'}>
                <h1>Get Started Now</h1>
                <h5>Create an account or login.</h5>
                <form>
                    <TextField title='Username' placeholderText='janedoe123' />
                    <TextField title='Email' placeholderText='janedoe@email.com' />
                    <PasswordField />
                    <RegisterButton />
                </form>
                <SignIn />
                <TermsOfService />
            </div>
        </RegisterForm>
    );
}


function TextField({ placeholderText, title }) {
    return (
        <>
            <h3>{title}</h3>
            <input type="text" placeholder={placeholderText} id={title}></input>
        </>
    );
}
function PasswordField() {
    return (
        <>
            <h3>{'Password'}</h3>
            <input type="password" id="password" placeholder={"***********"}></input>
            <h3>{'Confirm Password'}</h3>
            <input type="password" id="confirmPassword" placeholder={"***********"}></input>
        </>
    );
}

function RegisterButton() {
    return (
        <>
            <input type='submit' value='Register' id='RegisterButton'></input>
        </>
    );
}

function SignIn() {
    return (
        <p>Already have an account? <a href="google.com">Sign in</a></p>
    );
}

function TermsOfService() {
    return (
        <p>By creating an account, you agree to the <br /><a href="google.com">Terms of Service</a> and the <a>Privacy Policy</a></p>
    );
}
*/

export default Register