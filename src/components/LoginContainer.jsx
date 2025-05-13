import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const LoginContainer = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // const response = await fetch("http://localhost:3000/api/users/login", {
      const response = await fetch(
        "https://backendos.onrender.com/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, senha }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("nivel", data.nivel);
        navigate("/solicitation");
      } else {
        setErro(data.message || "Erro ao fazer login");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setErro("Erro no servidor. Tente novamente.");
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 border border-black-300">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">
          Acesse o Sistema
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border-2 focus:border-emerald-700 focus:ring-emerald-800"
                style={{ paddingLeft: "5px" }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 border-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                  style={{ paddingLeft: "5px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            {erro && <p className="text-red-600 text-sm text-center">{erro}</p>}
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-500 transition duration-300"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default LoginContainer;
