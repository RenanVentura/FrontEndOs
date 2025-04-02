const LoginContainer = () => {
  return (
    <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 border border-black-300">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">
        Acesse o Sistema
      </h2>
      <form>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border-2 focus:border-emerald-700 focus:ring-emerald-800"
              style={{ paddingLeft: "5px" }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="mt-1 block w-full rounded-md border-gray-300 border-2 shadow-sm focus:border-green-500 focus:ring-green-500"
              style={{ paddingLeft: "5px" }}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-500 transition duration-300"
          >
            Entrar
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginContainer;
