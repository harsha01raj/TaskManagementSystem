import { Search } from "lucide-react";

function FilterBar({ query, onQuery, children }) {
  return (
    <div className="filter-bar">
      <label className="search-field">
        <Search size={18} />
        <input value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Search" />
      </label>
      <div className="filter-selects">{children}</div>
    </div>
  );
}

export default FilterBar;
