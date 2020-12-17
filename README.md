# meteo-map-viewer

An app that indicates your aircraft location on meteo maps, using SimAir.io events.

## Available Scripts

In the project directory, you can run:

### Requirements

You will need to install [yarn](https://classic.yarnpkg.com/en/docs/install/#windows-stable).

Open the command line and run

### Clone this repo locally

- Open your command line
- git clone https://github.com/nikilok/meteo-map-viewer.git
- navigate to the folder and install packages using `yarn`

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000?event=eventId](http://localhost:3000?event=1) to view it in the browser.

You will need to get your current flights event id from SimAir and substitude eventId with a valid id.

This should enable automatic flight tracking with weather at the altitude your flying at.

### How to get event Id for the flight from SimAir

- Login to your simAir dashboard.
- Go to My Log book
- Select the flight from the logbook that you like to monitor.
- Right click the browser and select Inspect.
- Go to the network tab in the inspect view.
- Filter to only see XHR events.
- You will notice a lot of events, click on one that says events?lastEventId=<...>
- In the new pane that opens you will notice a request url that looks like this.
  https://api.simair.io/v1/flights/3335/events?lastEventId=445908
- The number right after the flights/ is the event id.
- In this case 3335, copy this event and use it to start this application when running it locally as http://localhost:3000/?event=3335
