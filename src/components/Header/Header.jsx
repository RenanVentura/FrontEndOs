import React from "react";
import Logo from "../../assets/favicon.ico";

const Header = () => {
  return (
    <header className="bg-white shadow-md w-full p-4 bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-900 rounded-b-md">
      <div className="container mx-auto flex justify-between items-center ">
        <img src={Logo} alt="Logo" className="h-10" />
        <nav>
          <ol className="flex space-x-6">
            <li className="hover:text-emerald-600 cursor-pointer text-emerald-50 font-bold">
              Solicitação
            </li>
            <li className="hover:text-emerald-600 cursor-pointer text-emerald-50 font-bold">
              Follow-up
            </li>
            <li className="hover:text-emerald-600 cursor-pointer text-emerald-50 font-bold">
              Cadastro
            </li>
          </ol>
        </nav>
      </div>
    </header>
  );
};

export default Header;
