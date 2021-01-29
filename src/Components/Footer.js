import React from "react";
import { Github } from "react-bootstrap-icons";

export default function Footer() {
  return (
    <footer className="d-flex justify-content-center align-items-center">
      <span>{`© 2021 Svenja Niehus & Ana Caballero`}</span>
      <div className="vertical-line-footer"></div>
      <span className="mr-2">Code:</span>
      <span>
        <a
          href="https://github.com/ansocab/cancer-gene-xx-client"
          target="_blank"
          rel="noreferrer"
        >
          <Github size={16} />
        </a>
      </span>
    </footer>
  );
}
