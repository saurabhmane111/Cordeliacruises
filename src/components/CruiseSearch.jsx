// src/components/CruiseSearch.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCruiseData,
  resetFilters,
  selectCruiseError,
  selectCruiseLoading,
  selectFilteredItineraries,
} from "../store/cruiseSlice";
import CruiseCard from "./CruiseCard";
import DateSelector from "./DateSelector";
import DestinationSelector from "./DestinationSelector";
import QuickFilters from "./QuickFilters";

export default function CruiseSearch() {
  const dispatch = useDispatch();
  const filteredItineraries = useSelector(selectFilteredItineraries);
  const loading = useSelector(selectCruiseLoading);
  const error = useSelector(selectCruiseError);

  useEffect(() => {
    dispatch(fetchCruiseData());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="text-4xl font-display text-center pt-12 pb-8">
        Explore Cruise Holidays
      </h1>

      <div className="max-w-3xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <DestinationSelector />
          </div>
          <div className="flex-1">
            <DateSelector />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium">
            Cruise Search Results ({filteredItineraries?.length || 0})
          </h2>
          <QuickFilters />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={`loading-skeleton-${idx}`}
                className="h-96 bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => dispatch(fetchCruiseData())}
              className="text-primary-600 hover:text-primary-700"
            >
              Try Again
            </button>
          </div>
        ) : filteredItineraries?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredItineraries.map((cruise) => (
              <CruiseCard key={cruise.itinerary_id} cruise={cruise} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500 mb-4">
              No cruises found matching your criteria
            </p>
            <button
              onClick={() => dispatch(resetFilters())}
              className="text-primary-600 hover:text-primary-700"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
