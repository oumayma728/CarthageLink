# Carthage Link

Industrial IoT platform for real-time monitoring, instant alerts and remote management of connected devices.
Built as my final-year project at Lab619 (Feb – May 2025).

<!-- TODO: add a dashboard screenshot -->

## Features
- Real-time sensor data over MQTT, shown on an interactive Chart.js dashboard (4 main sensors per device card)
- Instant alerts pushed to the UI with SignalR
- User, device and access-control management

## Stack
React (carthagelink.client) · ASP.NET Core + Entity Framework (CarthageLink.Server) · MQTT · SignalR · Chart.js

## Run locally
Open `CarthageLink.sln` in Visual Studio and start the server project; then run the client:
    cd carthagelink.client && npm install && npm run dev
<!-- TODO: database / MQTT broker setup -->
