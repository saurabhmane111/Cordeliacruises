// src/components/DateSelector.jsx
import { Popover, Transition } from "@headlessui/react";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Fragment, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateFilters } from "../store/cruiseSlice";

const WEEKDAYS = [
  { key: "sunday", label: "S" },
  { key: "monday", label: "M" },
  { key: "tuesday", label: "T" },
  { key: "wednesday", label: "W" },
  { key: "thursday", label: "T" },
  { key: "friday", label: "F" },
  { key: "saturday", label: "S" },
];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function DateSelector() {
  const dispatch = useDispatch();
  const { itineraries, filters } = useSelector((state) => state.cruise);

  const today = new Date();
  // Initialize with current month
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDates, setSelectedDates] = useState(filters.dateRange || []);

  // Get available sailing dates from API data
  const sailingDates = useMemo(() => {
    const dates = new Set();
    itineraries.forEach((cruise) => {
      if (cruise.start_date) {
        const [day, month, year] = cruise.start_date.split("/").map(Number);
        dates.add(
          `${year}-${month.toString().padStart(2, "0")}-${day
            .toString()
            .padStart(2, "0")}`
        );
      }
    });
    return dates;
  }, [itineraries]);

  // Get the earliest and latest sailing dates
  const dateRange = useMemo(() => {
    if (itineraries.length === 0) return { min: today, max: today };

    let minDate = new Date();
    let maxDate = new Date();
    let hasSetInitialDates = false;

    itineraries.forEach((cruise) => {
      if (cruise.start_date) {
        const [day, month, year] = cruise.start_date.split("/").map(Number);
        const date = new Date(year, month - 1, day);

        if (!hasSetInitialDates) {
          minDate = date;
          maxDate = date;
          hasSetInitialDates = true;
        } else {
          if (date < minDate) minDate = date;
          if (date > maxDate) maxDate = date;
        }
      }
    });

    return { min: minDate, max: maxDate };
  }, [itineraries]);

  const handleMonthChange = (increment) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + increment);

      // Don't allow going before current month
      if (newDate < new Date(today.getFullYear(), today.getMonth())) {
        return prevDate;
      }

      // Don't allow going beyond max available date
      if (newDate > dateRange.max) {
        return prevDate;
      }

      return newDate;
    });
  };

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );
  const startingDayIndex = firstDayOfMonth.getDay();
  const totalDays = lastDayOfMonth.getDate();

  const formatDate = (day) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    return `${day} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  };

  const isSailingDate = (day) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    return sailingDates.has(formattedDate);
  };

  const isPastDate = (day) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    return date < today;
  };

  const handleDateSelect = (day) => {
    const dateStr = formatDate(day);
    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );

    if (isPastDate(day)) return;

    if (selectedDates.length === 0) {
      setSelectedDates([dateStr]);
      dispatch(updateFilters({ dateRange: [dateStr] }));
    } else if (selectedDates.length === 1) {
      const firstDate = new Date(selectedDates[0]);
      if (selectedDate < firstDate) {
        setSelectedDates([dateStr, selectedDates[0]]);
        dispatch(updateFilters({ dateRange: [dateStr, selectedDates[0]] }));
      } else {
        setSelectedDates([selectedDates[0], dateStr]);
        dispatch(updateFilters({ dateRange: [selectedDates[0], dateStr] }));
      }
    } else {
      setSelectedDates([dateStr]);
      dispatch(updateFilters({ dateRange: [dateStr] }));
    }
  };

  const isSelected = (day) => {
    const dateStr = formatDate(day);
    return selectedDates.includes(dateStr);
  };

  const isInRange = (day) => {
    if (selectedDates.length !== 2) return false;
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    const [start, end] = selectedDates.map((d) => new Date(d));
    return date > start && date < end;
  };

  const canNavigateBack = () => {
    const firstOfCurrentMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    return (
      firstOfCurrentMonth > new Date(today.getFullYear(), today.getMonth(), 1)
    );
  };

  const canNavigateForward = () => {
    const firstOfNextMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );
    return firstOfNextMonth <= dateRange.max;
  };

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
              <Calendar className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600">
                {selectedDates.length > 0
                  ? selectedDates.join(" - ")
                  : "Select Dates"}
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
            <Popover.Panel className="absolute z-10 right-0 mt-2 w-80 bg-white rounded-lg shadow-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() => handleMonthChange(-1)}
                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                  disabled={!canNavigateBack()}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="font-medium">
                  {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                </span>
                <button
                  onClick={() => handleMonthChange(1)}
                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                  disabled={!canNavigateForward()}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center">
                {WEEKDAYS.map(({ key, label }) => (
                  <div key={key} className="text-sm text-gray-500 py-1">
                    {label}
                  </div>
                ))}

                {Array(startingDayIndex)
                  .fill(null)
                  .map((_, i) => (
                    <div key={`empty-start-${i}`} className="py-1" />
                  ))}

                {Array.from({ length: totalDays }, (_, i) => i + 1).map(
                  (day) => {
                    const isAvailable = isSailingDate(day) && !isPastDate(day);
                    return (
                      <button
                        key={`day-${day}`}
                        onClick={() => isAvailable && handleDateSelect(day)}
                        disabled={!isAvailable}
                        className={`
                          py-1 rounded-full text-sm transition-colors relative
                          ${isSelected(day) ? "bg-purple-600 text-white" : ""}
                          ${
                            isInRange(day)
                              ? "bg-purple-100 text-purple-700"
                              : ""
                          }
                          ${
                            !isAvailable
                              ? "text-gray-400 cursor-not-allowed"
                              : "hover:bg-purple-50"
                          }
                          ${
                            isAvailable && !isSelected(day) && !isInRange(day)
                              ? "ring-2 ring-purple-200"
                              : ""
                          }
                          ${isPastDate(day) ? "opacity-50" : ""}
                        `}
                      >
                        {day}
                        {isAvailable && !isSelected(day) && (
                          <span className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2">
                            <span className="block h-1 w-1 bg-purple-500 rounded-full"></span>
                          </span>
                        )}
                      </button>
                    );
                  }
                )}
              </div>

              <div className="mt-4 pt-4 border-t space-y-2">
                <div className="flex items-center justify-end gap-2 text-xs text-gray-500">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  <span>Sailing dates available</span>
                </div>
                {selectedDates.length > 0 && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        setSelectedDates([]);
                        dispatch(updateFilters({ dateRange: [] }));
                      }}
                      className="text-sm text-purple-600 hover:text-purple-700"
                    >
                      Clear Dates
                    </button>
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
