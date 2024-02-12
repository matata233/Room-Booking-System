import { Outlet } from "react-router-dom";
import Header from "./components/Header";

function App() {
  return (
    <>
      <Header />
      <main className="px-12 pt-28 sm:px-20">
        <div className="container mx-auto">
          <Outlet />
        </div>
      </main>
    </>
  );
}

export default App;
