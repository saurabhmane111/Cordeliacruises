const API_BASE_URL = 'https://staging.cordeliacruises.com/api/v2';
const API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiMzlkYzczZTYtNDQ2OC00YjM3LWI2YTItNzQ2YWFjYWYyYzExIiwiZXhwIjoxNzMxODMxNjgxfQ.7X6w0dOMGtrM1Ta47e-YEEhPFbMt2kwz2RshfMyNChw';

const headers = {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
    'Accept': '*/*'
};

export const fetchItineraries = async () => {
    try {
        console.log('Fetching itineraries...');
        const response = await fetch(
            `${API_BASE_URL}/itineraries?pagination=false`,
            { headers }
        );

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched data:', data);
        return data;
    } catch (error) {
        console.error('Error fetching itineraries:', error);
        throw error;
    }
};