import { Outlet } from "react-router-dom";
import { Column } from "../design/Grid";
import Navbar from "./navbar/Navbar";


const AuthenticatedLayout = () => {
  return (
    <Column width="100vw" height="100vh">
      <Navbar />
      <nav>
        <ul>
          <li>
            <a href="/dashboard">Dashboard</a>
          </li>
          <li>
            <a href="/profile">Profile</a>
          </li>
          <li>
            <a href="/settings">Settings</a>
          </li>
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
    </Column>
  );
};

export default AuthenticatedLayout;
