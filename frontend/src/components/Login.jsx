import { useState } from "react";

function Login({ handleLogin }) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return(
    <form method="post" onSubmit={handleLogin} className="absolute flex items-center justify-center min-h-screen w-screen backdrop-blur-sm">
      <div className="bg-slate-800 p-5 rounded-3xl shadow-[0_0px_50px_rgba(255,255,255,0.5)]">
        <div>
          <label htmlFor="username" className="block text-base font-semibold text-slate-200">Username</label>
          <input
            id="username"
            type="text"
            name="username"
            required
            className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 text-slate-200"
          />
        </div>

        <div className="relative">
          <label htmlFor="password" className="block text-base font-semibold text-slate-200">Password</label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            required
            className="mt-1 block w-full px-3 py-2 pr-10 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500  text-slate-200"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 p-1 mt-[1.7rem] mr-1 text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <button className="mt-5 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded text-white bg-sky-500 hover:bg-sky-600 focus:bg-sky-700 transition duration-300 ease-in-out">
          Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default Login;
