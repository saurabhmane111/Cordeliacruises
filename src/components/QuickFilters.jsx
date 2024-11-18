// src/components/QuickFilters.jsx
import { Popover, Transition } from "@headlessui/react";
import { SlidersHorizontal } from "lucide-react";
import { Fragment, memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetFilters, updateFilters } from "../store/cruiseSlice";

const NIGHT_RANGES = [
  { id: "2-3", label: "2-3 Nights" },
  { id: "3-5", label: "3-5 Nights" },
  { id: "5-7", label: "5-7 Nights" },
  { id: "7+", label: "7+ Nights" },
];

const TRIP_TYPES = [
  { id: "all", label: "All Types" },
  { id: "one_way", label: "One Way" },
  { id: "round", label: "Round Trip" }, // Changed value to match API
];

const QuickFilters = memo(() => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.cruise.filters);
  const availablePorts = useSelector((state) => state.cruise.availablePorts);

  const handleNightRangeChange = useCallback(
    (rangeId) => {
      const currentNights = filters.nights || [];
      const updatedNights = currentNights.includes(rangeId)
        ? currentNights.filter((id) => id !== rangeId)
        : [...currentNights, rangeId];
      dispatch(updateFilters({ nights: updatedNights }));
    },
    [filters.nights, dispatch]
  );

  const handleTripTypeChange = useCallback(
    (type) => {
      dispatch(
        updateFilters({
          tripType: type === "all" ? "" : type,
        })
      );
    },
    [dispatch]
  );

  const handleDeparturePortChange = useCallback(
    (port) => {
      dispatch(
        updateFilters({
          departurePort: port === "All Ports" ? "" : port,
        })
      );
    },
    [dispatch]
  );

  const handleReset = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <Popover.Button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <span>Filter</span>
            <SlidersHorizontal className="h-5 w-5" />
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
          >
            <Popover.Panel className="absolute right-0 z-10 mt-2 w-80 bg-white rounded-lg shadow-lg p-4">
              {/* Number of Nights */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Number of Nights
                </h3>
                <div className="space-y-2">
                  {NIGHT_RANGES.map((range) => (
                    <label key={range.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.nights?.includes(range.id)}
                        onChange={() => handleNightRangeChange(range.id)}
                        className="rounded text-purple-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Trip Type */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Trip Type
                </h3>
                <select
                  value={filters.tripType || "all"}
                  onChange={(e) => handleTripTypeChange(e.target.value)}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                >
                  {TRIP_TYPES.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Departure Port */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Departure Port
                </h3>
                <select
                  value={filters.departurePort || "All Ports"}
                  onChange={(e) => handleDeparturePortChange(e.target.value)}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                >
                  <option value="All Ports">All Ports</option>
                  {availablePorts.map((port) => (
                    <option key={port.id} value={port.name}>
                      {port.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  handleReset();
                  close();
                }}
                className="w-full text-sm text-purple-600 hover:text-purple-700"
              >
                Reset All Filters
              </button>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
});

QuickFilters.displayName = "QuickFilters";
export default QuickFilters;
