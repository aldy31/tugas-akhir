import React, { useEffect } from "react";
import ProjectCard from "./ProjectCard";
import { useGlobalState } from "../store";
import Hero from "./Hero";

const AllProjects = () => {
  const [projects] = useGlobalState("projects");

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <Hero />
        <div className="flex flex-wrap m-4">
          {projects.map((project, index) => (
            <ProjectCard project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllProjects;
