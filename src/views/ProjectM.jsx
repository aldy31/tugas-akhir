import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BackProject from "../components/BackProject";
import DeleteProject from "../components/DeleteProject";
import ProjectBackers from "../components/ProjectBackers";
import ProjectDetails from "../components/ProjectDetails";
import UpdateProject from "../components/UpdateProject";
import { getBackers, loadProject } from "../services/new.block.chain";
import { useGlobalState } from "../store";
import ValidateProject from "../components/ValidateProject";
import ProjectDetailsM from "../components/ProjectDetailsM";
import ValidateProjectM from "../components/ValidateProjectM";

const ProjectM = () => {
  const { id } = useParams();
  const [loaded, setLoaded] = useState(false);
  const [project] = useGlobalState("project");
  const [backers] = useGlobalState("backers");

  useEffect(async () => {
    console.log("Project",project);
    await loadProject(id);
    await getBackers(id);
    setLoaded(true);
  }, []);
  return loaded ? (
    <>
      <ProjectDetailsM project={project} />
      <ValidateProjectM project={project} />
      <UpdateProject project={project} />
      <DeleteProject project={project} />
      <BackProject project={project} />
      <ProjectBackers backers={backers} />
    </>
  ) : null;
};

export default ProjectM;
