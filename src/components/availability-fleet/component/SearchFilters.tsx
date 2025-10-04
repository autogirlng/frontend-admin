"use client";

import { Search, Calendar, Filter } from "lucide-react";
import { SearchFilters } from "../types/vehicle";

interface SearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: () => void;
  loading: boolean;
}

const SearchFiltersComponent: React.FC<SearchFiltersProps> = ({
  filters,
  onFiltersChange,
  onSearch,
  loading,
}) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onFiltersChange({
      ...filters,
      [name]: value,
      page: 1,
    });
  };

  const handleSearchClick = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form
      onSubmit={handleSearchClick}
      className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100"
    >
      <div className="flex items-center space-x-2 mb-6">
        <Filter className="w-5 h-5 text-primary-600" />
        <h2 className="text-lg font-semibold text-gray-900">Filter & Search</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div>
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Start Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={filters.startDate}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            End Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="endDate"
              name="endDate"
              type="date"
              value={filters.endDate}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div className="lg:col-span-2">
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Search by Name, Make, Model...
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="search"
              name="search"
              type="text"
              placeholder="e.g., Toyota Camry"
              value={filters.search}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div className="lg:col-start-4 flex justify-end mt-4 lg:mt-0">
          <button
            type="submit"
            disabled={loading}
            className="w-full lg:w-auto px-6 py-2.5 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Search</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchFiltersComponent;
