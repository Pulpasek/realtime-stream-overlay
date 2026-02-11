# Realtime Stream Overlay

Realtime overlays for multiple streaming platforms with chat commands and persistent state storage.

## Commands

All commands are sent as query parameters to `/api/state`. Multiple commands can be chained in a single request.

| Command            | Usage Example                     | Description                            |
| ------------------ | --------------------------------- | -------------------------------------- |
| globalTimerStart   | `/api/state?globalTimerStart`     | Start the global timer                 |
| globalTimerRestart | `/api/state?globalTimerRestart`   | Restart the global timer from zero     |
| globalTimerStop    | `/api/state?globalTimerStop`      | Stop and clear the global timer        |
| setGlobalTimer     | `/api/state?setGlobalTimer=1234`  | Set timer to specific timestamp (ms)   |
| ------------------ | --------------------------------- | -------------------------------------- |
| addGlobalDeaths    | `/api/state?addGlobalDeaths`      | Add 1 death to global counter          |
| addGlobalDeaths    | `/api/state?addGlobalDeaths=5`    | Add specified deaths to global counter |
| removeGlobalDeaths | `/api/state?removeGlobalDeaths`   | Remove 1 death from global counter     |
| removeGlobalDeaths | `/api/state?removeGlobalDeaths=3` | Remove specified deaths from counter   |
| setGlobalDeaths    | `/api/state?setGlobalDeaths=10`   | Set global deaths to specific value    |
| resetGlobalDeaths  | `/api/state?resetGlobalDeaths`    | Reset global deaths to 0               |
| --------------     | -------------------------------   | -------------------------------------- |
| bossStart          | `/api/state?bossStart=Malenia`    | Start tracking a boss with given name  |
| bossRestart        | `/api/state?bossRestart`          | Restart boss timer (keeps name/deaths) |
| bossStop           | `/api/state?bossStop`             | Stop tracking current boss             |
| setBossName        | `/api/state?setBossName=Radahn`   | Update the current boss name           |
| setBossTimer       | `/api/state?setBossTimer=1234`    | Set boss timer to specific timestamp   |
| ----------------   | -------------------------------   | -------------------------------------- |
| addBossDeaths      | `/api/state?addBossDeaths`        | Add 1 death to boss and global counter |
| addBossDeaths      | `/api/state?addBossDeaths=3`      | Add specified deaths to both counters  |
| removeBossDeaths   | `/api/state?removeBossDeaths`     | Remove 1 death from boss and global    |
| removeBossDeaths   | `/api/state?removeBossDeaths=2`   | Remove specified deaths from both      |
| setBossDeaths      | `/api/state?setBossDeaths=5`      | Set boss deaths to specific value      |
| resetBossDeaths    | `/api/state?resetBossDeaths`      | Reset boss deaths to 0                 |
| ----------------   | -------------------------------   | -------------------------------------- |
| resetAll           | `/api/state?resetAll              | Reset all states to default            |