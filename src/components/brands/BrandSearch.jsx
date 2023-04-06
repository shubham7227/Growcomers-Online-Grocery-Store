import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchBrands,
  getBrandsSearchQuery,
} from "../../redux/slice/brandSlice";

const BrandSearch = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const oldQuery = useSelector(getBrandsSearchQuery);

  const [query, setQuery] = useState(oldQuery);

  const handleSearch = (e) => {
    e.preventDefault();

    if (query !== oldQuery) {
      const params = {
        query,
      };
      dispatch(fetchBrands(params));
      navigate("/brands");
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex w-max border border-baseGreen pl-4 pr-2 py-1 rounded-sm gap-3"
    >
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-transparent text-uiBlack text-[14px] focus:outline-none sm:w-[300px] w-full"
        placeholder="Search for brands..."
      />
      <button
        type="submit"
        className="text-white bg-baseGreen transition-all duration-150 p-2 sm:text-[24px] text-[20px] rounded-full"
      >
        <FiSearch />
      </button>
    </form>
  );
};

export default BrandSearch;
