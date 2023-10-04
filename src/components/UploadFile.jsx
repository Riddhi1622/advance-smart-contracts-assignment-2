import axios from "axios";
import { useState } from "react";
import { Contract, Signer, ethers } from "ethers";
import { ToastContainer } from "react-toastify";
import { errorToast, successToast, warnToast } from "../Toaster";
import FiredGuys from "../artifacts/contracts/MyNFT.sol/FiredGuys.json";
import $ from "jquery";
import "../../src/App.css";
const JWT = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI0NGVmZGE0My1hOTkxLTQzYWEtOTg5YS0xZDk0ZGM5YWFmZjIiLCJlbWFpbCI6InJpZGRoaTE5MTQxNkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNWU0NDg4M2EzZTJkODBkZjc1ZWYiLCJzY29wZWRLZXlTZWNyZXQiOiJmOTEzYmI3ODZhYWE0MTIyZmYxNTljNzE3N2JjNTQ2OGRkMGQ5ODBmMDJmYjdlOWE3YzI0NzMyZGRmYmM5NTZlIiwiaWF0IjoxNjk2Mzg0OTcxfQ.sUVTcNETGp5evkl74MjAj4oEDM2Q2Jhs7j8CcUUcJbo
`;
const contractAddress = "0xCC92Ab43dF7ff5A8112a5cEBadEAA6aBf94E45d9";
console.log("contractAddress = ", contractAddress);
const provider = new ethers.providers.Web3Provider(window.ethereum);

// get the end user
const signer = provider.getSigner();

// get the smart contract
const contract = new ethers.Contract(contractAddress, FiredGuys.abi, signer);
const contentId = "QmYcZG6mhPFvTtacYBHdnUZLQ8Xhxip4JDYAMiKQTqELHL";
// const metadataURI = `${contentId}/0.json`;
const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}`;
const FileUpload = () => {
  const [balance, setBalance] = useState();
  const [ShowData, setShowData] = useState([]);
  console.log(ShowData);
  const getBalance = async () => {
    const [account] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(account);
    setBalance(ethers.utils.formatEther(balance));
  };
  const [selectedFile, setSelectedFile] = useState();
  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmission = async () => {
    const formData = new FormData();

    formData.append("file", selectedFile);

    const metadata = JSON.stringify({
      name: selectedFile.name,
    });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", options);

    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: "Infinity",
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: JWT,
          },
        }
      );
      console.log(res.data);
      mintToken();
    } catch (error) {
      console.log(error);
    }
  };

  const getData = () => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI0NGVmZGE0My1hOTkxLTQzYWEtOTg5YS0xZDk0ZGM5YWFmZjIiLCJlbWFpbCI6InJpZGRoaTE5MTQxNkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNWU0NDg4M2EzZTJkODBkZjc1ZWYiLCJzY29wZWRLZXlTZWNyZXQiOiJmOTEzYmI3ODZhYWE0MTIyZmYxNTljNzE3N2JjNTQ2OGRkMGQ5ODBmMDJmYjdlOWE3YzI0NzMyZGRmYmM5NTZlIiwiaWF0IjoxNjk2Mzg0OTcxfQ.sUVTcNETGp5evkl74MjAj4oEDM2Q2Jhs7j8CcUUcJbo",
      },
    };

    fetch("https://api.pinata.cloud/data/pinList", options)
      .then((response) => response.json())
      .then((response) => {
        successToast("Data fetched!");
        const filteredItems = response?.rows?.filter((fileName) => {
          // Check if the file name ends with ".jpg" (case-insensitive)
          return fileName?.metadata?.name.toLowerCase().endsWith(".jpg","");
        });
        setShowData(response?.rows);
      })
      .catch((err) => console.error(err));
  };

  //Faccing ISue here.....
  const mintToken = async () => {
    const connection = contract.connect(signer);
    const addr = connection.address;
    const result = await contract.payToMint(addr, imageURI, {
      value: ethers.utils.parseEther("0.05"),
    });
    successToast("Token is Minted!");
    await result.wait();
  };

  return (
    <>
      <div className="text-center p-4">
        <h3>Mint Your NFT...!🌼</h3>
        <p>
          <i>Check Logs if anything is not working...!</i>
        </p>
        <hr />
        <div>
          {balance === undefined ? (
            ""
          ) : (
            <h5 className="card-title">You have {balance} In your Wallet🚀</h5>
          )}
          <button className="btn btn-success me-4" onClick={() => getBalance()}>
            Show My Balance
          </button>
          <button onClick={() => getData()} className="btn btn-warning">
            Show My Uploads
          </button>
          <div className="mt-5 d-flex justify-content-center align-items-center flex-column ">
            <div>
              <label class="form-label">Choose File</label>
              <input type="file" onChange={changeHandler} className="me-2" />
            </div>
            {selectedFile === undefined ? (
              ""
            ) : (
              <button
                className="btn btn-danger mt-3"
                onClick={handleSubmission}
              >
                Mint Your NFT
              </button>
            )}
          </div>
          <div className="d-flex gap-3 mt-5 justify-content-center flex-wrap w-100">
            {ShowData.map((data, idx) => {
              return (
                <>
                  <div className="box d-flex flex-column text-start" id={idx}>
                    <p>
                      <b>File Name:</b>
                      {data.metadata.name}
                    </p>
                    <p>
                      <b>IPFS Hash:</b>
                      <br />
                      {data.ipfs_pin_hash}
                    </p>
                    <p>
                      <b>size : </b>
                      {data.size}
                    </p>
                    <img
                      src={`https://gateway.pinata.cloud/ipfs/${data.ipfs_pin_hash}`}
                      className="w-25 h-25"
                    />
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default FileUpload;
