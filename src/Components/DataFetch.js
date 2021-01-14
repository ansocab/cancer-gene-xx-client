import React, { useState, useEffect, useContext, useRef } from "react";
import DataDownload from "./DataDownload";
import { SearchContext } from "../Helpers/search";
import { SessionContext } from "../Helpers/session";
import "../App.css";

export default function DataFetch(props) {
  const [dataFetchManifest, setDataFetchManifest] = useState([]);
  const [idArray, setIdArray] = useState([]);
  const { search, setSearchSummary } = useContext(SearchContext);
  const { session } = useContext(SessionContext);

  useEffect(() => {
    // Eventuell nur speichern, wenn Daten abrufbar
    setSearchSummary({
      ensg_number: search,
      project: props.project,
      category: props.category,
      data_type: props.dataType,
      workflow: props.workflow,
    });
  }, []);

  function getDataFetchManifest() {
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
                          hits(first: 10, filters: $filters) {
                            edges {
                              node {
                               file_id    
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
              {
                op: "in",
                content: {
                  field: "analysis.workflow_type",
                  value: props.workflow,
                },
              },
            ],
          },
        },
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setDataFetchManifest(res.data.viewer.repository.files.hits.edges);
      });
  }

  useEffect(() => {
    getDataFetchManifest();
  }, [props.workflow]);

  useEffect(() => {
    buildIdArray();
  }, [dataFetchManifest]);

  function buildIdArray() {
    let helperArray = [];
    dataFetchManifest.map((manifest) =>
      helperArray.push(manifest.node.file_id)
    );
    setIdArray(helperArray);
  }

  return (
    <>
      {idArray.length && (
        <>
          <p>{idArray}</p>
          <DataDownload idArray={idArray} />
        </>
      )}
    </>
  );
}
