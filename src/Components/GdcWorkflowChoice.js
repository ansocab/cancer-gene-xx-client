import React, { useState, useEffect, useContext } from "react";
import { SearchContext } from "../Helpers/search";
import { Col, Button } from "react-bootstrap";
import "../App.css";

export default function GdcWorkflowChoice(props) {
  const [gdcWorkflows, setGdcWorkflows] = useState([]);
  const [uniqueWorkflow, setUniqueWorkflow] = useState([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState([]);
  //const [startDataFetch, setStartDataFetch] = useState(false);
  const {
    setSearchSummary,
    setLoadingResults,
    setOpenDataSelection,
    setOpenResults,
    setOpenBoxPlot,
  } = useContext(SearchContext);

  function getGdcWorkflows() {
    fetch("https://api.gdc.cancer.gov/v0/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `
                query WorkflowFileCounts($filters: FiltersArgument) {
                    viewer {
                        repository {
                    files {
                          hits(first: 1000, filters: $filters) {
                            edges {
                              node {
                               file_id
                               data_category
                            data_type
                            analysis{
                                workflow_type
                            }
                            
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
              {
                op: "in",
                content: {
                  field: "data_type",
                  value: props.dataType,
                },
              },
            ],
          },
        },
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setGdcWorkflows(res.data.viewer.repository.files.hits.edges);
      });
  }

  useEffect(() => {
    getGdcWorkflows();
  }, [props.dataType]);

  useEffect(() => {
    showWorkflows();
  }, [gdcWorkflows]);

  function showWorkflows() {
    let helperSet = new Set();
    gdcWorkflows.map((workflow) =>
      helperSet.add(workflow.node.analysis.workflow_type)
    );
    setUniqueWorkflow(Array.from(helperSet));
  }

  const handleChange = (e) => {
    if (e.target.checked) {
      setSelectedWorkflow([...selectedWorkflow, e.target.id]);
    } else {
      setSelectedWorkflow((prev) =>
        prev.filter((item) => item !== e.target.id)
      );
    }
  };

  const handleClick = (e) => {
    const summary = {
      project: props.project,
      category: props.category,
      data_type: props.dataType,
      workflow: selectedWorkflow,
    };

    console.log(summary);

    if (selectedWorkflow.length !== 0) {
      setSearchSummary(summary);
    } else if (
      selectedWorkflow.length === 0 &&
      props.dataType.includes("Clinical Supplement", 0)
    ) {
      setSearchSummary(summary);
    }

    setLoadingResults(true);
    setOpenDataSelection(false);
    setOpenResults(true);
    setOpenBoxPlot(false);
  };

  return (
    <>
      <Col md="6" xl="3">
        <h4>Workflow</h4>
        {uniqueWorkflow ? (
          <fieldset>
            <div className="form-group">
              {uniqueWorkflow
                .filter((item) => item && item.length)
                .map((workflow) => (
                  <div
                    key={workflow}
                    className="custom-control custom-checkbox"
                  >
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id={workflow}
                      onChange={handleChange}
                    />
                    <label className="custom-control-label" for={workflow}>
                      {workflow}
                    </label>
                  </div>
                ))}
            </div>
          </fieldset>
        ) : (
          <h1>loading available GDC workflows...</h1>
        )}
      </Col>
      <Col md={{ span: 6, offset: 6 }} xl={{ span: 3, offset: 9 }}>
        <Button onClick={handleClick} className="my-4">
          Get Data
        </Button>
      </Col>
    </>
  );
}
