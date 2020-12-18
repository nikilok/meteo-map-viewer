import axios from "axios";
import axiosRetry from "axios-retry";
import qs from "query-string";
import "./App.css";

import { useEffect, useState } from "react";

function App() {
  const { event, user } = qs.parse(window.location.search);
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
      `https://www.meteoblue.com/en/weather/webmap/beta/bad-kreuznach_germany_2953416#coords=13/${lat}/${long}&map=windAnimation~coldwarm~auto~${altForMeteo}~none`
    );
  };

  const getAltitudeInMeters = (altitude) => {
    const altMeters = altitude * 0.3048;

    switch (true) {
      case altMeters <= 10:
        return "10 m above gnd";
      case altMeters <= 128:
        return "128 m above gnd";
      case altMeters <= 210:
        return "210 m above gnd";
      case altMeters <= 250:
        return "250 mb";
      case altMeters <= 307:
        return "307 m above gnd";
      case altMeters <= 500:
        return "500 mb";
      case altMeters <= 700:
        return "700 mb";
      case altMeters <= 850:
        return "850 mb";
      default:
        return "";
    }
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
