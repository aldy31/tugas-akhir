import React, { useState } from 'react';
import axios from 'axios';

const PinataForm = () => {
  const [image, setImage] = useState(null);
  const [TTDimage, setTTDimage] = useState(null);
  const [syarat, setSyarat] = useState(null);
  const [uploadedImageCID, setUploadedImageCID] = useState(null);
  const [uploadedTTDimage, setUploadedTTDimage] = useState(null);
  const [uploadedsyarat, setUploadedsyarat] = useState(null);

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
    setUploadedImageCID(null);
  };

  const handleTTDImageChange = (event) => {
    setTTDimage(event.target.files[0]);
    setUploadedTTDimage(null);
  };

  const handleSyaratChange = (event) => {
    setSyarat(event.target.files[0]);
    setUploadedsyarat(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
        // Upload gambar
        if (image) {
          const imageFormData = new FormData();
          imageFormData.append('file', image);
          const imageResponse = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", imageFormData, {
            maxBodyLength: "Infinity",
            headers: {
              'Content-Type': `multipart/form-data;`,
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyODU3OTViZC0yNTVhLTRiZGItYTcwNi0wYWZiZGMyYWMzNDYiLCJlbWFpbCI6ImFsZGlqYXllbmczMUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYjY1ZTA3NzQ0NzE0NmFlYTA2N2YiLCJzY29wZWRLZXlTZWNyZXQiOiJhMGNhNTk0MjM5MWVlYmFmNTE5OGFmZTM0MDUwYmVhNWEyZDM1N2JlOWM0MTVmYzIxNzRkNmJjZGQxMzM5OTJkIiwiaWF0IjoxNzAwNTQ1OTM2fQ.j4D0_MXTWOn9g1OAO4SPRq4hxPog-Cy_w1_Qg5r_DwA',
            }
          });
          setUploadedImageCID(imageResponse.data.IpfsHash);
        }
  
        // Upload TTDimage
        if (TTDimage) {
          const TTDimageFormData = new FormData();
          TTDimageFormData.append('file', TTDimage);
          const TTDimageResponse = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", TTDimageFormData, {
            maxBodyLength: "Infinity",
            headers: {
              'Content-Type': `multipart/form-data;`,
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyODU3OTViZC0yNTVhLTRiZGItYTcwNi0wYWZiZGMyYWMzNDYiLCJlbWFpbCI6ImFsZGlqYXllbmczMUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYjY1ZTA3NzQ0NzE0NmFlYTA2N2YiLCJzY29wZWRLZXlTZWNyZXQiOiJhMGNhNTk0MjM5MWVlYmFmNTE5OGFmZTM0MDUwYmVhNWEyZDM1N2JlOWM0MTVmYzIxNzRkNmJjZGQxMzM5OTJkIiwiaWF0IjoxNzAwNTQ1OTM2fQ.j4D0_MXTWOn9g1OAO4SPRq4hxPog-Cy_w1_Qg5r_DwA',
            }
          });
          setUploadedTTDimage(TTDimageResponse.data.IpfsHash);
        }
  
        // Upload syarat
        if (syarat) {
          const syaratFormData = new FormData();
          syaratFormData.append('file', syarat);
          const syaratResponse = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", syaratFormData, {
            maxBodyLength: "Infinity",
            headers: {
              'Content-Type': `multipart/form-data;`,
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyODU3OTViZC0yNTVhLTRiZGItYTcwNi0wYWZiZGMyYWMzNDYiLCJlbWFpbCI6ImFsZGlqYXllbmczMUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYjY1ZTA3NzQ0NzE0NmFlYTA2N2YiLCJzY29wZWRLZXlTZWNyZXQiOiJhMGNhNTk0MjM5MWVlYmFmNTE5OGFmZTM0MDUwYmVhNWEyZDM1N2JlOWM0MTVmYzIxNzRkNmJjZGQxMzM5OTJkIiwiaWF0IjoxNzAwNTQ1OTM2fQ.j4D0_MXTWOn9g1OAO4SPRq4hxPog-Cy_w1_Qg5r_DwA',
            }
          });
          setUploadedsyarat(syaratResponse.data.IpfsHash);
        }
  
      } catch (error) {
        console.error(error);
      }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-5 bg-white shadow-md rounded-md mb-8">
      <h2 className="text-xl font-bold mb-4">Upload Files to IPFS</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-4">
          Select Image:
          <input type="file" onChange={handleImageChange} accept="image/*" />
        </label>

        <label className="block mb-4">
          Select TTD Image:
          <input type="file" onChange={handleTTDImageChange} accept="image/*" />
        </label>

        <label className="block mb-4">
          Select Zip File (Syarat):
          <input type="file" onChange={handleSyaratChange} accept=".zip" />
        </label>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Upload
        </button>
      </form>

      {uploadedImageCID && (
        <div className="mt-4">
           <h3>Gambar URL: <a href={`https://brown-advanced-parrot-707.mypinata.cloud/ipfs/${uploadedImageCID}`} target="_blank" rel="noopener noreferrer">https://brown-advanced-parrot-707.mypinata.cloud/ipfs/{uploadedImageCID}</a></h3>
        </div>
      )}

      {uploadedTTDimage && (
        <div className="mt-4">
           <h3>Gambar Tanda Tangan URL: <a href={`https://brown-advanced-parrot-707.mypinata.cloud/ipfs/${uploadedTTDimage}`} target="_blank" rel="noopener noreferrer">https://brown-advanced-parrot-707.mypinata.cloud/ipfs/{uploadedTTDimage}</a></h3>
        </div>
      )}

      {uploadedsyarat && (
        <div className="mt-4">
                    <h3>Syarat URL: <a href={`https://brown-advanced-parrot-707.mypinata.cloud/ipfs/${uploadedsyarat}`} target="_blank" rel="noopener noreferrer">https://brown-advanced-parrot-707.mypinata.cloud/ipfs/{uploadedsyarat}</a></h3>
        </div>
      )}
    </div>
  );
};

export default PinataForm;
