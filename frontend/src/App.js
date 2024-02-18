import { Outlet } from "react-router-dom";
import Header from "./components/Header";

function App() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-center px-12 pt-28 sm:px-20">
        <div className="container mx-auto">
          <Outlet />
        </div>
      </main>
    </>
  );
}

export default App;
