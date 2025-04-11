import Form from "../components/Form.jsx"
function Register() {
    return (
        <>
            <Form />
        </>
    );
}







/*
import Form from "../components/Form.jsx";
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
        </Form>
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