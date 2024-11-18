// src/components/DestinationSelector.jsx
import { Popover, Transition } from "@headlessui/react";
import { ChevronDown, MapPin } from "lucide-react";
import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAvailablePortsWithCounts,
  updateFilters,
} from "../store/cruiseSlice";

export default function DestinationSelector() {
  const dispatch = useDispatch();
  const availablePortsWithCounts = useSelector(selectAvailablePortsWithCounts);
  const loading = useSelector((state) => state.cruise.loading);
  const filters = useSelector((state) => state.cruise.filters);

  const handleDestinationSelect = (portName) => {
    const currentSelected = filters.selectedDestinations || [];
    const newSelected = currentSelected.includes(portName)
      ? currentSelected.filter((d) => d !== portName)
      : [...currentSelected, portName];

    dispatch(updateFilters({ selectedDestinations: newSelected }));
  };

  // Sort ports by count in descending order
  const sortedPorts = [...(availablePortsWithCounts || [])].sort(
    (a, b) => b.count - a.count
  );

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={`
              w-full bg-white rounded-lg shadow-sm px-4 py-2.5
              flex items-center justify-between
              ${
                open
                  ? "ring-2 ring-purple-500"
                  : "hover:ring-2 hover:ring-gray-200"
              }
            `}
          >
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600">
                {filters.selectedDestinations?.length > 0
                  ? filters.selectedDestinations.join(", ")
                  : "Select Destinations"}
              </span>
            </div>
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
          >
            <Popover.Panel className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg p-4">
              <div className="space-y-2">
                {loading ? (
                  <div className="text-gray-500 text-center py-2">
                    Loading destinations...
                  </div>
                ) : sortedPorts?.length > 0 ? (
                  <>
                    {filters.selectedDestinations?.length > 0 && (
                      <button
                        onClick={() =>
                          dispatch(updateFilters({ selectedDestinations: [] }))
                        }
                        className="text-sm text-purple-600 hover:text-purple-700 mb-2"
                      >
                        Clear All
                      </button>
                    )}
                    {sortedPorts.map(
                      (port) =>
                        port.count > 0 && (
                          <div
                            key={port.id}
                            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                            onClick={() => handleDestinationSelect(port.name)}
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={filters.selectedDestinations?.includes(
                                  port.name
                                )}
                                onChange={() => {}}
                                className="rounded text-purple-600"
                              />
                              <span>{port.name}</span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {port.count}{" "}
                              {port.count === 1 ? "cruise" : "cruises"}
                            </span>
                          </div>
                        )
                    )}
                  </>
                ) : (
                  <div className="text-gray-500 text-center py-2">
                    No destinations available
                  </div>
                )}
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
