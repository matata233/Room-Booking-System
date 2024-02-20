import { Outlet } from "react-router-dom";
import Header from "./components/Header";

function App() {
  return (
    <>
      <Header />
      <main className="pt-28">
        <div className="container mx-auto">
          <Outlet />
        </div>

      </main>
    </>
  );
}

export default App;
