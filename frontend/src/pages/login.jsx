import RegisterForm from "../components/RegisterForm.jsx";

function Login() {
    return <RegisterForm route="/api/token/" method="login" />;
}

export default Login