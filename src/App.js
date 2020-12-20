import axios from "axios";
import axiosRetry from "axios-retry";
import qs from "query-string";
import altMeteo from "./data/altMeteo.json";
import "./App.css";

import { useEffect, useState } from "react";

function App() {
  const { event, user, map = "windAnimation~coldwarm" } = qs.parse(
    window.location.search
  );
  const pollingRate = 10000;
  const [flightEvent, setFlightEvent] = useState(0);
  const [lastEventId, setLastEventId] = useState(0);
  const [heading, setHeading] = useState(0);
  const [url, setUrl] = useState("");
  axiosRetry(axios, { retries: 3 });

  const getSimAirEvent = (eventId, id) => {
    return axios.get(
      `https://api.simair.io/v1/flights/${eventId}/events?lastEventId=${id}`
    );
  };

  const getSimAirFlights = (userAccount) => {
    return axios.get(
      `https://api.simair.io/v1/user/${userAccount}/flights?order=descending&count=1&lastFlightId=0`
    );
  };

  const setFlightData = (data) => {
    const {
      location: { coordinates },
      altitude,
      id,
      heading,
    } = data;
    const altForMeteo = escape(getAltitudeInMeters(altitude));

    const [long, lat] = coordinates;
    setLastEventId(id);
    setHeading(heading);
    setUrl(
      `https://www.meteoblue.com/en/weather/webmap/beta/bad-kreuznach_germany_2953416#coords=13/${lat}/${long}&map=${map}~auto~${altForMeteo}~none`
    );
  };

  const getAltitudeInMeters = (altitude) => {
    const altMeters = altitude * 0.3048;
    const meteoAltStr = altMeteo
      .filter(({ mapType }) => mapType.includes(map))
      .find(({ alt }) => alt >= altMeters);

    return meteoAltStr ? meteoAltStr.str : "";
  };

  const triggerDataFetch = async (event, lastEventId) => {
    if (event) {
      const { data } = await getSimAirEvent(event, lastEventId);
      const lastEvent = data.length - 1;
      if (data.length) {
        setFlightData(data[lastEvent]);
      }
    }
  };

  const getEventByUser = async (user) => {
    const { data } = await getSimAirFlights(user);
    if (data.length) {
      const { flightId } = data[0];
      setFlightEvent(flightId);
      triggerDataFetch(flightId, lastEventId);
    }
  };

  useEffect(() => {
    if (user) {
      getEventByUser(user);
    }

    if (event) {
      triggerDataFetch(event, lastEventId);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      triggerDataFetch(flightEvent, lastEventId);
    }, pollingRate);
    return () => clearInterval(interval);
  }, [lastEventId, flightEvent]);

  return (
    <div>
      <div
        className="aircraft"
        style={{ transform: `rotate(${heading}deg)` }}
      ></div>
      <iframe
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
