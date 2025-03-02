import { Row } from "@/components/design/Grid";
import LogoutButton from "@/components/guest/pages/loginPage/LogOutButton";

const NavBar = () => {
  return (
    <Row className="w-full justify-end p-4 border-b border-gray-200">
      <LogoutButton />
    </Row>
  );
};

export default NavBar;
