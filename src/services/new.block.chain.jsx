import abi from "../abis/src/contracts/Genesis.sol/NewGenesis.json";
import address from "../abis/contractAddress.json";
import { getGlobalState, setGlobalState } from "../store";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { errormessage } from "./errors";
import { signMessage } from "./signMessage";
import { Children } from "react";
const { creating, updating, deleting, backing, payout, validating } =
  signMessage;

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
      const signer = provider.getSigner();
      setGlobalState("connectedAccount", account[0]?.toLowerCase());
      const signer_provider = { signer, provider };
      return signer_provider;
    }
  } catch (error) {
    reportError(error);
  }
};

const getEtheriumContract = async () => {
  const signer_provider = await connectWallet();
  const { provider, signer } = signer_provider;
  const contract = new ethers.Contract(contractAddress, contractAbi, provider);
  const signed_contract = contract.connect(signer);
  const contracts = { contract, signed_contract };
  return contracts;
};

const isWallectConnected = async () => {
  try {
    const signer = await connectWallet();
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
    const signer_provider = await connectWallet();
    const { signer } = signer_provider;
    await signer.signMessage(creating);
    const contracts = await getEtheriumContract();
    const { signed_contract } = contracts;
    cost = ethers.utils.parseEther(cost);

    tx = await signed_contract.createProject(
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

const validateProject = async ({ id, validatorName, validationMessage }) => {
  try {
    if (!ethereum) return alert("Please install Metamask");

    const contracts = await getEtheriumContract();
    const { signed_contract } = contracts;

    const signer_provider = await connectWallet();
    const { signer } = signer_provider;
    await signer.signMessage(validating);

    tx = await signed_contract.validateProject(
      id,
      validatorName,
      validationMessage
    );
    await tx.wait();
    await loadProject(id);
    return true;
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

    const signer_provider = await connectWallet();
    const { signer } = signer_provider;
    await signer.signMessage(updating);
    const contracts = await getEtheriumContract();
    const { signed_contract } = contracts;
    tx = await signed_contract.updateProject(
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
    const errMsg = error.message;
    errormessage(errMsg);
  }
};

const deleteProject = async (id) => {
  try {
    if (!ethereum) return alert("Please install Metamask");
    const signer_provider = await connectWallet();
    const { signer } = signer_provider;
    await signer.signMessage(deleting);
    const contracts = await getEtheriumContract();
    const { signed_contract } = contracts;
    await signed_contract.deleteProject(id);
    return true;
  } catch (error) {
    const errMsg = error.message;
    errormessage(errMsg);
  }
};

const loadProjects = async () => {
  try {
    if (!ethereum) return alert("Please install Metamask");

    const contracts = await getEtheriumContract();
    const { contract } = contracts;
    const projects = await contract.getProjects();
    const stats = await contract.stats();
    const owner = await contract.owner();
    setGlobalState("owner", owner?.toLowerCase());
    setGlobalState("stats", structureStats(stats));
    setGlobalState("projects", structuredProjects(projects));
  } catch (error) {
    reportError(error);
  }
};

const loadProject = async (id) => {
  try {
    if (!ethereum) return alert("Please install Metamask");
    const contracts = await getEtheriumContract();
    const { contract } = contracts;

    const project = await contract.getProject(id);
    setGlobalState("project", structuredProjects([project])[0]);
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
    const signer_provider = await connectWallet();
    const { signer } = signer_provider;
    await signer.signMessage(backing);
    const contracts = await getEtheriumContract();

    const { signed_contract } = contracts;

    amount = ethers.utils.parseEther(amount);

    tx = await signed_contract.backProject(id, {
      from: connectedAccount,
      value: amount._hex,
    });

    await tx.wait();
    await getBackers(id);
    return true;
  } catch (error) {
    const dataMsg = error.message;
    errormessage(dataMsg);
  }
};

const getBackers = async (id) => {
  try {
    if (!ethereum) return alert("Please install Metamask");

    const contracts = await getEtheriumContract();

    const { contract } = contracts;

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
    const signer_provider = await connectWallet();
    const { signer } = signer_provider;
    await signer.signMessage(payout);

    const contracts = await getEtheriumContract();

    const { signed_contract } = contracts;

    tx = await signed_contract.payOutProject(id, {
      from: connectedAccount,
    });

    await tx.wait();
    await getBackers(id);
  } catch (error) {
    const errMsg = error.message;
    errormessage(errMsg);
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
      validatorAddress: project.validatorAddress,
      validatorName: project.validatorName,
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
};
