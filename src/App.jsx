import { useEffect, useState } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Header from "./components/Header";
import Home from "./views/Home";
import Project from "./views/Project";
import {
  isWallectConnected,
  loadProject,
  loadProjects,
} from "./services/new.block.chain";
import { ToastContainer } from "react-toastify";
import PinataForm from "./components/pinataForm";
import AllProjects from "./components/AllProjects";
import { getGlobalState, useGlobalState } from "./store";
import ProjectM from "./views/ProjectM";
import PageNotFound from "./views/404";

const App = () => {
  const [loaded, setLoaded] = useState(false);
  const [projects] = useGlobalState("projects");

  useEffect(async () => {
    await isWallectConnected();
    await loadProjects();
    console.log("Blockchain loaded");
    setLoaded(true);
  }, []);

  return (
    <div className="min-h-screen relative">
      <Header />

      {loaded ? (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects/:id" element={<ProjectM />} />
          <Route path="/projects" element={<AllProjects />} />
          <Route path="/pinataForm" element={<PinataForm />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      ) : null}
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default App;
