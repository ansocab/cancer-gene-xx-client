import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
// import download from "downloadjs";
import untar from "js-untar";
import BoxPlot from "./BoxPlot";
import BoxPlotModal from "./BoxPlotModal";
import CollapsableCard from "./CollapsableCard";
import { SearchContext } from "../Helpers/search";
import Loading from "./Loading";
import { Modal, Button } from "react-bootstrap";
import "../App.css";
import { merge } from "d3v4";

// const extract = require("extract-zip");
const pako = require("pako");

// fetch everything DONE
// "unarchive" DONE
// for each unarchived file, ungzip it DONE
// for each ungzipped file, find the correct line of text, save to object with key=filename, value=value of matching

export default function DataDownload(props) {
  const { ensgNumber } = useParams();
  const [results, setResults] = useState([]);
  const [boxPlotValues, setBoxPlotValues] = useState([]);

  const [caseIds, setCaseIds] = useState([]);

  const {
    cancerData,
    setCancerData,
    loadingResults,
    setLoadingResults,
    showPlot,
  } = useContext(SearchContext);
  const [boxPlotModalShow, setBoxPlotModalShow] = useState(false);

  const unarchive = async function (files) {
    let unzippedFiles = [];
    try {
      await untar(files).progress(function (extractedFile) {
        const newFileOutput = pako.ungzip(extractedFile.buffer, {
          to: "string",
        });
        unzippedFiles.push({ [extractedFile.name]: newFileOutput });
      });
    } catch (err) {}
    return unzippedFiles;
  };

  function fetchDataValues() {
    fetch("https://api.gdc.cancer.gov/data?tarfile", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ids: props.idArray,
      }),
    })
      .then((r) => r.arrayBuffer())
      .then((r) => unarchive(r))
      .then((files) => {
        setResults(
          files.map((file) => {
            var fileLines = Object.values(file)[0].split("\n");
            for (var i = 0; i < fileLines.length; i++) {
              var y = fileLines[i].split("\t");
              if (y[0].includes(ensgNumber)) {
                return { [Object.keys(file)[0]]: y[1] };
              }
            }
            return { [Object.keys(file)[0]]: "no match" };
          })
        );
      });
  }

  function fetchCaseIds() {
    fetch("https://api.gdc.cancer.gov/v0/graphql", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
				query additionalData($filters: FiltersArgument){
				  viewer {
					repository {
					  files {
						hits(first: 1000, filters: $filters) {
						  edges {
							node {
							 file_id
						
						  data_type
						  cases{
							hits(first: 1000,){
							  edges{
								node{
								  case_id
								
								}
							  }
							}
						  }
						  }
					  }
				  } }
				
				}
				  }}`,
        variables: {
          filters: {
            op: "=",
            content: {
              field: "file_id",
              value: props.idArray,
            },
          },
        },
      }),
    })
      .then((r) => r.json())
      .then((r) => {
        var idArray = [];
        r.data.viewer.repository.files.hits.edges.map((middlePart) =>
          middlePart.node.cases.hits.edges.map((id) =>
            idArray.push(id.node.case_id)
          )
        );
        setCaseIds(idArray);
        fetchCaseData(idArray);
      });
  }

  function fetchCaseData(ids) {
    //setCancerData({});
    fetch("https://api.gdc.cancer.gov/v0/graphql", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
			query additionalData($filters: FiltersArgument){
			  viewer {
				repository {
		  
				
			  cases{
				hits(first: 1000, filters: $filters){
				  edges{
					node{
					  demographic{
						gender
						days_to_death
						vital_status
					  }
					  diagnoses{
						hits(first:100){
						  edges{
							node{
							  tumor_stage
							  tumor_grade
							  
							}
						  }
						}
					  }
					}
				  }
				}
			  }
			}
			  }}`,
        variables: {
          filters: {
            op: "=",
            content: {
              field: "case_id",
              value: ids,
            },
          },
        },
      }),
    })
      .then((r) => r.json())
      .then((r) => {
        let arrayOfDataObjects = [];
        r.data.viewer.repository.cases.hits.edges.map(
          (middlePart, index) =>
            (arrayOfDataObjects[index] = {
              file_id: props.idArray[index],
              gene_value: Number(Object.values(results[index])[0]),
              case_id: ids[index],
              days_to_death: Number(middlePart.node.demographic.days_to_death),
              gender: middlePart.node.demographic.gender,
              vital_status: middlePart.node.demographic.vital_status,
              tumor_grade:
                middlePart.node.diagnoses.hits.edges[0].node.tumor_grade,
              tumor_stage:
                middlePart.node.diagnoses.hits.edges[0].node.tumor_stage,
            })
        );
        setCancerData({ data: arrayOfDataObjects });
        setLoadingResults(false);
      });
  }

  useEffect(() => {
    fetchDataValues();
  }, [props.idArray]);

  useEffect(() => {
    results.length && fetchCaseIds();
  }, [results]);

  useEffect(() => {
    console.log(cancerData);
    Object.keys(cancerData).length !== 0 && getBoxPlotData();
  }, [cancerData]);

  function getBoxPlotData() {
    let helperArray = [];
    results.map((r) => helperArray.push(Object.values(r)[0]));
    setBoxPlotValues(helperArray.map((i) => Number(i)));
  }

  const handleClick1 = (e) => {
    setBoxPlotModalShow(true);
  };

  return (
    <div>
      <CollapsableCard title={`Results for ${ensgNumber}`}>
        {!loadingResults ? (
          <>
            <Button onClick={handleClick1} className=" my-4">
              Get Box Plot
            </Button>

            <BoxPlotModal
              boxPlotModalShow={boxPlotModalShow}
              cancerData={cancerData}
              callback={() => setBoxPlotModalShow(false)}
            />
            {Object.keys(cancerData).length !== 0 && (
              <div style={{ overflowX: "auto" }}>
                <table className="table table-hover">
                  <thead>
                    <tr className="table-primary">
                      <th scope="col">File ID</th>
                      <th scope="col">FPKM of {ensgNumber}</th>
                      <th scope="col">Case ID</th>
                      <th scope="col">Vital Status</th>
                      <th scope="col">Days to Death</th>
                      <th scope="col">Gender</th>
                      <th scope="col">Tumor Grade</th>
                      <th scope="col">Tumor Stage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cancerData.data.map((r) => (
                      <tr>
                        <td>{r.file_id}</td>
                        <td>{r.gene_value}</td>
                        <td>{r.case_id}</td>
                        <td>{r.vital_status}</td>
                        <td>{r.days_to_death}</td>
                        <td>{r.gender}</td>
                        <td>{r.tumor_grade}</td>
                        <td>{r.tumor_stage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <Loading topMargin="0" />
        )}
      </CollapsableCard>
      {showPlot && <BoxPlot cancerData={cancerData} />}
    </div>
  );
}
