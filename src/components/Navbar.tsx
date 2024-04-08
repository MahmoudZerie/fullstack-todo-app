import { NavLink, useLocation } from "react-router-dom";

const Navbar = () => {
  const {pathname}=useLocation();
  const storageKey="loggedInUser"
  const userDataString=localStorage.getItem(storageKey);
  const userData=userDataString?JSON.parse(userDataString):null;

  const onLogout=()=>{
    localStorage.removeItem(storageKey);
    setTimeout(()=>{
      location.replace(pathname);
    },1500)
  }
  return (
    <nav className="max-w-lg mx-auto mt-7 mb-20 bg-[#445069] px-3 py-5 rounded-md">
      <ul className="flex items-center justify-between">
        <li className="text-white duration-200 font-semibold text-lg">
          <NavLink to="/">Home</NavLink>
        </li>
        <p className="flex items-center space-x-3">
        <li className="text-white duration-200 font-semibold text-lg">
             {userData?<NavLink to="/todos">Todos</NavLink>:null}
          </li>
          <li className="text-white duration-200 font-semibold text-lg">
             {userData?<NavLink to="/profile">Profile</NavLink>:<NavLink to="/register">Register</NavLink>}
          </li>
          <li className="text-white duration-200 font-semibold text-lg">
            {userData?<span className="cursor-pointer" onClick={onLogout}>Logout</span>:<NavLink to="/login">Login</NavLink>}
          </li>
        </p>
      </ul>
    </nav>
  );
};

export default Navbar;
