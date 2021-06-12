import { useState } from "react";
import "../index.css";
import "../App.css";

const Search = (props) => {
  const [queryString, setQueryString] = useState("");

  return (
    <div class="flex justify-center">
      <input
        onChange={(e) => {
          setQueryString(e.target.value);
        }}
        value={queryString}
        class="flex appearance-none justify-center block w-half items-center bg-gray-200 text-grey-darker border border-grey-lighter rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-grey"
        placeholder="Search..."
      />
    </div>
  );
};

export default Search;
