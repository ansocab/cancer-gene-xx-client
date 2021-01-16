import React, { useState, useEffect } from "react";
import GdcCategoryChoice from "./GdcCategoryChoice";
import { Row, Col } from "react-bootstrap";
import "../App.css";

export default function GdcProjectChoice() {
  const [gdcProjects, setGdcProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [showCategory, setShowCategory] = useState(false);

  function getGdcProjects() {
    fetch("https://api.gdc.cancer.gov/v0/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `
			  
			  query PROJECTS_EDGES($filters_1: FiltersArgument) {
				projects {
				  hits(first: 1000, filters: $filters_1) {
					total
					edges {
					  node {
						name
						project_id
				  
					  }
					}
				  }
				}
			  }
			`,
        variables: {
          filters_1: {
            op: "=",
            content: { field: "project_id", value: ["TCGA*"] },
          },
        },
      }),
    })
      .then((res) => res.json())
      .then((res) => setGdcProjects(res.data.projects.hits.edges));
  }

  useEffect(() => {
    getGdcProjects();
  }, []);

  const handleChange = (e) => {
    const selection = e.target.id;
    let previousSelection = selectedProjects;

    if (e.target.checked) {
      previousSelection.push(selection);
    } else {
      const index = selectedProjects.indexOf(selection);
      previousSelection.splice(index, 1);
    }
    setSelectedProjects(previousSelection);

    if (previousSelection.length !== 0) {
      setShowCategory(true);
    } else {
      setShowCategory(false);
    }
  };

  return (
    <Row className="justify-content-start choice-container mt-5">
      <Col md="6" xl="3">
        <h3>Projects</h3>
        {gdcProjects ? (
          <fieldset className="projects-container">
            <div className="form-group">
              {gdcProjects.map((project) => (
                <div
                  key={project.node.project_id}
                  className="custom-control custom-checkbox"
                >
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id={project.node.project_id}
                    onChange={handleChange}
                  />
                  <label
                    className="custom-control-label"
                    for={project.node.project_id}
                  >
                    {project.node.name}
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
        {showCategory && (
          <>
            <GdcCategoryChoice project={selectedProjects} />
          </>
        )}
      </>
    </Row>
  );
}
