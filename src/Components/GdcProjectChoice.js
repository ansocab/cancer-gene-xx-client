import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import "../App.css";

export default function GdcProjectChoice() {
  const [gdcProjects, setGdcProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);

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
    const selection = e.target.name;
    let previousSelection = selectedProjects;

    if (e.target.checked) {
      previousSelection.push(selection);
    } else {
      const index = selectedProjects.indexOf(selection);
      previousSelection.splice(index, 1);
    }
    setSelectedProjects(previousSelection);
    console.log(selectedProjects);
  };

  if (gdcProjects) {
    return (
      <>
        <Form>
          {gdcProjects.map((project) => (
            //<li key={project.node.project_id}>{project.node.name}</li>
            <Form.Group controlId="formBasicCheckbox">
              <Form.Check
                type="checkbox"
                name={project.node.project_id}
                label={project.node.name}
                onChange={handleChange}
              />
            </Form.Group>
          ))}
        </Form>
      </>
    );
  } else {
    return <h1>loading available GDC projects...</h1>;
  }
}
