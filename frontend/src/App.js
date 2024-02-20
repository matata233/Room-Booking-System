import { Outlet } from "react-router-dom";
import Header from "./components/Header";

function App() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen justify-center px-12 pt-28 sm:px-20">
        <Outlet />
      </main>
    </>
  );
}

export default App;
