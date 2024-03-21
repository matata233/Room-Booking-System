import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import TokenExpirationListener from "./components/TokenExpirationListener";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Header />
      <main className="pt-28">
        <div className="container mx-auto">
          <Outlet />
        </div>
      </main>
        <TokenExpirationListener />
        <ToastContainer />
    </>
  );
}

export default App;
