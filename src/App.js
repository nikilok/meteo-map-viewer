import axios from "axios";
import axiosRetry from "axios-retry";
import qs from "query-string";

import { useEffect, useState, useRef } from "react";

function App() {
  const { event } = qs.parse(window.location.search);
  const iFrameRef = useRef(null);
  const pollingRate = 30000;
  const [lastEventId, setLastEventId] = useState(0);
  const [url, setUrl] = useState("");
  axiosRetry(axios, { retries: 3 });

  const getSimAirEvent = (eventId, id) => {
    return axios.get(
      `https://api.simair.io/v1/flights/${eventId}/events?lastEventId=${id}`
    );
  };

  const setFlightData = (data) => {
    const {
      location: { coordinates },
      altitude,
      id,
    } = data;
    const altForMeteo = getAltitudeInMeters(altitude);

    const [long, lat] = coordinates;
    setLastEventId(id);
    setUrl(
      `https://www.meteoblue.com/en/weather/webmap/beta/bad-kreuznach_germany_2953416#coords=10/${lat}/${long}&map=windAnimation~coldwarm~auto~${altForMeteo}~none`
    );
  };

  const getAltitudeInMeters = (altitude) => {
    const altMeters = altitude * 0.3048;

    switch (true) {
      case altMeters <= 10:
        return escape("10 m above gnd");
      case altMeters <= 128:
        return escape("128 m above gnd");
      case altMeters <= 210:
        return escape("210 m above gnd");
      case altMeters <= 250:
        return escape("250 mb");
      case altMeters <= 307:
        return escape("307 m above gnd");
      case altMeters <= 500:
        return escape("500 mb");
      case altMeters <= 700:
        return escape("700 mb");
      case altMeters <= 850:
        return escape("850 mb");
      default:
        return "";
    }
  };

  const triggerDataFetch = async (event, lastEventId) => {
    if (event) {
      const { data } = await getSimAirEvent(event, lastEventId);
      const lastEvent = data.length - 1;
      setFlightData(data[lastEvent]);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      triggerDataFetch(event, lastEventId);
    }, pollingRate);
    return () => clearInterval(interval);
  }, [lastEventId]);

  return (
    <div className="App">
      <iframe
        ref={iFrameRef}
        src={url}
        frameBorder="0"
        style={{ overflow: "hidden", height: "100vh", width: "100%" }}
        height="100vh"
        width="100%"
      ></iframe>
    </div>
  );
}

export default App;
