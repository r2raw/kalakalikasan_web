import { useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import _ from 'lodash';
import AdminNav from "../components/navigations/AdminNav";


import AccountCircleSharpIcon from "@mui/icons-material/AccountCircleSharp";
import { getURLString } from "../myFunctions/myFunctions";
import { useQuery } from "@tanstack/react-query";
import { fetchUserData } from "../util/http";
import { useDispatch } from "react-redux";
import { currentUserActions } from "../store/slices/currentUserSlice";
import ErrorBlock from "../components/models/ErrorBlock";
import CustomLoader from "../components/models/CustomLoader";

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const userId = localStorage.getItem('id');
  const dispatch = useDispatch();
  useEffect(() => {
    const isLoggedIn = userId;
    if (!isLoggedIn) {
      return navigate('/login');
    }
  }, [navigate, userId])


  const { data, isPending, isError, error } = useQuery({
    queryKey: ['user', { id: userId }],
    queryFn: ({ signal }) => fetchUserData({ signal, id: userId }),

  })

  useEffect(() => {
    if (data) {
        dispatch(currentUserActions.usersData(data)); // ✅ 
    }
}, [data, dispatch]); // ✅ Runs only when `data` updates

  let content = <></>
  let currentRoute = getURLString(location, 2);


  if (!currentRoute) {
    currentRoute = 'Dashboard'
  }

  if (currentRoute) {
    currentRoute = _.startCase(currentRoute.replace('-', ' '))
  }
  let nameHeader = 'Administrator'

  if (isPending) {
    nameHeader = 'Loading...';
    content = <CustomLoader />
  }

  if (isError) {
    nameHeader = error.info?.errors[0] || 'Error loading admin name'
    content = <ErrorBlock message={error.info?.errors || ['An error occured']} />
  }

  if (data) {

    const { firstname, lastname } = data;
    content = <Outlet />
    nameHeader = _.startCase(`${firstname} ${lastname}`)
  }
  return (
    <div className="flex bg-base_color">
      <AdminNav />
      <main className="h-full w-full ml-[20%] px-2 md:px-4">
        <div className="px-4 py-16 flex justify-between items-center text-secondary_color">
          <h1 className="text-lg md:text-2xl lg:text-4xl">{currentRoute}</h1>
          <NavLink to={'my-profile'} className="flex gap-2 items-center">
            <AccountCircleSharpIcon />
            <h4 className="text-sm md:text-lg lg:text-xl">{nameHeader}</h4>
          </NavLink>
        </div>
        <div className=" bg-base_color min-h-[80dvh] w-full rounded-md shadow-2xl px-2 md:px-4 py-4 mb-8">
          {content}
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
