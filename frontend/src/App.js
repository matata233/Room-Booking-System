import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function App() {
    const userInfo = useSelector((state) => state.auth.userInfo);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo) {  // If userInfo is null, navigate to login
            navigate("/login");
        }
    }, [userInfo, navigate]);
  return (
    <>
      <Header />
      <main className="pt-28">
        <div className="container mx-auto">
          <Outlet />
        </div>
      </main>
      <ToastContainer />
    </>
  );
}

export default App;
