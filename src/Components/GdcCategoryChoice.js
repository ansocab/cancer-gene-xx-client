import React, { useState, useEffect } from "react";
import { Form, Col } from "react-bootstrap";
import GdcDataTypeChoice from "./GdcDataTypeChoice";
import "../App.css";

export default function GdcCategoryChoice(props) {
  const [gdcCategories, setGdcCategories] = useState([]);
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [showDataType, setShowDataType] = useState(false);

  function getGdcCategories() {
    fetch("https://api.gdc.cancer.gov/v0/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `
                query DataCategoryFileCounts($filters: FiltersArgument) {
                        projects {
                          hits(first: 10, filters: $filters) {
                            edges {
                              node {
                               project_id
                                
                                summary {
                                  data_categories {
                                    data_category
                                    file_count
                                  }
                                }
                              }
                            }
                        }
                    } 
                      }`,
        variables: {
          filters: {
            op: "=",
            content: { field: "project_id", value: props.project },
          },
        },
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setGdcCategories(res.data.projects.hits.edges);
      });
  }

  useEffect(() => {
    getGdcCategories();
  }, []);

  useEffect(() => {
    showCategories();
  }, [gdcCategories]);

  function showCategories() {
    let helperSet = new Set();
    gdcCategories.map((category) =>
      category.node.summary.data_categories.map((subcategory) =>
        helperSet.add(subcategory.data_category)
      )
    );

    setUniqueCategories(Array.from(helperSet));
  }

  const handleChange = (e) => {
    const selection = e.target.id;
    let previousSelection = selectedCategory;

    if (e.target.checked) {
      previousSelection.push(selection);
    } else {
      const index = selectedCategory.indexOf(selection);
      previousSelection.splice(index, 1);
    }
    setSelectedCategory(previousSelection);
    setShowDataType(true);
    console.log(selectedCategory);
    console.log(showDataType);
  };

  return (
    <>
      <Col md="6" xl="3">
        <h3>Categories</h3>
        {uniqueCategories ? (
          <fieldset>
            <div className="form-group">
              {uniqueCategories.map((category) => (
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id={category}
                    onChange={handleChange}
                  />
                  <label className="custom-control-label" for={category}>
                    {category}
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
        {showDataType && (
          <>
            <GdcDataTypeChoice category={selectedCategory} />
          </>
        )}
      </>
    </>
  );
}
