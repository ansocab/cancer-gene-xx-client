import React, { useState, useEffect } from "react";
import GdcWorkflowChoice from "./GdcWorkflowChoice";
import { Form, Col } from "react-bootstrap";
import "../App.css";

export default function GdcDataTypeChoice(props) {
  console.log(props.category);
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
                          hits(first: 10, filters: $filters) {
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
                  value: ["TCGA-LIHC"],
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

  const handleClick = (e) => {
    setSelectedType(e.target.value);
    console.log(selectedType);
  };

  const handleChange = (e) => {
    const selection = e.target.id;
    let previousSelection = selectedType;

    if (e.target.checked) {
      previousSelection.push(selection);
    } else {
      const index = selectedType.indexOf(selection);
      previousSelection.splice(index, 1);
    }
    setSelectedType(previousSelection);
    setShowWorkflow(true);
    console.log(selectedType);
    console.log(showWorkflow);
  };

  return (
    <>
      <Col md="6" xl="3">
        <h3>Data Type</h3>
        {uniqueDataType ? (
          <fieldset>
            <div className="form-group">
              {uniqueDataType.map((type) => (
                <div className="custom-control custom-checkbox">
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
      <div>
        {showWorkflow && (
          <>
            <GdcWorkflowChoice
              dataType={selectedType}
              category={props.category}
            />
          </>
        )}
      </div>
    </>
  );
}
