import React, { useEffect } from "react";
import brand_logo from "../../assets/images/brand_logo.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../../store/slices/authSlice";
function Login() {

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) navigate('/admin');
  }, [isAuthenticated])

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(authActions.login())

  }
  return (
    <div className="min-h-dvh bg-light_gradient_bot grid lg:grid-cols-2 items-center py-20 lg:px-60 lg:py-80">
      <div className="flex justify-center items-center h-full border-r-2 border-dark_font">
        <img className="h-40 lg:h-60" src={brand_logo} alt="brand logo" />
      </div>
      <div className=" flex flex-col justify-between h-full items-center gap-4 px-10 lg:px-40">
        <h1 className="text-dark_font">Sign In</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
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
