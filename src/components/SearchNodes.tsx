import { useState } from "react";
import { useNodes } from "../context/nodes/index.tsx";
import "./SearchNodes.css";

export const SearchNodes = () => {
  const [search, setSearch] = useState("");
  const { searchNodes } = useNodes();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    searchNodes(e.target.value);
  };
  return (
    <div className="search-nodes">
      <input
        type="text"
        placeholder="Search skills..."
        value={search}
        onChange={handleSearch}
      />
    </div>
  );
};
