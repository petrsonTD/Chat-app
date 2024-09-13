import { useState } from "react";

function Login({ handleLogin, handleSignup, errors, setErrors }) {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const toggleMode = () => {
    setErrors(null);
    setMode(prev => prev === "login" ? "signup" : "login");
  };

  function removeError(e) {
    console.log(e.target.id);
    const elementId = e.target.id;
    setErrors(prevErrors => ({
      ...prevErrors,
      [elementId]: null
    }));
  };

  return(
    <form
      method="post"
      onSubmit={mode === "login" ? handleLogin : handleSignup}
      className="absolute flex items-center justify-center min-h-screen w-screen backdrop-blur-sm"
    >
      <div className="bg-slate-800 p-5 rounded-3xl shadow-[0_0px_50px_rgba(255,255,255,0.5)]">
        <h2 className="text-3xl text-white">
          {mode === "login" ? "Login" : "Signup"}
        </h2>

        <div className="mt-4">
          <label htmlFor="username" className="block text-base font-semibold text-white">
            Username
          </label>
          <input
            id="username"
            type="text"
            name="username"
            required
            onClick={removeError}
            className={`mt-1 block w-full px-3 py-2 bg-slate-200 border-2 ${errors?.username ? "border-red-500" : ""} rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500`}
          />
        </div>

        <div className="relative mt-2">
          <label htmlFor="password" className="block text-base font-semibold text-white">
            Password
          </label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            required
            onClick={removeError}
            className={`mt-1 block w-full px-3 py-2 pr-10 bg-slate-200 border-2 ${errors?.password ? "border-red-500" : ""} rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500`}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 p-1 mt-[1.7rem] mr-1 text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {mode === "signup" && (<div className="relative mt-2">
          <label htmlFor="repeatPassword" className="block text-base font-semibold text-white">
            Repeat password
          </label>
          <input
            id="repeatPassword"
            type={showPassword ? "text" : "password"}
            name="repeatPassword"
            required
            onClick={removeError}
            className={`mt-1 block w-full px-3 py-2 pr-10 bg-slate-200 border-2 ${errors?.repeatPassword ? "border-red-500" : ""} rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500`}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 p-1 mt-[1.7rem] mr-1 text-slate-400 hover:text-slate-600 active:outline-none"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>)}

        <div className="text-base font-semibold text-red-500 mt-2">
          <span className="block">{errors?.username}</span>
          {mode === "signup" && <span className="block">{errors?.password}</span>}
          <span className="block">{errors?.repeatPassword}</span>
        </div>

        <div className="flex items-center justify-between mt-7">
          <button className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded text-white bg-sky-500 hover:bg-sky-600 focus:bg-sky-700 transition duration-300 ease-in-out">
            {mode === "login" ? "Login" : "Signup"}
          </button>
          <button type="button" onClick={toggleMode} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded text-white bg-slate-800 hover:text-gray-200 active:text-gray-300 transition duration-300 ease-in-out">
            {mode === "login" ? "Switch to Signup" : "Switch to Login"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default Login;
