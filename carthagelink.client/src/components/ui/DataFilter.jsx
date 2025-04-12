import PropTypes from 'prop-types';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

// Reusable Button Filter (from your previous component)
function ButtonFilter({
  options = [],
  selectedValues = [],
  onChange,
  multiple = false,
  variant = 'default'
}) {
  const [selected, setSelected] = useState(selectedValues);

  const handleClick = (value) => {
    let newSelected;
    if (multiple) {
      newSelected = selected.includes(value)
        ? selected.filter(v => v !== value)
        : [...selected, value];
    } else {
      newSelected = selected.includes(value) ? [] : [value];
    }

    setSelected(newSelected);
    onChange(newSelected);
  };

  return (
    <div className={`flex flex-wrap gap-2 ${variant === 'compact' ? 'gap-1' : 'gap-2'}`}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => handleClick(option.value)}
          className={`
            ${variant === 'compact' ? 'px-3 py-1 text-xs' : 'px-4 py-2 text-sm'}
            rounded-full font-medium transition-colors border
            ${
              selected.includes(option.value)
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

ButtonFilter.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedValues: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  multiple: PropTypes.bool,
  variant: PropTypes.oneOf(['default', 'compact']),
};

// Main Component
export function DataFilter({
  searchPlaceholder = "Search...",
  filterConfig = [],
  sortOptions = [],
  onFilterChange,
  onReset
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange({ searchTerm, filters: newFilters, sort });
  };

  const handleSortChange = (values) => {
    setSort(values);
    onFilterChange({ searchTerm, filters, sort: values });
  };

  const handleReset = () => {
    setSearchTerm('');
    setFilters({});
    setSort([]);
    setShowFilters(false);
    onReset();
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              onFilterChange({ searchTerm: e.target.value, filters, sort });
            }}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </div>

        {/* Toggle Filters Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          <Filter className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>

        {/* Reset */}
        {(searchTerm || Object.values(filters).some(Boolean) || sort.length > 0) && (
          <button
            onClick={handleReset}
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
            title="Reset filters"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Advanced Filters + Sort */}
      {showFilters && (
        <div className="space-y-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
          {filterConfig.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filterConfig.map((filter) => (
                <div key={filter.field} className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {filter.label}
                  </label>
                  {filter.type === 'select' ? (
                    <select
                      value={filters[filter.field] || ''}
                      onChange={(e) => handleFilterChange(filter.field, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-600 dark:border-gray-500 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">All</option>
                      {filter.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={filter.type || 'text'}
                      placeholder={`Filter by ${filter.label}`}
                      value={filters[filter.field] || ''}
                      onChange={(e) => handleFilterChange(filter.field, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-600 dark:border-gray-500 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Filter & Sort Button */}
          {sortOptions.length > 0 && (
            <div className="flex items-center gap-4">
              <SlidersHorizontal className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              <ButtonFilter
                options={sortOptions}
                selectedValues={sort}
                onChange={handleSortChange}
                multiple={false}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

DataFilter.propTypes = {
  searchPlaceholder: PropTypes.string,
  filterConfig: PropTypes.array,
  sortOptions: PropTypes.array, // ADD THIS
  onFilterChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};
