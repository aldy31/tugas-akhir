import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { createProject } from "../services/new.block.chain";
import { useGlobalState, setGlobalState } from "../store";

const CreateProject = () => {
  const [createModal] = useGlobalState("createModal");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");
  const [date, setDate] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [Syarat, setSyarat] = useState("");

  const toTimestamp = (dateStr) => {
    const dateObj = Date.parse(dateStr);
    return dateObj / 1000;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !cost || !date || !imageURL || !Syarat)
      return;

    const params = {
      title,
      description,
      cost,
      expiresAt: toTimestamp(date),
      imageURL,
      Syarat,
    };

    const bool = await createProject(params);
    if (bool == true) {
      toast.success("Project Berhasil Dibuat, akan terlihat dalam 30 detik!");
      onClose();
    }
  };

  const onClose = () => {
    setGlobalState("createModal", "scale-0");
    reset();
  };

  const reset = () => {
    setTitle("");
    setCost("");
    setDescription("");
    setImageURL("");
    setDate("");
    setSyarat("");
  };

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex
    items-center justify-center bg-black bg-opacity-50
    transform transition-transform duration-300 ${createModal}`}
    >
      <div
        className="bg-white shadow-xl shadow-black
        rounded-xl w-11/12 md:w-2/5 h-7/12 p-6"
      >
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex justify-between items-center">
            <p className="font-semibold">Buka Donasi</p>
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
              name="title"
              placeholder="Judul (Nama)"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              required
            />
          </div>

          <div
            className="flex justify-between items-center
          bg-gray-300 rounded-xl mt-5"
          >
            <input
              className="block w-full bg-transparent
            border-0 text-sm text-slate-500 focus:outline-none
            focus:ring-0"
              type="number"
              step={0.01}
              min={0.01}
              name="cost"
              placeholder="Dana yang dibutuhkan ($ETH)"
              onChange={(e) => setCost(e.target.value)}
              value={cost}
              required
            />
          </div>

          <div
            className="flex justify-between items-center
          bg-gray-300 rounded-xl mt-5"
          >
            <input
              className="block w-full bg-transparent
            border-0 text-sm text-slate-500 focus:outline-none
            focus:ring-0"
              type="date"
              name="date"
              placeholder="Expires" 
              onChange={(e) => setDate(e.target.value)}
              value={date}
              required
            />
          </div>

          <div
            className="flex justify-between items-center
          bg-gray-300 rounded-xl mt-5"
          >
            <input
              className="block w-full bg-transparent
            border-0 text-sm text-slate-500 focus:outline-none
            focus:ring-0"
              type="url"
              name="imageURL"
              placeholder="URL Gambar"
              onChange={(e) => setImageURL(e.target.value)}
              value={imageURL}
              required
            />
          </div>

          <div
            className="flex justify-between items-center
          bg-gray-300 rounded-xl mt-5"
          >
            <input
              className="block w-full bg-transparent
            border-0 text-sm text-slate-500 focus:outline-none
            focus:ring-0"
              type="url"
              name="Syarat"
              placeholder="URL Proposal"
              onChange={(e) => setSyarat(e.target.value)}
              value={Syarat}
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
              name="description"
              placeholder="Deskripsi"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="inline-block px-6 py-2.5 bg-blue-600
            text-white font-medium text-md leading-tight
            rounded-full shadow-md hover:bg-blue-700 mt-5"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
