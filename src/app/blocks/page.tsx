"use client";
import { useEffect, useState } from "react";
import { Block } from "./block";
import { useBlocks } from "./use-blocks";
import ToggleButton from "../common/toggle";

export default function ExecutionBlock() {
  const { blocks, refresh, togglePoll, isPolling } = useBlocks();

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ textAlign: "center" }}>Blocks </h2>

      <div
        style={{
          marginBottom: "1rem",
          marginTop: "1rem",
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
        }}
      >
        Poll Mode
        <div
          style={{
            marginLeft: "0.5rem",
          }}
        >
          <ToggleButton toggle={togglePoll} isChecked={isPolling} />
        </div>
        <button
          style={{
            marginLeft: "0.5rem",
            padding: "0.25rem",
          }}
          onClick={() => {
            refresh();
          }}
        >
          Refresh
        </button>
      </div>

      {blocks.map((block) => {
        return (
          <div
            key={`${block.number}`}
            style={{
              border: "0.5px solid #ccc",
              padding: "0.5rem",
              width: "fit-content",
            }}
          >
            <Block block={block} />
          </div>
        );
      })}
    </div>
  );
}
