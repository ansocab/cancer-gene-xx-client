import React, { useEffect, useState, useContext } from "react";
import BoxPlot from "./BoxPlot";
import { SearchContext } from "../Helpers/search";
import { Modal, Button } from "react-bootstrap";
import "../App.css";

export default function BoxPlotModal(props) {
  const [showModal, setShowModal] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const {
    selectedSort,
    setSelectedSort,
    setCategorySet,
    showPlot,
    setShowPlot,
    setOpenResults,
    setOpenBoxPlot,
  } = useContext(SearchContext);

  useEffect(() => {
    setShowModal(props.boxPlotModalShow);
  }, [props.boxPlotModalShow]);

  const handleHide = () => {
    setShowModal(false);
    props.callback();
  };

  const handleChange = (e) => {
    if (e.target.checked) {
      setSelectedSort(e.target.id);
      setShowButton(true);
    } else {
      setShowButton(false);
      setSelectedSort("");
    }
  };

  const handleClick = (e) => {
    setShowPlot(true);
    setOpenResults(false);
    setOpenBoxPlot(true);
    handleHide();
  };

  useEffect(() => {
    console.log(selectedSort.length);
    selectedSort.length && makeCategories();
  }, [selectedSort]);

  const makeCategories = () => {
    console.log(selectedSort.length);
    let helperSet = new Set();
    props.cancerData.data.map((categories) =>
      helperSet.add(categories[selectedSort])
    );
    helperSet.delete("not reported");
    setCategorySet(Array.from(helperSet));
    console.log(helperSet);
  };

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="justify-content-md-center"
      show={showModal}
      onHide={handleHide}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Create Boxplot
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Choose category to sort the data by:
        <fieldset>
          <div className="form-group">
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="vital_status"
                onChange={handleChange}
              />
              <label className="custom-control-label" for="vital_status">
                Vital Status
              </label>
            </div>
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="gender"
                onChange={handleChange}
              />
              <label className="custom-control-label" for="gender">
                Gender
              </label>
            </div>{" "}
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="tumor_grade"
                onChange={handleChange}
              />
              <label className="custom-control-label" for="tumor_grade">
                Tumor Grade
              </label>
            </div>{" "}
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="tumor_stage"
                onChange={handleChange}
              />
              <label className="custom-control-label" for="tumor_stage">
                Tumor Stage
              </label>
            </div>
          </div>
        </fieldset>
        {showButton && (
          <Button onClick={handleClick} className=" my-4">
            Get Box Plot
          </Button>
        )}
      </Modal.Body>
    </Modal>
  );
}
