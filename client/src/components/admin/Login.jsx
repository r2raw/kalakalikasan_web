import React from "react";
import brand_logo from "../../assets/images/brand_logo.png";
function Login() {
  return (
    <div className="min-h-dvh bg-light_gradient_bot grid grid-cols-2 items-center px-60 py-80">
      <div className="flex justify-center items-center h-full border-r-2 border-dark_font">
        <img className="h-60" src={brand_logo} alt="brand logo" />
      </div>
      <div className=" flex flex-col justify-between h-full items-center gap-4 px-40">
        <h1 className="text-dark_font">Sign In</h1>
        <form className="flex flex-col gap-4 w-full">
          <input className="border border-dark_font rounded-2xl px-4" placeholder="Username" type="text" />
          <input className="border border-dark_font rounded-2xl px-4" placeholder="Password" type="password" />
          <button className="bg-dark_font rounded-2xl py-2 text-lg text-white" type="submit">Login</button>
        </form>
        <h6 className="text-light_font">Forgot Password?</h6>
      </div>
    </div>
  );
}

export default Login;
