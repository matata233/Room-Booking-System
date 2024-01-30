import { Outlet } from "react-router-dom";
import Header from "./components/Header";

function App() {
  return (
    <>
      <Header />
      <main className="py-3">
        <div className="container">
          <Outlet />
        </div>
      </main>
    </>
  );
}

export default App;
