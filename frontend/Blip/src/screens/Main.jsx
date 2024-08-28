import React, {useState, useEffect} from 'react';
import MapView, {Marker} from 'react-native-maps';
import {View, TextInput, StyleSheet, Button} from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Main = () => {
  const [isloading, setloading] = useState(true);
  const [search, setSearch] = useState('');
  const [json, setJson] = useState(null);
  const [lattitude, setLattitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    let locationSubscription;

    const fetchMongoPlaces = async () => {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(
        `https://blip.alanj.live/dest/nearby?lat=${lattitude}&long=${longitude}&boundary=5000`,
        {
          headers: {
            'x-auth-token': token,
          },
        },
      );
      const data = response.data;
      const extractedLocations = data.nearbyLocations.map(location => ({
        lat: location.lat,
        long: location.long,
        name: location.name,
      }));
      console.log(extractedLocations);
      setJson(extractedLocations);
    };

    const getLocationUpdates = async () => {
      let {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000,
          distanceInterval: 0,
        },
        location => {
          console.log('Location changed');
          console.log(location);
          setLattitude(location.coords.latitude);
          setLongitude(location.coords.longitude);
          setloading(false);
          fetchMongoPlaces();
        },
      );
    };
    getLocationUpdates();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  const pop = async () => {
    setloading(true);
    const response = await axios.post(
      'https://places.googleapis.com/v1/places:searchNearby',
      {
        includedTypes: ['restaurant'],
        maxResultCount: 10,
        locationRestriction: {
          circle: {
            center: {
              latitude: 31.254639,
              longitude: 75.705368,
            },
            radius: 500.0,
          },
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': 'AIzaSyDJ6IbtWODmqTHqBaIHPRJfAk6ihnQa-zs', // Replace with your actual API key
          'X-Goog-FieldMask': '*',
        },
      },
    );
    setJson(response.data);
    console.log(response.data);
    response.data.places.forEach((place, index) => {
      console.log(`Place ${index + 1}:`, place.displayName);
    });
  };

  return (
    <View style={styles.container}>
      {lattitude && longitude && json && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: lattitude,
            longitude: longitude,
            latitudeDelta: 0.922,
            longitudeDelta: 0.421,
          }}>
          {json &&
            json.map(
              (location, index) => (
                console.log(location),
                (
                  <Marker
                    key={index}
                    coordinate={{
                      latitude: location.lat,
                      longitude: location.long,
                    }}
                    title={location.name}
                  />
                )
              ),
            )}
        </MapView>
      )}

      {/* <TextInput
        style={styles.search}
        placeholder="Buscar..."
        onChangeText={e => setSearch(e)}
      />
      <Button title="Buscar" onPress={pop} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  search: {
    position: 'absolute',
    top: 10,
    width: '90%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 18,
  },
});

export default Main;
