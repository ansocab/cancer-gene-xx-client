import React, { useState, useEffect } from "react";
import GdcWorkflowChoice from "./GdcWorkflowChoice";
import { Form, Col } from "react-bootstrap";
import "../App.css";

export default function GdcDataTypeChoice(props) {
  const [gdcDataTypes, setGdcDataTypes] = useState([]);
  const [uniqueDataType, setUniqueDataType] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [showWorkflow, setShowWorkflow] = useState(false);

  function getGdcDataTypes() {
    fetch("https://api.gdc.cancer.gov/v0/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `
                query DataTypeFileCounts($filters: FiltersArgument) {
                    viewer {
                        repository {
                    files {
                          hits(first: 1000, filters: $filters) {
                            edges {
                              node {
                               file_id
                               data_category
                            data_type
                            
                            }
                        }
                    } }
                   }}
                      }`,
        variables: {
          filters: {
            op: "and",
            content: [
              {
                op: "in",
                content: {
                  field: "cases.project.project_id",
                  value: props.project,
                },
              },
              {
                op: "in",
                content: {
                  field: "data_category",
                  value: props.category,
                },
              },
            ],
          },
        },
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setGdcDataTypes(res.data.viewer.repository.files.hits.edges);
      });
  }

  useEffect(() => {
    getGdcDataTypes();
  }, [props.category]);

  useEffect(() => {
    showDataTypes();
  }, [gdcDataTypes]);

  function showDataTypes() {
    let helperSet = new Set();
    gdcDataTypes.map((dataType) => helperSet.add(dataType.node.data_type));

    setUniqueDataType(Array.from(helperSet));
  }

  const handleChange = (e) => {
    if (e.target.checked) {
      setSelectedType([...selectedType, e.target.id]);
    } else {
      setSelectedType((prev) => prev.filter((item) => item !== e.target.id));
    }
  };

  useEffect(() => {
    if (selectedType.length !== 0) {
      setShowWorkflow(true);
    } else {
      setShowWorkflow(false);
    }
  }, [selectedType]);

  return (
    <>
      <Col md="6" xl="3">
        <h3>Data Type</h3>
        {uniqueDataType ? (
          <fieldset>
            <div className="form-group">
              {uniqueDataType.map((type) => (
                <div key={type} className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id={type}
                    onChange={handleChange}
                  />
                  <label className="custom-control-label" for={type}>
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>
        ) : (
          <h1>loading available GDC projects...</h1>
        )}
      </Col>
      <>
        {showWorkflow && (
          <>
            <GdcWorkflowChoice
              dataType={selectedType}
              category={props.category}
              project={props.project}
            />
          </>
        )}
      </>
    </>
  );
}
