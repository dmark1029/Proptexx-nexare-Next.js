"use client";
import React, { useState } from "react";
import "../../styles/WidgetDocs1.css";
import TableNoDataAvailable from "@/components/NodataWithLoading";
const WidgetDocs = () => {
  const [loading, setLoading] = useState(false);

  const [clickedItem, setClickedItem] = useState("Installation");
  const [documents, setDocuments] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);

  const [copiedIndex, setCopiedIndex] = useState(null);
  const handleCopy = (textContent, index, event) => {
    navigator.clipboard
      .writeText(textContent)
      .then(() => {
        event.target.textContent = "Copied!";

        setTimeout(() => {
          event.target.textContent = textContent;
        }, 1000);
      })
      .catch((err) => console.error("Failed to copy: ", err));
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URI}/api/docs/documents`,
        { cache: "no-cache" }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const docs = await response.json();
      setDocuments(docs?.docs);
      setIsDataFetched(true);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleItemClick = (title) => {
    setClickedItem(title);
  };
  if (!isDataFetched) {
    fetchData();
  }
  return (
    <>
      {loading ? (
        <div className="loader-container">
          <TableNoDataAvailable />
        </div>
      ) : !isDataFetched || documents.length === 0 ? (
        <div>Loading ....</div>
      ) : (
        <div className="sticky md:!h-[calc(100vh-200px)]  w-full   container">
          <div className="flex flex-col md:!flex-row  ">
            <div className="w-full md:!w-2/12 bg-white p-6 md:ml-36 lg:ml-64 left-side-content">
              <p className="font-semibold text-lg text-gray-800">
                Getting Started
              </p>
              {documents.map((docs, index) => (
                <div
                  key={index}
                  onClick={() => handleItemClick(docs.title)}
                  className={`cursor-pointer docs-title ${
                    clickedItem === docs.title
                      ? "text-clicked"
                      : "text-muted-foreground"
                  }`}
                >
                  <p className="docs-title">{docs.title}</p>
                </div>
              ))}
            </div>

            <div className="w-full md:!w-10/12 ml-2 md:ml-4 lg:ml-6 mt-4 right-side-content ">
              {documents.map((doc, index) => (
                <div
                  key={index}
                  className={`editor-content ${
                    clickedItem === doc.title ? "visible" : "content-section"
                  }`}
                  onClick={(e) => {
                    if (e.target.tagName === "PRE") {
                      handleCopy(e.target.textContent, index, e);
                    }
                  }}
                >
                  {/* {copiedIndex === index && (
                    <div className="copied-message">Copied!</div>
                  )} */}

                  <div dangerouslySetInnerHTML={{ __html: doc.content }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WidgetDocs;
