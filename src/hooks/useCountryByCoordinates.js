import { useState, useEffect } from "react";
import axios from "axios";

const useCountryByCoordinates = (latitude, longitude) => {
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountry = async () => {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`;
      try {
        const response = await axios.get(url);
        setCountry(response.data.address.country);
      } catch (error) {
        setError("Error fetching country");
        console.error("Error fetching data from Nominatim:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountry();
  }, [latitude, longitude]);

  return { country, loading, error };
};

export default useCountryByCoordinates;
