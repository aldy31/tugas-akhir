import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteProject } from "../services/new.block.chain";
import { useGlobalState, setGlobalState } from "../store";

const DeleteProject = ({ project }) => {
  const deleteModal = useGlobalState("deleteModal")[0];
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const bool = await deleteProject(project?.id);
      if (bool) {
        toast.success("Proyek berhasil dihapus, akan terlihat dalam 30 detik.");
        setGlobalState("deleteModal", "scale-0");
        navigate("/");
      } else {
        toast.error("Gagal menghapus proyek.");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex
    items-center justify-center bg-black bg-opacity-50
    transform transition-transform duration-300 ${deleteModal}`}
    >
      <div
        className="bg-white shadow-xl shadow-black
        rounded-xl w-11/12 md:w-2/5 h-7/12 p-6"
      >
        <div className="flex flex-col">
          <div className="flex justify-between items-center">
            <p className="font-semibold">{project?.title}</p>
            <button
              onClick={() => setGlobalState("deleteModal", "scale-0")}
              type="button"
              className="border-0 bg-transparent focus:outline-none"
            >
              <FaTimes />
            </button>
          </div>

          <div className="flex justify-center items-center mt-5">
            <div className="rounded-xl overflow-hidden h-20 w-20">
              <img
                src={
                  project?.imageURL ||
                  "https://media.wired.com/photos/5926e64caf95806129f50fde/master/pass/AnkiHP.jpg"
                }
                alt={project?.title}
                className="h-full w-full object-cover cursor-pointer"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center items-center rounded-xl mt-5">
            <p>Apakah anda Yakin?</p>
            <small className="text-red-400">Ini tidak bisa dibatalkan!</small>
          </div>

          <button
            className="inline-block px-6 py-2.5 bg-red-600
            text-white font-medium text-md leading-tight
            rounded-full shadow-md hover:bg-red-700 mt-5"
            onClick={handleSubmit}
          >
            Hapus Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProject;
