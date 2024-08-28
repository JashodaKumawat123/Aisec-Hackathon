## Firebase database schema

### Places

```json
{
  "places": {
    "placeId": {
      "name": "string",
      "description": "string",
      "imageUrl": "string",
      "location": {
        "lat": "number",
        "lng": "number"
      }
    }
  }
}
```

### Users

```json
{
  "users": {
    "userId": {
      "email": "string",
      "password": "string",
      "places": {
        "placeId": true
      }
    }
  }
}
```

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
