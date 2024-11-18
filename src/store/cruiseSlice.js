// src/store/cruiseSlice.js
import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { fetchItineraries } from '../services/api';

export const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];


export const fetchCruiseData = createAsyncThunk(
    'cruise/fetchCruiseData',
    async (_, { rejectWithValue }) => {
        try {
            const data = await fetchItineraries();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    itineraries: [],
    availablePorts: [],
    filters: {
        selectedDestinations: [],
        dateRange: [],
        tripType: "",
        nights: [],
        departurePort: "",
    },
    loading: false,
    error: null
};

const cruiseSlice = createSlice({
    name: 'cruise',
    initialState,
    reducers: {
        updateFilters: (state, action) => {
            state.filters = {
                ...state.filters,
                ...action.payload
            };
        },
        resetFilters: (state) => {
            state.filters = initialState.filters;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCruiseData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCruiseData.fulfilled, (state, action) => {
                state.loading = false;
                state.itineraries = action.payload.itineraries || [];

                // Extract unique available ports
                const uniquePorts = new Set();
                action.payload.ports.forEach(cruise => {
                    if (cruise.destination === true) uniquePorts.add(cruise.name);
                });

                state.availablePorts = Array.from(uniquePorts).map(name => ({
                    name,
                    id: name
                }));
            })
            .addCase(fetchCruiseData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

// Selectors
const selectCruise = state => state.cruise;
const selectAllItineraries = state => state.cruise.itineraries;
const selectFilters = state => state.cruise.filters;

// Export all required selectors
export const selectCruiseLoading = createSelector(
    [selectCruise],
    (cruise) => cruise.loading
);

export const selectCruiseError = createSelector(
    [selectCruise],
    (cruise) => cruise.error
);

export const selectFilteredItineraries = createSelector(
    [selectAllItineraries, selectFilters],
    (itineraries, filters) => {
        return itineraries.filter((cruise) => {
            // Filter by destinations
            if (filters.selectedDestinations?.length > 0) {
                const cruisePorts = [
                    cruise.starting_port?.name,
                    cruise.destination_port?.name,
                    ...(cruise.ports || []).map(port => port.name)
                ].filter(Boolean);

                const hasSelectedDestination = filters.selectedDestinations.some(
                    selectedDest => cruisePorts.includes(selectedDest)
                );

                if (!hasSelectedDestination) return false;
            }
            // console.log('Cruise trip type:', cruise.trip_type, 'Filter trip type:', filters.tripType);

            // Filter by trip type
            if (filters.tripType && filters.tripType !== 'all') {
                if (cruise.trip_type?.toLowerCase() !== filters.tripType.toLowerCase()) {
                    return false;
                }
            }

            // Filter by date range
            if (filters.dateRange?.length > 0) {
                const [cruiseDay, cruiseMonth, cruiseYear] = cruise.start_date.split("/").map(Number);
                const cruiseDate = new Date(cruiseYear, cruiseMonth - 1, cruiseDay);

                if (filters.dateRange.length === 1) {
                    const [day, month, year] = filters.dateRange[0].split(" ");
                    const selectedDate = new Date(year, MONTHS.indexOf(month), parseInt(day));
                    if (cruiseDate.getTime() !== selectedDate.getTime()) {
                        return false;
                    }
                }

                if (filters.dateRange.length === 2) {
                    const [startDay, startMonth, startYear] = filters.dateRange[0].split(" ");
                    const [endDay, endMonth, endYear] = filters.dateRange[1].split(" ");

                    const startDate = new Date(startYear, MONTHS.indexOf(startMonth), parseInt(startDay));
                    const endDate = new Date(endYear, MONTHS.indexOf(endMonth), parseInt(endDay));

                    if (cruiseDate < startDate || cruiseDate > endDate) {
                        return false;
                    }
                }
            }

            // Filter by nights
            if (filters.nights?.length > 0) {
                const nightsMatch = filters.nights.some(range => {
                    if (range === '7+') {
                        return cruise.nights >= 7;
                    }
                    const [min, max] = range.split('-').map(Number);
                    return cruise.nights >= min && cruise.nights <= max;
                });

                if (!nightsMatch) return false;
            }

            // Filter by departure port
            if (filters.departurePort) {
                if (cruise.starting_port?.name !== filters.departurePort) {
                    return false;
                }
            }

            // Filter by selected destinations
            if (filters.selectedDestinations?.length > 0) {
                const cruisePorts = [
                    cruise.starting_port?.name,
                    cruise.destination_port?.name,
                    ...(cruise.ports || []).map(port => port.name)
                ].filter(Boolean);

                const hasSelectedDestination = filters.selectedDestinations.some(
                    selectedDest => cruisePorts.includes(selectedDest)
                );

                if (!hasSelectedDestination) return false;
            }
            return true;
        });
    }
);

// Selector for available ports with counts
export const selectAvailablePortsWithCounts = createSelector(
    [selectAllItineraries, selectCruise],
    (itineraries, cruiseState) => {
        const portCounts = {};

        // Count cruises for each port
        itineraries.forEach(cruise => {
            const ports = new Set([
                cruise.starting_port?.name,
                cruise.destination_port?.name,
                ...(cruise.ports || []).map(port => port.name)
            ].filter(Boolean));

            ports.forEach(portName => {
                portCounts[portName] = (portCounts[portName] || 0) + 1;
            });
        });

        return cruiseState.availablePorts.map(port => ({
            ...port,
            count: portCounts[port.name] || 0
        }));
    }
);

export const { updateFilters, resetFilters } = cruiseSlice.actions;
export default cruiseSlice.reducer;