import React, { useEffect, useState } from 'react';
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function Sudoku() {
  const [Board, setBoard] = useState(Array(81).fill(null));
  const [predefinedIndices, setPredefinedIndices] = useState([]);
  const [label, setLabel] = useState(1);
  const [hard, setHard] = useState(75);
  const [labelCompleted, setLabelCompleted] = useState(false);

  const isValidPlacement = (board, number, index) => {
    const row = Math.floor(index / 9);
    const col = index % 9;

    for (let i = 0; i < 9; i++) {
      // Check row and column
      if (
        board[row * 9 + i] === number ||
        board[col + i * 9] === number
      ) {
        return false;
      }
    }

    // Check subgrid
    const subgridRow = Math.floor(row / 3) * 3;
    const subgridCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const subgridIndex = (subgridRow + i) * 9 + (subgridCol + j);
        if (board[subgridIndex] === number) return false;
      }
    }

    return true;
  };

  const isBoardCompleted = (board) => {
    for (let i = 0; i < 81; i++) {
      const number = board[i];
      // Skip empty cells
      // console.log(isValidPlacement(board, number, i));
      if (number === null || number === 0) {
        console.log("nullcheck");
        return false;
      }
    }
    return true;
  };


  const generateFullSudoku = () => {
    const board = Array(81).fill(null);

    const fillBoard = (board, index = 0) => {
      if (index === 81) return true; // All cells are filled

      if (board[index] !== null) {
        return fillBoard(board, index + 1);
      }

      const numbers = Array.from({ length: 9 }, (_, i) => i + 1).sort(
        () => Math.random() - 0.5
      ); // Randomize numbers

      for (let number of numbers) {
        if (isValidPlacement(board, number, index)) {
          board[index] = number;

          if (fillBoard(board, index + 1)) return true;

          board[index] = null; // Backtrack
        }
      }

      return false;
    };

    fillBoard(board);
    return board;
  };

  const initializePredefinedBoard = () => {
    const fullBoard = generateFullSudoku();
    const board = Array(81).fill(null);
    const predefinedIndices = [];
    let attempts = 0;

    for (let i = 0; i <hard ;) { // Set 20 predefined numbers
      const randomIndex = Math.floor(Math.random() * 81);
      if (!predefinedIndices.includes(randomIndex)) {
        board[randomIndex] = fullBoard[randomIndex];
        predefinedIndices.push(randomIndex);
        i++;
      }

      if (attempts++ > 1000) break; // Safety to prevent infinite loop
    }

    return { board, predefinedIndices };
  };

  const handleCellPress = (index) => {
    if (!predefinedIndices.includes(index)) {
      const newBoard = [...Board];
      const currentNumber = newBoard[index] || 0;
      const nextNumber = (currentNumber % 9) + 1;

      if (isValidPlacement(newBoard, nextNumber, index)) {
        console.log(isValidPlacement(newBoard, nextNumber, index), "90");
        if (isBoardCompleted(newBoard)) {
          setLabelCompleted(true);
        
        }
      }
      newBoard[index] = nextNumber // Increment number cyclically
      setBoard(newBoard);

      // Check if the board is complete

    }
  };

  useEffect(() => {
    const { board, predefinedIndices } = initializePredefinedBoard();
    setBoard(board);
    setPredefinedIndices(predefinedIndices);
  }, [label]);
  const NextGame = () => {
    if(label>0 && label<75){
      setHard(hard-1)
      setLabel(label+1)
      setLabelCompleted(false)
    }
  }
  const prevGame = () => {
    if(label>0 && label<75){
      setHard(hard+1)
      setLabel(label-1)
      setLabelCompleted(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.controls}>
        <Text style={styles.turnText}>Level: {label}</Text>
        <View style={{flexDirection:'row',gap:2}}>
       
        <TouchableOpacity disabled={label<=1} onPress={prevGame} style={[styles.button,label<=1?{ backgroundColor: '#000',}:{ backgroundColor: '#ff5722',}]}>
          <Text style={styles.buttonText}>{"Prev Level"}</Text>
        </TouchableOpacity>
        <TouchableOpacity disabled={label==75} onPress={NextGame} style={[styles.button,label==75?{ backgroundColor: '#000',}:{ backgroundColor: '#ff5722',}]}>
          <Text style={styles.buttonText}>{"Next Level"}</Text>
        </TouchableOpacity>

        </View>
      </View>
      <View style={styles.GameArea}>
        <Animated.View>
          <View style={styles.board}>
            {Board.map((cell, index) => {
              const row = Math.floor(index / 9);
              const col = index % 9;

              // Determine styles for thick borders
              const borderTopWidth = row % 3 === 0 ? 3 : 1;
              const borderLeftWidth = col % 3 === 0 ? 3 : 1;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.cell,
                    {
                      borderTopWidth,
                      borderLeftWidth,
                      borderRightWidth: col === 8 ? 3 : 1,
                      borderBottomWidth: row === 8 ? 3 : 1,
                      backgroundColor: predefinedIndices.includes(index)
                        ? '#add8e6' // Light blue for predefined cells
                        : '#FFF', // White for others
                    },
                  ]}
                  onPress={() => handleCellPress(index)}
                >
                  <Text style={styles.cellText}>{cell}</Text>
                </TouchableOpacity>
              );
            })}
            {labelCompleted && (
              <View style={styles.gameOverOverlay}>
                <Text style={styles.gameOverText}>Level Completed!!</Text>
                {/* <TouchableOpacity onPress={restartGame} style={styles.restartButton}>
                                                <Text style={styles.restartButtonText}>Restart</Text>
                                            </TouchableOpacity> */}
              </View>
            )}
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  controls: {
    height: hp('10%'),
    backgroundColor: '#444',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: hp('3%'),
  },
  turnText: {
    color: 'white',
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#ff5722',
    paddingVertical: wp('1%'),
    paddingHorizontal: hp('1%'),
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  winnerText: {
    color: '#FFD700',
    fontSize: hp('3%'),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  GameArea: {
    flex: 1,
    alignItems: 'center',
  },
  board: {
    marginVertical: hp('5%'),
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: wp('100%'),
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cell: {
    width: wp('10%'),
    height: wp('10%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
  },
  cellText: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
  },
  gameOverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
},
gameOverText: {
    color: 'white',
    fontSize:  hp('5%'),
    marginBottom: hp('5%'),
},
});