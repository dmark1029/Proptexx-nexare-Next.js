/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { Modal } from "@mui/material";
import { useSelector } from "react-redux";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";

const WidgetDocs = ({ getDocs }) => {
  const [documents, setDocuments] = useState(getDocs);

  const { token, user } = useSelector((state) => state.auth.user);
  const [docsData, setDocsData] = useState({
    content: "",
    title: "",
  });
  const [open, setOpen] = useState(false);
  const [isEditId, setIsEditId] = useState("");

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [({ header: 1 }, { header: 2 })],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { outdent: "+1" }],
      [{ direction: "rtl" }],
      [{ size: ["small", false, "large", "huge"] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...docsData,
      slug: docsData.title.replaceAll(" ", "-"),
      userId: user._id,
    };

    try {
      let url = `${process.env.NEXT_PUBLIC_API_URI}/api/docs/createdocs`;
      let method = "post";

      if (isEditId) {
        url = `${process.env.NEXT_PUBLIC_API_URI}/api/docs/docs/${isEditId}`;
        method = "put";
      }

      const response = await axios[method](url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const newDoc = response.data;

      if (isEditId) {
        const updatedDocuments = documents.map((doc) =>
          doc._id === newDoc?.doc._id ? newDoc.doc : doc
        );
        setDocuments(updatedDocuments);
        toast.success("Data Updated Successfully");
      } else {
        setDocuments([...documents, newDoc?.docs]);
        toast.success("Data Added Successfully");
      }

      setOpen(false);
      setDocsData({ title: "", content: "" });
    } catch (error) {
      console.error("Error during the fetch operation:", error);
    }
  };

  // Delete case
  const handleDelete = async (docId) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URI}/api/docs/docs/${docId}`;

      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status !== 200) {
        throw new Error("Error in network response");
      }

      setDocuments(documents.filter((doc) => doc._id !== docId));

      toast.success("Data Deleted Successfully");
    } catch (error) {
      console.error(`Error in deleting document with docId: ${docId}`, error);
      toast.error("Failed to delete document");
    }
  };

  function truncateText(str, maxLength) {
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + "...";
    } else {
      return str;
    }
  }

  return (
    <div className="mt-20 mx-[5%] mb-[80px] ">
      <button
        className="!bg-mainColor text-sm font-bold  text-white p-4 rounded"
        onClick={() => {
          setIsEditId(false);
          setOpen(true);
          setDocsData({
            title: "",
            content: "",
          });
        }}
      >
        Add Docs
      </button>

      <table className="border-collapse border border-slate-400  border-spacing-6 w-full mt-2">
        <thead className="bg-black text-white h-14 ">
          <tr>
            <th className="border border-slate-300 ">Title</th>
            {/* <th className="border border-slate-300 ">Content</th> */}
            <th className="border border-slate-300 ">Rich Text Editor</th>
            <th className="border border-slate-300  ">Update</th>
            <th className="border border-slate-300 ">Delete</th>
          </tr>
        </thead>
        {documents?.map((item, index) => (
          <tr key={index} className="text-center border border-slate-300 ">
            {/* <td>{item._id}</td> */}
            {/* <td className="border border-slate-300  ">{item.slig}</td> */}
            <td className="border border-slate-300  whitespace-pre-wrap">
              {item.title}
            </td>
            <td className="border border-slate-300  ">
              {truncateText(item.content, 100)}
            </td>
            <td className="text-center border border-slate-300 ">
              <button
                onClick={() => {
                  setIsEditId(item?._id);
                  setOpen(true);
                  setDocsData({
                    title: item.title,
                    content: item.content,
                  });
                }}
                className="!bg-mainColor text-sm  text-white p-4 rounded "
              >
                Update
              </button>
            </td>
            <td className="text-center border border-slate-300 ">
              <button
                className="!bg-mainColor text-sm  text-white p-4 rounded "
                onClick={() => handleDelete(item._id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </table>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-100 rounded px-14 shadow-lg"
          style={{ width: "59vw", height: "70vh", overflow: "auto" }}
        >
          <div className="flex justify-center my-5">
            <img
              src="/images/nexa-logo.png"
              className="mr-3 h-[30px] sm:!h-[35px]"
              alt="Proptexx Logo"
              style={{ filter: "brightness(0%)" }}
            />
          </div>
          <form action="" onSubmit={handleSubmit}>
            <input
              type="text"
              className="w-full mb-5 h-10 border-[1px] border-black rounded-md "
              onChange={(e) =>
                setDocsData({ ...docsData, title: e.target.value })
              }
              value={docsData.title}
            />
            <div style={{ marginBottom: "20px" }}>
              <ReactQuill
                theme="snow"
                value={docsData.content}
                onChange={(val) => setDocsData({ ...docsData, content: val })}
                modules={modules}
                style={{
                  overflow: "auto",
                }}
              />
              <button
                type="submit"
                className="w-full text-xl font-bold !bg-black text-white mt-5 p-3 overflow-auto"
              >
                {isEditId ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default WidgetDocs;
