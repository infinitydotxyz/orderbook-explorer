import React, { ChangeEvent, FormEvent, useState } from "react";

function SearchBar({ onSearch }: { onSearch: (searchTerm: string) => void }) {
  const [query, setQuery] = useState("");

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(query);
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "start",
        justifyContent: "start",
      }}
    >
      <input
        style={{
          minWidth: "32rem",
          paddingTop: "0.25rem",
          paddingBottom: "0.25rem",
          paddingLeft: "0.25rem",
          paddingRight: "0.25rem",
        }}
        type="text"
        value={query}
        onChange={handleInputChange}
      />
      <button
        style={{
          marginLeft: "0.5rem",
          padding: "0.25rem",
        }}
        type="submit"
      >
        Search
      </button>
    </form>
  );
}

export default SearchBar;
