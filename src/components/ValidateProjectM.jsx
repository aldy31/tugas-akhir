import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { validateProject } from "../services/new.block.chain";
import { useGlobalState, setGlobalState } from "../store";

const ValidateProjectM = ({ project }) => {
  const [validateModal] = useGlobalState("validateModal");
  const [validationMessage, setValidationMessage] = useState("");
  const [validatorName, setValidatorName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((!validationMessage, !validatorName)) return;

    const params = {
      id: project?.id,
      validatorName,
      validationMessage,
    };

    const bool = await validateProject(params);
    if (bool == true) {
      toast.success(`Project Validated by ${validatorName}! Now Can Be Backed`);
      onClose();
    }
  };

  const onClose = () => {
    setGlobalState("validateModal", "scale-0");
    reset();
  };

  const reset = () => {
    setValidatorName("");
    setValidationMessage("");
  };

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex
    items-center justify-center bg-black bg-opacity-50
    transform transition-transform duration-300 ${validateModal}`}
    >
      <div
        className="bg-white shadow-xl shadow-black
        rounded-xl w-11/12 md:w-2/5 h-7/12 p-6"
      >
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex justify-between items-center">
            <p className="font-semibold">Validate Project</p>
            <button
              onClick={onClose}
              type="button"
              className="border-0 bg-transparent focus:outline-none"
            >
              <FaTimes />
            </button>
          </div>
          <div
            className="flex justify-between items-center
          bg-gray-300 rounded-xl mt-5"
          >
            <input
              className="block w-full bg-transparent
            border-0 text-sm text-slate-500 focus:outline-none
            focus:ring-0"
              type="text"
              name="name"
              placeholder="Validator Name"
              onChange={(e) => setValidatorName(e.target.value)}
              value={validatorName}
              required
            />
          </div>
          <div
            className="flex justify-between items-center
          bg-gray-300 rounded-xl mt-5"
          >
            <textarea
              className="block w-full bg-transparent
            border-0 text-sm text-slate-500 focus:outline-none
            focus:ring-0"
              type="text"
              name="message"
              placeholder="Validation Message"
              onChange={(e) => setValidationMessage(e.target.value)}
              value={validationMessage}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="inline-block px-6 py-2.5 bg-blue-600
            text-white font-medium text-md leading-tight
            rounded-full shadow-md hover:bg-blue-700 mt-5"
          >
            Validate Project
          </button>
        </form>
      </div>
    </div>
  );
};

export default ValidateProjectM;
