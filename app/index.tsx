import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
export default function HomeScreen() {
 

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Game Hub</Text>

      <View style={styles.cardContainer}>
        {/* Snake Game Card */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('Snake')}>
          <Image
            source={require('../assets/snakeposter.jpeg')} // Replace with your snake game image
            style={styles.cardImage}
          />
          <Text style={styles.cardTitle}>Snake Game</Text>
          <Text style={styles.cardDescription}>Classic Snake game. Eat and grow!</Text>
        </TouchableOpacity>

        {/* TicTacToe Game Card */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('TicTacToe')}>
          <Image
            source={require('../assets/tictactoe.jpeg')} // Replace with your TicTacToe game image
            style={styles.cardImage}
          />
          <Text style={styles.cardTitle}>Tic Tac Toe</Text>
          <Text style={styles.cardDescription}>Challenge your friends or play solo!</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('sudoku')}>
          <Image
            source={require('../assets/soduku.png')} // Replace with your TicTacToe game image
            style={styles.cardImage}
          />
          <Text style={styles.cardTitle}>Sudoku</Text>
          <Text style={styles.cardDescription}>Challenge your brain!</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('flopybird')}>
          <Image
            source={require('../assets/flopybird/bird.png')} // Replace with your TicTacToe game image
            style={styles.cardImage}
          />
          <Text style={styles.cardTitle}>Flopy Bird</Text>
          <Text style={styles.cardDescription}>Enjoy Flopy!</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('ludo')}>
          <Image
            source={require('../assets/flopybird/bird.png')} // Replace with your TicTacToe game image
            style={styles.cardImage}
          />
          <Text style={styles.cardTitle}>LUDO</Text>
          <Text style={styles.cardDescription}>Enjoy Flopy!</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 15,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#fff',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: 'white',
    width: '48%',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3, // For Android shadow
  },
  cardImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
});