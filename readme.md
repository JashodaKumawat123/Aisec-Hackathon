# Blip : explore the unexplored

Blip is a simeple application that helps the user to explore the unexplored places. Users can tag a less explored place and share it with the community. The application also provides a platform for the users to share their experiences and photos of the place.

## Features

- Users can tag a place and share it with the community
- Tags are based on the type of place like historical, natural, etc.
- Users can share their experiences and photos of the place in the community feed
- Users can like and comment on the posts
- Users can get reward points for tagging a places
- Users can get reward points for visiting a place
- Users can get reward points when other users visit the place tagged by them

## Accessiblity Features

The application is designed with an "accessibility first" approach, ensuring that disabilities don't interfere with wanderlust.

- Visual Impairment Support
- SOS feature for handlers using gesture control
- Proximity alerts based on:
  - Distance from handler
  - Danger levels of the location
- Highlighted sensory places for visually impaired quests
- Sensory Locations Examples
  - Sunder Nursery, Delhi: Heritage park with sensory gardens and well-maintained pathways
- Tactile Gallery at the National Museum, New Delhi: Features touchable replicas of famous sculptures
- Additional Accessibility Features
- Text-to-speech and speech-to-text functionality
- Location description feature for visited places

## Tech Stack

Frontend: ReactNative
Backend: Node.js, Express.js, MongoDB, firebase

## API Docs

### Signup

- URL: `https://blip.alanj.live/auth/signup`
- Method: `POST`
- Request body:

```json
{
  "name": "alan",
  "email": "alanjames@gmail.com",
  "password": "pass",
  "userType": "casual" // allowed values: "casual", "handler", "visuallyImpaired"
}
```

- Success Response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmNmNzM0MWI4NmY4NGFjZWI2Y2FmMmUiLCJ1c2VyVHlwZSI6ImNhc3VhbCIsImlhdCI6MTcyNDg3Mzk5M30.liK_sxZ-eb0KWVE23Fb60YAoMUDU17L52GF-ipdyZTA"
}
```

### Login

- URL: `https://blip.alanj.live/auth/login`
- Method: `POST`
- Request body:

```json
{
  "email": "alan",
  "password": "pass"
}
```

- Success Response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmNmNzM0MWI4NmY4NGFjZWI2Y2FmMmUiLCJ1c2VyVHlwZSI6ImNhc3VhbCIsImlhdCI6MTcyNDg3Mzk5M30.liK_sxZ-eb0KWVE23Fb60YAoMUDU17L52GF-ipdyZTA"
}
```

### Pin A location

- URL: `https://blip.alanj.liv:we/dest/pin`
- Method: `POST`
- Request body:

```json
{
  "lat": 27.175015,
  "long": 78.042155,
  "name": "Taj Mahal",
  "description": "Iconic white marble mausoleum located in Agra, India, built by Mughal emperor Shah Jahan.",
  "keywords": ["landmark", "historic", "monument"]
}
```

- Success Response:

```json
{
  "message": "Location pinned successfully"
}
```

### Get nearby pinned location

- URL: `https://blip.alanj.live/dest/nearby?lat=27.175015&long=78.042155&boundary=10000`
- Method: `GET`
- Success Response:

```json
{
  "locations": [
    {
      "name": "Taj Mahal",
      "description": "Iconic white marble mausoleum located in Agra, India, built by Mughal emperor Shah Jahan.",
      "keywords": ["landmark", "historic", "monument"]
    }
  ]
}
```

### User visited a pinned location

- URL: `/dest/visited?lat=31.0988956&long=75.9779626`
- Method: `GET`
- Success Response:

```json
{
  "updateCnt": {
    "_id": "66cf9890bdcd04434b18646e",
    "name": "Gurudwara Panj Tirath Sahib",
    "lat": 31.0988956,
    "long": 75.9779626,
    "description": "",
    "keywords": [
      "historical_landmark",
      "place_of_worship",
      "point_of_interest",
      "establishment"
    ],
    "pinnedByUser": "public",
    "visitCount": 16,
    "__v": 0
  },
  "visited": true
}
```

### View User Profile

- URL: `/auth/profile`
- Method: `GET`
- Success Response:

```json
{
  "_id": "66cf7341b86f84aceb6caf2e",
  "name": "alan",
  "email": "alanjames@gmail.com",
  "passwordHash": "$2b$10$sAbvzK2Tnw1JI.B6TKqsO.dPsb.S2i1ghgF71y9oIBvijfh22ZFM2",
  "userType": "casual",
  "createdAt": "2024-08-28T18:58:09.925Z",
  "__v": 1,
  "visitedLocations": [
    {
      "lat": 31.0988956,
      "long": 75.9779626,
      "name": "Gurudwara Panj Tirath Sahib",
      "locationId": "66cf9890bdcd04434b18646e",
      "_id": "66cf9e574b950d4bbb012577"
    }
  ]
}
```
