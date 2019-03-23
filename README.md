# uz-booking-client

Unofficial uz booking API client for Node.js. https://booking.uz.gov.ua/en/

[![travis build status](https://travis-ci.com/DmytryS/uz-booking-client.svg?branch=master)](https://travis-ci.com/DmytryS/uz-booking-client.svg?branch=master)

## Usage

```javascript
/*
   Data can be retrieved from the API either using callbacks (as in versions < 1.0)
   or using a new promise-based API. The promise-based API returns the raw Axios
   request promise.
 */
import Client from 'uz-booking-client';

const ticketsDate = moment().add(10, 'days');
const uzClient = new Client('ru');

const departureStations = await uzClient.Station.find('Kyiv');
const departureStation = departureStations.data[0];

const targetStations = await uzClient.Station.find('Lviv');
const targetStation = targetStations.data[0];

const trains = await uzClient.Train.find(
  departureStation.value,
  targetStation.value,
  ticketsDate.format('YYYY-MM-DD'),
  '00:00'
);

const train = trains.data.data.list[3];

if (train.types.length === 0) {
  console.log('No free places left in this train.');
} else {
  const wagonTypes = train.types.map(type => type.letter);
  const wagons = await uzClient.Wagon.list(
    departureStation.value,
    targetStation.value,
    ticketsDate.format('YYYY-MM-DD'),
    train.num,
    wagonTypes[0]
  );
  const wagon = wagons.data.data.wagons[0];
  const coaches = await uzClient.Coach.list(
    departureStation.value,
    targetStation.value,
    ticketsDate.format('YYYY-MM-DD'),
    train.num,
    wagon.num,
    wagon.type,
    wagon.class
  );

  console.log(coaches.data.data);
  //   {
  //     "scheme_type": "К65",
  //     "model": {
  //         "floor": {
  //         "1": {
  //             "width": 17,
  //             "height": 5
  //         }
  //         }
  //     },
  //     "places": {
  //         "floor": {
  //             "1": [
  //                 {
  //                     "y": 1,
  //                     "x": 2,
  //                     "w": 1,
  //                     "h": 1,
  //                     "num": "4",
  //                     "type": "place",
  //                     "headrest": "left"
  //                 },
  //                 ...
  //             ]
  //             ...
  //         }
  //     }
  //   }
}
```
