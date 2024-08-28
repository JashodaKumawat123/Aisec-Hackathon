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
