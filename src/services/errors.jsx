import { toast } from "react-toastify";

const errorMessage = {
  notfound: "Project tidak ditemukan",
  alreadyvalidated: "Project sudah di validasi",
  unauthorized: "Entitas tidak sah",
  notvalidated: "Project ini blum di validasi",
  insufficientfunds: "Dana tidak cukup",
  userdenied: "user membatalkan transaksi",
  requestdenied: "User membatalkan request",
};

const {
  notfound,
  alreadyvalidated,
  unauthorized,
  notvalidated,
  insufficientfunds,
  userdenied,
  requestdenied,
} = errorMessage;

export const errormessage = (msg) => {
  console.log(msg);
  if (msg.includes(notfound)) {
    toast.error(`${notfound} with this ID`);
    return false;
  } else if (msg.includes(alreadyvalidated)) {
    toast.error(`This ${alreadyvalidated}`);
    return false;
  } else if (msg.includes(unauthorized)) {
    toast.error("You Have not Permission to this Action");
    return false;
  } else if (msg.includes(notvalidated)) {
    toast.error(`${notvalidated}Validation is must to back the project`);
    return false;
  } else if (msg.includes(insufficientfunds)) {
    toast.error(`${insufficientfunds} for this transaction`);
    return false;
  } else if (msg.includes(userdenied)) {
    toast.error(`${userdenied} Please try again`);
    return false;
  } else if (msg.includes(requestdenied)) {
    toast.error(`User Rejected the Sign Request for this Transaction`);
    return false;
  }
};
