import abi from "../abis/src/contracts/Genesis.sol/NewGenesis.json";
import address from "../abis/contractAddress.json";
import { getGlobalState, setGlobalState } from "../store";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { errormessage } from "./errors";

const { ethereum } = window;
const contractAddress = address.newAddress;
const contractAbi = abi;
let tx;

const connectWallet = async () => {
  try {
    if (!ethereum) {
      alert("Please install Metamask");
      return;
    } else {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const account = await provider.send("eth_requestAccounts", []);
      // const signer = provider.getSigner();
      setGlobalState("connectedAccount", account[0]?.toLowerCase());
      return provider;
    }
  } catch (error) {
    reportError(error);
  }
};

const getEtheriumContract = async () => {
  const provider = await connectWallet();
  const contract = new ethers.Contract(contractAddress, contractAbi, provider);
  return contract;
};

const signer = async () => {
  const contract = await getEtheriumContract();
  const provider = await connectWallet();
  const signer = provider.getSigner();
  const txsigner = contract.connect(signer);
  return txsigner;
};

const isWallectConnected = async () => {
  try {
    if (!ethereum) return alert("Please install Metamask");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const account = await provider.send("eth_requestAccounts", []);
    setGlobalState("connectedAccount", account[0]?.toLowerCase());
  } catch (error) {
    reportError(error);
  }
};

const createProject = async ({
  title,
  description,
  imageURL,
  cost,
  expiresAt,
  Syarat,
}) => {
  try {
    console.log(contractAddress);
    const provider = await connectWallet();
    const code = await provider.getCode(contractAddress);
    cost = ethers.utils.parseEther(cost);
    const signedContract = await signer();
    console.log(code);
    tx = await signedContract.createProject(
      title,
      description,
      imageURL,
      cost,
      expiresAt,
      Syarat
    );
    await tx.wait();
    return true;
  } catch (error) {
    const errMsg = error.message;
    errormessage(errMsg);
  }
};

const validateProject = async ({ id, validationMessage }) => {
  console.log(id);
  try {
    if (!ethereum) return alert("Please install Metamask");

    const signedContract = await signer();
    tx = await signedContract.validateProject(id, validationMessage);
    await tx.wait();
    await loadProject(id);
    return true;
  } catch (error) {
    const errMsg = error.message;
    errormessage(errMsg);
  }
};

const changeValidator = async ({ validatorAddress, validatorName }) => {
  try {
    if (!ethereum) return alert("Please install Metamask");

    const signedContract = await signer();
    const validator = await signedContract.validator();
    if (validator !== validatorAddress) {
      const address = ethers.utils.getAddress(validatorAddress);
      console.log(address);
      tx = await signedContract.changeValidator(address, validatorName);
      await tx.wait();
      return true;
    } else {
      toast.error(`This address is already Validator`);
      return false;
    }
  } catch (error) {
    const errMsg = error.message;
    errormessage(errMsg);
  }
};

const updateProject = async ({
  id,
  title,
  description,
  imageURL,
  expiresAt,
  Syarat,
}) => {
  try {
    if (!ethereum) return alert("Please install Metamask");

    const signedContract = await signer();
    tx = await signedContract.updateProject(
      id,
      title,
      description,
      imageURL,
      expiresAt,
      Syarat
    );
    await tx.wait();
    await loadProject(id);
  } catch (error) {
    reportError(error);
  }
};

const deleteProject = async (id) => {
  try {
    if (!ethereum) return alert("Please install Metamask");
    const signedContract = await signer();
    await signedContract.deleteProject(id);
  } catch (error) {
    reportError(error);
  }
};

const loadProjects = async () => {
  try {
    if (!ethereum) return alert("Please install Metamask");

    const contract = await getEtheriumContract();
    const projects = await contract.getProjects();
    const stats = await contract.stats();
    const validatorName = await contract.validatorName();
    const validator = await contract.validator();
    setGlobalState("validator", validator?.toLowerCase());
    const owner = await contract.owner();
    setGlobalState("owner", owner?.toLowerCase());
    setGlobalState("validatorName", validatorName);
    setGlobalState("stats", structureStats(stats));
    setGlobalState("projects", structuredProjects(projects));
  } catch (error) {
    reportError(error);
  }
};

const loadProject = async (id) => {
  try {
    if (!ethereum) return alert("Please install Metamask");
    const contract = await getEtheriumContract();
    const project = await contract.getProject(id);
    setGlobalState("project", structuredProjects([project])[0]);
    const validator = await contract.validator();
    setGlobalState("validator", validator?.toLowerCase());
    const owner = await contract.owner();
    setGlobalState("owner", owner?.toLowerCase());
    return false;
  } catch (error) {
    const errMsg = error.message;
    errormessage(errMsg);
  }
};

const backProject = async (id, amount) => {
  try {
    if (!ethereum) return alert("Please install Metamask");
    const connectedAccount = getGlobalState("connectedAccount");
    const signedContract = await signer();
    amount = ethers.utils.parseEther(amount);

    tx = await signedContract.backProject(id, {
      from: connectedAccount,
      value: amount._hex,
    });

    await tx.wait();
    await getBackers(id);
    return true;
  } catch (error) {
    const errMsg = error.message;
    const dataMsg = error.data.message;
    errormessage(dataMsg);
  }
};

const getBackers = async (id) => {
  try {
    if (!ethereum) return alert("Please install Metamask");
    const contract = await getEtheriumContract();
    let backers = await contract.getBackers(id);

    setGlobalState("backers", structuredBackers(backers));
  } catch (error) {
    reportError(error);
  }
};

const payoutProject = async (id) => {
  try {
    if (!ethereum) return alert("Please install Metamask");
    const connectedAccount = getGlobalState("connectedAccount");
    const signedContract = await signer();

    tx = await signedContract.payOutProject(id, {
      from: connectedAccount,
    });

    await tx.wait();
    await getBackers(id);
  } catch (error) {
    reportError(error);
  }
};

const structuredBackers = (backers) =>
  backers
    .map((backer) => ({
      owner: backer.owner.toLowerCase(),
      refunded: backer.refunded,
      timestamp: new Date(backer.timestamp.toNumber() * 1000).toJSON(),
      contribution: parseInt(backer.contribution._hex) / 10 ** 18,
    }))
    .reverse();

const structuredProjects = (projects) =>
  projects
    .map((project) => ({
      id: project.id.toNumber(),
      owner: project.owner.toLowerCase(),
      title: project.title,
      description: project.description,
      timestamp: new Date(project.timestamp.toNumber()).getTime(),
      expiresAt: new Date(project.expiresAt.toNumber()).getTime(),
      date: toDate(project.expiresAt.toNumber() * 1000),
      imageURL: project.imageURL,
      raised: parseInt(project.raised._hex) / 10 ** 18,
      cost: parseInt(project.cost._hex) / 10 ** 18,
      backers: project.backers.toNumber(),
      status: project.status,
      Syarat: project.Syarat,
      validated: project.validated,
      validationMessage: project.validationMessage,
    }))
    .reverse();

const toDate = (timestamp) => {
  const date = new Date(timestamp);
  const dd = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
  const mm =
    date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
  const yyyy = date.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
};

const structureStats = (stats) => ({
  totalProjects: stats.totalProjects.toNumber(),
  validedProjects: stats.validedProjects.toNumber(),
  nonValidateProjects: stats.nonValidateProjects.toNumber(),
  totalBacking: stats.totalBacking.toNumber(),
  totalDonations: parseInt(stats.totalDonations._hex) / 10 ** 18,
});

const reportError = (error) => {
  console.log(error.message);
  throw new Error("No ethereum object.");
};

export {
  connectWallet,
  isWallectConnected,
  createProject,
  updateProject,
  deleteProject,
  loadProjects,
  loadProject,
  backProject,
  getBackers,
  payoutProject,
  validateProject,
  changeValidator,
};
