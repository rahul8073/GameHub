import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Audio } from 'expo-av';

export default function TicTakToe() {
    const [board, setBoard] = useState(Array(16).fill(null))
    const [Turn, setTurn] = useState('O')
    const [winner, setWinner] = useState(null)

    const soundRef = useRef({winsound:null,drawsound:null,movesound:null});

    useEffect(() => {
        const loadSound = async () => {
            const winSound = await Audio.Sound.createAsync(require('../assets/TicTacAudio/winnerTic.mp3'));
            const moveSound = await Audio.Sound.createAsync(require('../assets/TicTacAudio/move.mp3'));
            const drawSound = await Audio.Sound.createAsync(require('../assets/TicTacAudio/draw.mp3'));
            soundRef.current={
                winsound:winSound.sound,
                movesound:moveSound.sound,
                drawsound:drawSound.sound,
            };
        };

        loadSound();

        return () => {
            const { movesound, drawsound,winsound } = soundRef.current;

            if (winsound) winsound.unloadAsync();
            if (movesound) movesound.unloadAsync();
            if (drawsound) drawsound.unloadAsync();
        };
    }, []);
    const { movesound, drawsound,winsound } = soundRef.current;
    const handlePress = (index) => {
        if (board[index] || winner) return
        const newBoard = [...board];
        newBoard[index] = Turn === 'O' ? 'O' : 'X'
        setBoard(newBoard)
        checkWinner(newBoard);
        if (Turn === 'O') {
            setTurn('X')
            if (movesound) movesound.replayAsync();
        }
        else {
            setTurn('O')
            if (movesound) movesound.replayAsync();
        }

    }
    function checkWinner(board) {
        const winningcombination = [
            [0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15],
            [0, 4, 8, 12], [1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15],
            [0, 5, 10, 15], [3, 6, 9, 12],
        ]
        for (let comb of winningcombination) {
            const [a, b, c, d] = comb;
            if (board[a] && board[a] === board[b] && board[a] === board[c] && board[a] === board[d]) {
                setWinner(board[a])
            if (winsound) winsound.replayAsync();
                return
            }
            if (!board.includes(null)) {
                setWinner('TIE')
                if (drawsound) drawsound.replayAsync();
                return
            }

        }
    }
    const restartGame = () => {
        setBoard(Array(16).fill(null));
        setTurn('O')
        setWinner(null)

    }
    const glowAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        if (winner) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(glowAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: false,
                    }),
                    Animated.timing(glowAnim, {
                        toValue: 0,
                        duration: 1000,
                        useNativeDriver: false,
                    }),
                ]),
            ).start();
        } else {
            glowAnim.setValue(0); // Reset glow animation when the game restarts
        }
    }, [winner]);

    const glowStyle = {
        shadowColor: '#FFD700',
        borderRadius: wp('5%'),
        padding: wp('2%'),
        shadowOpacity: glowAnim,
        shadowRadius: glowAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 20],
        }),
        shadowOffset: { width: 0, height: 0 },
        elevation: 10,
        borderColor: glowAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['#FFF', '#FFD700'],
        }),
        borderWidth: glowAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 3],
        }),
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* <View><Text>{winner}</Text></View> */}
            <View style={styles.controls}>
                <Text style={styles.turnText}>Turn:{Turn}</Text>
                {winner && <Text style={styles.winnerText}>{winner === 'TIE' ? 'It\'s a Tie!' : `Winner: ${winner}`}</Text>}


                <TouchableOpacity onPress={restartGame} style={styles.button}>
                    <Text style={styles.buttonText}>{"Restart"}</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.gameArea}>
            <Animated.View style={[ winner && glowStyle]}>
                <View style={styles.board}>
                    {
                        board.map((cell, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => handlePress(index)}
                                style={[styles.cell, winner && styles.disabledCell]}
                            >

                                <Text style={[styles.cellText, cell === 'X' ? styles.textX : styles.textO]}>{cell}</Text>
                            </TouchableOpacity>

                        ))
                    }

                </View>

            </Animated.View >

            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        // padding: 2,
        // alignItems: 'center'

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
    gameArea: {
       flex:1,
        alignItems:'center',
        // justifyContent:"center"


    },
    board: {
        marginVertical:hp('5%'),
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: wp('85%'),
        justifyContent: 'center',
        alignItems: 'center',

    },
    cell: {
        width: wp('20%'),
        height: wp('20%'),
        margin: wp('0.2%'),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,

    },
    cellText: {
        fontSize: wp('7%'),
        fontWeight: 'bold',
    },
    textX: {
        color: '#FF4500',
    },
    textO: {
        color: '#1E90FF',
    },
    disabledCell: {
        opacity: 0.8,
    },
})