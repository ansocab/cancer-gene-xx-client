import React, { useEffect, useState } from "react";
import { Collapse } from "react-bootstrap";
import { ChevronDown, ChevronUp } from "react-bootstrap-icons";
import "bootswatch/dist/flatly/bootstrap.min.css";

export default function CollapsableCard(props) {
  const [open, setOpen] = useState(props.open);

  useEffect(() => {
    setOpen(props.open);
    console.log(props.open);
  }, [props.open]);

  const handleClick = () => {
    setOpen(!open);
    props.callback();
  };

  return (
    <>
      <div className="card mb-2 mt-4" style={{ borderColor: "#2c3e50" }}>
        <div
          className="card-header custom-collapsable-card-header"
          onClick={handleClick}
          aria-controls="example-collapse-text"
          aria-expanded={open}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="my-1">{props.title}</h4>
            {open ? (
              <ChevronUp className="ml-3" size={20} />
            ) : (
              <ChevronDown className="ml-3" size={20} />
            )}
          </div>
        </div>
        <Collapse in={open}>
          <div className="card-body">{props.children}</div>
        </Collapse>
      </div>
    </>
  );
}
