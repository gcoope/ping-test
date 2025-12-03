import { useEffect, useState } from "react";
import { useNodes } from "../../context/NodesContext.tsx";
import "./SkillsSearch.css";

export const SkillsSearch = () => {
  const [search, setSearch] = useState("");
  const { searchNodes } = useNodes();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    searchNodes(e.target.value);
  };

  const focusSearch = () => {
    (
      document.querySelector(".search-nodes input") as HTMLInputElement
    )?.focus();
  };

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        focusSearch();
      }
    });

    return () => {
      document.removeEventListener("keydown", (e) => {
        if (e.ctrlKey && e.key === "k") {
          e.preventDefault();
          focusSearch();
        }
      });
    };
  }, []);

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
