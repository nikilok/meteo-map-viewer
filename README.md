# meteo-map-viewer

An app that indicates your aircraft location on meteo maps, using SimAir.io events.

## Available Scripts

In the project directory, you can run:

### Requirements

You will need to install [yarn](https://classic.yarnpkg.com/en/docs/install/#windows-stable).

You will need to install this chrome extension that helps with allows CORS(Cross Origin Requests) for now to access event data from SimAir.
https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf?hl=en

After you restart Chrome, you will need to click the extension and Toggle it on.

Open the command line and run

### Clone this repo locally

- Open your command line
- git clone https://github.com/nikilok/meteo-map-viewer.git
- navigate to the folder and install packages using `yarn`

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000?user=useraccount](http://localhost:3000?useraccount=user) to view it in the browser.

You will need to get your pass your SimAir user account name in the url's user parameter.

The app will automatically fetch your latest flight and display it.

This should enable automatic flight tracking with weather at the altitude your flying at.

### More Info

https://forums.flightsimulator.com/t/msfs-cannonball-run-challenge-kjfk-to-klax-in-a-ga-plane-for-charity-prize-from-microsoft/325268/732?u=noksx
