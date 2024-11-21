"use client";
import React, { useEffect, useState } from "react";

const WidgetDownloadPdf = () => {
  const [documents, setDocuments] = useState([]);
  const getDocsList = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URI}/api/docs/documents`,
        {
          cache: "no-cache",
        },
      );
      if (!response.ok) {
        throw new Error("Network response not ok");
      }
      const docs = await response.json();
      setDocuments(docs?.docs);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };
  useEffect(() => {
    getDocsList();
  }, []);

  return (
    <>
      <div
        id="content-to-pdf"
        style={{
          visibility: "hidden",
          position: "absolute",
          height: "0",
          overflow: "hidden",
        }}>
        {documents?.map((item, index) => (
          <div key={index} className="h-auto">
            <div dangerouslySetInnerHTML={{ __html: item.content }} />
          </div>
        ))}
      </div>
    </>
  );
};

export default WidgetDownloadPdf;
