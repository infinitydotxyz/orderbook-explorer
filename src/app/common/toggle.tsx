import React, { useState } from "react";

interface Props {
  isChecked: boolean;
  toggle: () => void;
}

function ToggleButton(props: Props) {
  const styles = {
    toggleButton: {
      width: "50px",
      height: "25px",
      borderRadius: "25px",
      backgroundColor: props.isChecked ? "#3cba54" : "#ccc",
      position: "relative",
      transition: "background-color 0.2s",
      outline: "none",
    },
    slider: {
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      backgroundColor: "white",
      position: "absolute",
      top: "50%",
      left: props.isChecked ? "calc(100% - 22.5px)" : "2.5px",
      transform: "translate(0, -50%)",
      transition: "left 0.2s",
    },
  } as const;

  return (
    <button style={styles.toggleButton} onClick={props.toggle}>
      <div style={styles.slider}></div>
    </button>
  );
}

export default ToggleButton;
