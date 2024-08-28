import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  ScrollView,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({navigation, setToken}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [userType, setUserType] = useState('');
  const [iserror, setError] = useState(false);

  const handleAuth = async () => {
    setIsLoading(true);
    try {
      const endpoint = isLogin ? 'login' : 'signup';
      const payload = isLogin
        ? {email, password}
        : {name, email, password, userType};
      const response = await axios.post(
        `https://blip.alanj.live/auth/${endpoint}`,
        payload,
        {headers: {'Content-Type': 'application/json'}},
      );
      console.log(response.data);
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('userType', response.data.userType);
      await AsyncStorage.setItem('name', response.data.name);
      navigation.navigate('Home');
      setToken(response.data.token);
    } catch (error) {
      console.error(`${isLogin ? 'Login' : 'Signup'} failed:`, error);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setName('');
    setUserType('');
  };

  const UserTypeButton = ({type, label}) => (
    <TouchableOpacity
      style={[
        styles.userTypeButton,
        userType === type && styles.selectedUserType,
      ]}
      onPress={() => setUserType(type)}>
      <Text
        style={[
          styles.userTypeText,
          userType === type && styles.selectedUserTypeText,
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={{uri: 'https://source.unsplash.com/random/?abstract,colorful'}}
      style={styles.backgroundImage}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.3)']}
          style={styles.overlay}
        />
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>
              {isLogin ? 'Welcome Back' : 'Join Us'}
            </Text>
            <Text style={styles.subtitle}>
              {isLogin ? 'Sign in to continue' : 'Create an account'}
            </Text>

            {!isLogin && (
              <>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#FFFFFF80"
                    onChangeText={setName}
                    value={name}
                  />
                </View>
              </>
            )}

            {iserror && (
              <View>
                <Text style={{color: 'red'}}>
                  {isLogin
                    ? 'Invalid Email or Password'
                    : 'Invalid Email or Password or User Type'}
                </Text>
              </View>
            )}

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#FFFFFF80"
                onChangeText={setEmail}
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#FFFFFF80"
                onChangeText={setPassword}
                value={password}
                secureTextEntry
              />
            </View>
            {!isLogin && (
              <View style={styles.userTypeContainer}>
                <View style={styles.userTypeButtonContainer}>
                  <UserTypeButton type="casual" label="Casual User" />
                  <UserTypeButton type="handler" label="Handler" />
                  <UserTypeButton
                    type="visuallyImpaired"
                    label="Visually Impaired"
                  />
                </View>
              </View>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={handleAuth}
              disabled={isLoading || (!isLogin && !userType)}>
              <LinearGradient
                colors={['#FF6B6B', '#FF8E53']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.buttonGradient}>
                <Text style={styles.buttonText}>
                  {isLoading
                    ? 'Processing...'
                    : isLogin
                    ? 'Sign In'
                    : 'Sign Up'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {isLogin && (
              <TouchableOpacity>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={toggleAuthMode}
              style={styles.toggleContainer}>
              <Text style={styles.toggleText}>
                {isLogin
                  ? "Don't have an account? Sign Up"
                  : 'Already have an account? Sign In'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 50,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  input: {
    width: '100%',
    height: 50,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#FFFFFF',
  },
  userTypeContainer: {
    width: '100%',
    marginBottom: 20,
  },
  userTypeLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 10,
  },
  userTypeButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userTypeButton: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedUserType: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  userTypeText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  selectedUserTypeText: {
    fontWeight: 'bold',
  },
  button: {
    width: '100%',
    marginTop: 20,
    overflow: 'hidden',
    borderRadius: 25,
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  forgotPassword: {
    marginTop: 20,
    color: '#FFFFFF',
    fontSize: 14,
  },
  toggleContainer: {
    marginTop: 30,
  },
  toggleText: {
    color: '#FFFFFF',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default Login;
