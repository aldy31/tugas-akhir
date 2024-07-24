import React from "react";
import { useNavigate } from "react-router-dom";
import Identicons from "react-identicons";
import { FaEthereum } from "react-icons/fa";
import {
  daysRemaining,
  setGlobalState,
  truncate,
  useGlobalState,
} from "../store";
import { payoutProject } from "../services/new.block.chain";

const ProjectCard = ({ project }) => {
  const { id, title, imageURL, validatorName, validationMessage, validatorAddress} = project;
  
  console.log("Project", project);
  const [connectedAccount] = useGlobalState("connectedAccount");
  const [owner] = useGlobalState("owner");

  const expired = new Date().getTime() > Number(project?.expiresAt + "000");
  console.log(new Date().getTime());
  console.log(Number(project?.expiresAt + "000"));
  console.log(expired)

  return (
    <div className="max-w-sm mx-auto bg-gray border border-gray-200 rounded-lg shadow mb-4">
      <img
          src={imageURL}
          alt={title}
          className="rounded-xl h-64 w-full object-cover"
        />
      <div className="p-5">
      <h5>{truncate(title, 25, 0, 28)}</h5>
        {/* <h5 className="mb-2 text-2xl tracking-tight text-gray-900 dark:text-black">
          {title}
        </h5> */}

        <div className="flex-1 sm:py-0 py-4">
            <div className="flex flex-col justify-start flex-wrap">
              {/* {project?.validated ? (
                <small className="text-gray-500">
                  {expired
                    ? "Expired"
                    : `${daysRemaining(project.expiresAt)} Tersisa`}
                </small>
              ) : (
                <small className="text-gray-500"></small>
              )} */}
            </div>

            <div className="flex justify-between items-center w-full pt-1">
              <div className="flex justify-start space-x-2">
                <Identicons
                  className="rounded-full shadow-md"
                  string={project?.owner}
                  size={15}
                />
                {project?.owner && (
                  <small className="text-gray-700">
                    {truncate(project?.owner, 4, 4, 11)}
                  </small>
                )}
                <small className="text-gray-500 font-bold">
                  {project?.backers} Donatur{project?.backers !== 1 && "s"}
                </small>
              </div>
              {project?.validated ? (
                <div className="font-bold">
                  <small className="text-green-500 m-4">Validated</small>
                  {expired ? (
                    <small className="text-red-500">Expired</small>
                  ) : (
                    <>
                      {project?.status === 0 && (
                        <small className="text-gray-500">Pending</small>
                      )}
                      {project?.status === 1 && (
                        <small className="text-green-500">Open</small>
                      )}
                      {project?.status === 2 && (
                        <small className="text-gray-500">Approved</small>
                      )}
                      {project?.status === 3 && (
                        <small className="text-red-500">Reverted</small>
                      )}
                      {project?.status === 4 && (
                        <small className="text-orange-500">Deleted</small>
                      )}
                      {project?.status === 5 && (
                        <small className="text-orange-500">Paid</small>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="font-bold">
                  <small className="text-red-500">belum divalidasi</small>
                </div>
              )}
            </div>

            <div>
              <div className="w-full overflow-hidden bg-gray-300 mt-4">
                <div
                  className="bg-green-600 text-xs font-medium text-green-100 text-center p-0.5 leading-none rounded-l-full h-1 overflow-hidden max-w-full"
                  style={{
                    width: `${(project?.raised / project?.cost) * 100}%`,
                  }}
                ></div>
              </div>

              <div className="flex justify-between items-center font-bold mt-2">
                <small>{project?.raised} ETH Terkumpul</small>
                <small className="flex items-center">
                  <FaEthereum />
                  <span className="ml-1">{project?.cost} ETH</span>
                </small>
              </div>
              </div>
            </div>
        
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
        Nama Validator : {validatorName}
        </p>
 
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
        Alamat Validator :{validatorAddress}
        </p>

        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
        Pesan Validator :  {validationMessage}
        </p>

        <div className="text-center">
          {" "}
          <a
            href={`/projects/${id}`}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Selengkapnya
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
