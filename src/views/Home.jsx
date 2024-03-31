import { useEffect } from "react";
import CreateProject from "../components/CreateProject";
import { loadProjects } from "../services/new.block.chain";
import { useGlobalState } from "../store";
import AllProjects from "../components/AllProjects";

const Home = () => {
  const [projects] = useGlobalState("projects");

  useEffect(async () => {
    await loadProjects();
  }, []);
  return (
    <>
      <AllProjects></AllProjects>
      <CreateProject />
    </>
  );
};

export default Home;
