"use client"
import React, { useState } from 'react';

const CodeSnippetBox = ({ snippet, language }) => {
  const [copySuccess, setCopySuccess] = useState('');

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopySuccess('✓ Copied');
      setTimeout(() => setCopySuccess(""), 2000);

    } catch (err) {
      setCopySuccess('Failed to Copy');
    }
  };

  return (
    <div
      className="my-4"
      style={{
        backgroundColor: "#000",
        padding: "20px",
        borderRadius: "4px",
        position: "relative",
      }}
    >
      <pre
        style={{
          color: "#fff",
          fontFamily: "monospace",
          margin: 0,
          whiteSpace: "pre-wrap",
        }}
      >
        {snippet}
      </pre>
      <button
        onClick={handleCopyCode}
        style={{
          position: "absolute",
          top: "5px",
          right: "5px",
          backgroundColor: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          padding: "5px 10px",
          fontSize: "12px",
        }}
      >
        {copySuccess ? copySuccess : `Copy ${language}`}
      </button>
    </div>
  );
};

export default CodeSnippetBox;
