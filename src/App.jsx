import { useEffect } from "react";
import { useDispatch } from "react-redux";
import CruiseSearch from "./components/CruiseSearch";
import { fetchCruiseData } from "./store/cruiseSlice";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCruiseData());
  }, [dispatch]);

  return <CruiseSearch />;
}
