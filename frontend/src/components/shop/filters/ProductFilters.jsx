import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearSearchFilter,
  fetchFilteredProducts,
  getPriceRange,
  getSearchBrand,
  getSearchCategory,
  getSearchOrder,
  getSearchPrice,
  getSearchQuery,
} from "../../../redux/slice/productSlice";
import BrandFilter from "./BrandFilter";
import CategoryFilter from "./CategoryFilter";
import PriceFilter from "./PriceFilter";

const ProductFilters = () => {
  const dispatch = useDispatch();

  const order = useSelector(getSearchOrder);
  const query = useSelector(getSearchQuery);
  const selectedPriceRange = useSelector(getSearchPrice);
  const priceRange = useSelector(getPriceRange);
  const prevCategories = useSelector(getSearchCategory);
  const prevBrands = useSelector(getSearchBrand);

  const [range, setRange] = useState(selectedPriceRange);
  const [categories, setCategories] = useState(null);
  const [brand, setBrand] = useState([]);

  const handleFilter = async () => {
    const _categories = categories?.value;
    const _brands = brand.map((entry) => entry.value);
    const params = {
      query,
      order,
      price: range.toString(),
      categories: _categories,
      brands: _brands.toString(),
    };
    dispatch(fetchFilteredProducts(params));
  };

  const clearFilter = () => {
    dispatch(clearSearchFilter());
    setBrand([]);
    setCategories(null);
    setRange(priceRange);
  };

  useEffect(() => {
    setRange(selectedPriceRange);
  }, [selectedPriceRange]);

  useEffect(() => {
    setBrand(prevBrands);
  }, [prevBrands]);

  useEffect(() => {
    if (prevCategories) {
      setCategories(prevCategories);
    }
  }, [prevCategories]);

  return (
    <div className="sm:sticky sm:top-24 flex flex-col gap-5 p-4 h-max sm:w-[300px]">
      <h3 className="text-uiBlack font-medium text-[18px]">Filters</h3>

      <CategoryFilter categories={categories} setCategories={setCategories} />
      <PriceFilter priceRange={priceRange} range={range} setRange={setRange} />
      <BrandFilter brand={brand} setBrand={setBrand} />
      <div className="flex flex-row items-center gap-4">
        <button
          type="button"
          onClick={clearFilter}
          className="bg-transparent border border-uiGrey text-textDim rounded-sm py-2 text-sm transition-all duration-150 hover:bg-greyLight flex-1"
        >
          Clear Filters
        </button>
        <button
          type="button"
          onClick={handleFilter}
          className="border border-baseGreen text-uiWhite rounded-sm py-2 text-sm transition-all duration-150 bg-baseGreen hover:bg-darkGreen flex-1"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default ProductFilters;
