import { Dimensions, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// Dynamic dimensions
const boardSize = Math.ceil(Dimensions.get('window').width * 0.9); // Board size based on screen width
const gridSize = Math.ceil(boardSize / 15); // Each cell size

export default function LudoBoard() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.board}>
        {Array.from({ length: 15 }).map((_, row) =>
          Array.from({ length: 15 }).map((_, col) => {
            let backgroundColor = 'white';
            let border = false;
            let symbol = null; // To add stars or arrows later
            // Quadrants
            if (row < 6 && col < 6) backgroundColor = 'green'; // Top Left (Green)
            else if (row < 6 && col >= 9) backgroundColor = 'yellow'; // Top Right (Yellow)
            else if (row >= 9 && col < 6) backgroundColor = 'red'; // Bottom Left (Red)
            else if (row >= 9 && col >= 9) backgroundColor = 'blue'; // Bottom Right (Blue)

            // Horizontal Path

            if (row === 7 && col > 0 && col < 6) {
              border = true
              backgroundColor = 'green';
            }
            if (row === 6 && col == 1) {

              border = true
              backgroundColor = 'green';
            }
            if (row === 13 && col == 6) {
              // console.log(true,"nn");
              border = true
              backgroundColor = 'red';
            }
            if (row >= 9 && row <= 13 && col == 7) {
              // console.log(true,"nn");
              border = true
              backgroundColor = 'red';
            }
            if (row === 1 && col == 8) {
              // console.log(true,"nn");
              border = true
              backgroundColor = 'yellow';
            }
            if (row >= 1 && row <= 5 && col == 7) {
              border = true
              backgroundColor = 'yellow';
            }
            if (row === 8 && col == 13) {
              // console.log(true,"nn");
              border = true
              backgroundColor = 'blue';
            }
            if (row == 7 && col <= 13 && col >= 9) {
              border = true
              backgroundColor = 'blue';
            }




            // Center Area (White Cross)
            if (row >= 6 && row <= 8 && col >= 6 && col <= 8) backgroundColor = 'pink';
            // Add stars
            if ((row === 1 && col === 6) || (row === 6 && col === 13)) symbol = '⭐';
            if ((row === 8 && col === 2) || (row === 13 && col === 8)) symbol = '⭐';


            // green goti
            if ((row == 1 && col == 1) || (row == 1 && col == 4) || (row == 4 && col == 1) || (row == 4 && col == 4)) {
              border = true
            }
            // yellow gotti
            if ((row == 1 && col == 10) || (row == 1 && col == 13) || (row == 4 && col == 10) || (row == 4 && col == 13)) {
              border = true
            }
            // red gotti
            if ((row == 10 && col == 1) || (row == 10 && col == 4) || (row == 13 && col == 1) || (row == 13 && col == 4)) {
              border = true
            }
            // blue
            if ((row == 10 && col == 10) || (row == 10 && col == 13) || (row == 13 && col == 10) || (row == 13 && col == 13)) {
              border = true
            }

            // Green Gotti
            if (row === 1 && col === 1) symbol = '🟢';
            if (row === 1 && col === 4) symbol = '🟢';
            if (row === 4 && col === 1) symbol = '🟢';
            if (row === 4 && col === 4) symbol = '🟢';

            // Yellow Gotti
            if (row === 1 && col === 10) symbol = '🟡';
            if (row === 1 && col === 13) symbol = '🟡';
            if (row === 4 && col === 10) symbol = '🟡';
            if (row === 4 && col === 13) symbol = '🟡';

            // Red Gotti
            if (row === 10 && col === 1) symbol = '🔴';
            if (row === 10 && col === 4) symbol = '🔴';
            if (row === 13 && col === 1) symbol = '🔴';
            if (row === 13 && col === 4) symbol = '🔴';

            // Blue Gotti
            if (row === 10 && col === 10) symbol = '🔵';
            if (row === 10 && col === 13) symbol = '🔵';
            if (row === 13 && col === 10) symbol = '🔵';
            if (row === 13 && col === 13) symbol = '🔵';

            return (
              <View
                key={`${row}-${col}`}
                style={[
                  styles.cell,
                  { backgroundColor },
                  border ? { borderWidth: 1, borderColor: 'black' } : null, // Proper conditional style for border
                  (backgroundColor === 'black' || backgroundColor === 'white') && styles.pathCell, // Pathway style
                ]}

              >
                <Text style={styles.symbol}>{symbol}</Text>
              </View>
            );
          })
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  board: {
    width: wp('100%'),
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 2,
    borderColor: 'black',
    backgroundColor: 'white',
  },
  cell: {
    width: wp('6.6%'),
    height: wp('6.6%'),
    borderColor: '#ccc',
  },
  pathCell: {
    borderWidth: 1,
    borderColor: 'black',
    // backgroundColor:'pink'
  },
  centerArea: {
    width: wp('6.6%') * 3,
    height: wp('6.6%') * 3,
    position: 'relative',
    backgroundColor: 'pink',
  },
  triangle: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderStyle: 'solid',
  },
  greenTriangle: {
    top: 0,
    left: 0,
    borderRightWidth: wp('6.6%') * 1.5,
    borderBottomWidth: wp('6.6%') * 1.5,
    borderRightColor: 'green',
    borderBottomColor: 'transparent',
  },
  yellowTriangle: {
    top: 0,
    right: 0,
    borderLeftWidth: wp('6.6%') * 1.5,
    borderBottomWidth: wp('6.6%') * 1.5,
    borderLeftColor: 'yellow',
    borderBottomColor: 'transparent',
  },
  redTriangle: {
    bottom: 0,
    left: 0,
    borderRightWidth: wp('6.6%') * 1.5,
    borderTopWidth: wp('6.6%') * 1.5,
    borderRightColor: 'red',
    borderTopColor: 'transparent',
  },
  blueTriangle: {
    bottom: 0,
    right: 0,
    borderLeftWidth: wp('6.6%') * 1.5,
    borderTopWidth: wp('6.6%') * 1.5,
    borderLeftColor: 'blue',
    borderTopColor: 'transparent',
  },
  symbol: {
    fontSize: gridSize / 2,
    textAlign: 'center',
  },
});
