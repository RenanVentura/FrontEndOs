import React from "react";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import Logo from "../assets/favicon.ico";
import LogoQually from "../assets/Logo Qually-Sem fundo.png";

const Header = () => {
  const token = localStorage.getItem("token");
  const userLevel = token ? jwtDecode(token).nivel : null;

  return (
    <header className="bg-white shadow-md w-full p-4 bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-900 rounded-b-md">
      <div className="container mx-auto flex justify-between items-center">
        <img src={LogoQually} alt="Logo" className="h-15 hidden md:block" />
        <img src={Logo} alt="Logo" className="h-10 md:hidden" />
        <nav>
          <ol className="flex space-x-6 items-center">
            <li>
              <Link to="/solicitation">
                <button className="h-8 w-22 hover:bg-emerald-700 text-emerald-50 font-bold transition-colors rounded-full">
                  Solicitação
                </button>
              </Link>
            </li>
            <li>
              <Link to="/hubsolicitation">
                <button className="h-8 w-22 hover:bg-emerald-700 text-emerald-50 font-bold transition-colors rounded-full">
                  Follow-up
                </button>
              </Link>
            </li>
            {userLevel !== 1 && (
              <li>
                <Link to="/register">
                  <button className="h-8 w-22 hover:bg-emerald-700 text-emerald-50 font-bold transition-colors rounded-full">
                    Cadastro
                  </button>
                </Link>
              </li>
            )}
          </ol>
        </nav>
      </div>
    </header>
  );
};

export default Header;
