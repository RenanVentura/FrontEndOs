import LogoQuallY from "../assets/Logo Qually-Sem fundo.png";

const LoginHeader = () => {
  return (
    <header className="w-full bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-900 p-4 shadow-lg rounded-b-md">
      <div className="container mx-auto flex items-center justify-center">
        <img src={LogoQuallY} alt="Logo QuallY" className="h-20 w-auto" />
      </div>
    </header>
  );
};

export default LoginHeader;
