import LoginHeader from "../../components/LoginHeader/LoginHeader";
import LoginContainer from "../../components/LoginContainer/LoginContainer";
import "./Login.css";

function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white-400 to-gray-400">
      <LoginHeader />
      <main className="container mx-auto py-10 px-4">
        <div className="flex justify-center items-center min-h-[calc(85vh-200px)] ">
          <LoginContainer />
        </div>
      </main>
    </div>
  );
}

export default Login;
