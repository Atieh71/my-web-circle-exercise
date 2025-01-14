import { useState } from "react";
import styles from "./SearchField.module.css";

const SearchField = ({ onSearchChange }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
    onSearchChange(event.target.value);
  };

  return (
    <div className={styles.wrapper}>
      <input
        placeholder="Filter dishes..."
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default SearchField;
