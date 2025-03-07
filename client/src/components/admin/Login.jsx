import React, { useEffect } from "react";
import brand_logo from "../../assets/images/new_brand_logo.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../../store/slices/authSlice";
import { userLogin } from "../../util/http";

import { useMutation } from "@tanstack/react-query";
function Login() {

  // const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('id');

    if (isLoggedIn) {
      navigate('/admin')
    }
  }, [navigate])


  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: userLogin,
    onSuccess: (data) => {
      localStorage.setItem('id', data)
      navigate("/admin");
    },
  })
  const handleSubmit = (e) => {
    e.preventDefault();
    // dispatch(authActions.login())
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    mutate({ data: data })

  }


  return (
    <div className="min-h-dvh bg-light_gradient_bot grid lg:grid-cols-2 items-center py-20 lg:px-60 lg:py-80">
      <div className="flex justify-center items-center h-full border-r-2 border-dark_font">
        <img className="h-40 lg:h-60" src={brand_logo} alt="brand logo" />
      </div>
      <div className=" flex flex-col justify-between h-full items-center gap-4 px-10 lg:px-40">
        <h1 className="text-dark_font">Sign In</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <input className="border border-dark_font rounded-2xl px-4" placeholder="Username" name="username" type="text" />
          <input className="border border-dark_font rounded-2xl px-4" placeholder="Password" name="password" type="password" />
          <button className="bg-dark_font rounded-2xl py-2 text-lg text-white" type="submit" disabled={isPending}>{isPending ? 'Logging in...' : 'Login'}</button>
        </form>
        {/* <h6 className="text-light_font">Forgot Password?</h6> */}
        {isError && <div className="bg-red-200 w-full px-4 py-4">{error.info?.errors.map((error) => <p key={error} className="text-red-700">{error}</p>) || <p key={error} className="text-red-700">An error occured</p>}
        </div>}
      </div>
    </div>
  );
}

export default Login;
