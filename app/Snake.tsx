import { Audio } from 'expo-av';
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, Text, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const { width, height } = Dimensions.get('window');

const GRID_SIZE = Math.min(wp('5%'), hp('5%')); // Grid size adapts to screen
const CONTROLS_HEIGHT = hp('10%');
const GAME_AREA_HEIGHT = height - CONTROLS_HEIGHT-hp('7%'); // Adjust game area height
const NUM_COLUMNS = Math.floor(width / GRID_SIZE);
const NUM_ROWS = Math.floor(GAME_AREA_HEIGHT / GRID_SIZE);

const initialSnake = [{ x: 3, y: 3 }];
const initialFood = { x: 7, y: 7 };

const Game = () => {
    const [snake, setSnake] = useState(initialSnake); 
    const [food, setFood] = useState(initialFood);
    const [direction, setDirection] = useState('RIGHT');
    const [gameOver, setGameOver] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [score,setScore]=useState(0)
    const [speed,setSpeed]=useState(300)

    const foodScale = useRef(new Animated.Value(1)).current;
    const soundRef = useRef({eatSound:null,gameOverSound:null});

    useEffect(() => {
        const loadSound = async () => {
            const eatSound = await Audio.Sound.createAsync(require('../assets/snakeAudio/eatsnake.mp3'));
            const gameOverSound = await Audio.Sound.createAsync(require('../assets/snakeAudio/gameover.mp3'));

            soundRef.current = {
                gameOverSound: gameOverSound.sound,
                eatSound: eatSound.sound,
              
            };
        };

        loadSound();

        return () => {
            const { eatSound, gameOverSound } = soundRef.current;

            if (eatSound) eatSound.unloadAsync();
            if (gameOverSound) gameOverSound.unloadAsync();
        };
    }, []);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(foodScale, {
                    toValue: 1.5,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(foodScale, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const onGameTick = () => {
        if (gameOver) return;
        const { eatSound, gameOverSound } = soundRef.current;
        const head = { ...snake[0] };

        if (direction === 'RIGHT') head.x += 1;
        if (direction === 'LEFT') head.x -= 1;
        if (direction === 'UP') head.y -= 1;
        if (direction === 'DOWN') head.y += 1;

        if (
            head.x < 0 ||
            head.x >= NUM_COLUMNS ||
            head.y < 0 ||
            head.y >= NUM_ROWS ||
            snake.some((seg) => seg.x === head.x && seg.y === head.y)
        ) {
            if (gameOverSound) {
                gameOverSound.replayAsync();
            }
            setGameOver(true);
            return;
        }

        const newSnake = [head, ...snake];

        if (head.x === food.x && head.y === food.y) {
            if(speed>20)setSpeed(speed-2)
                setScore(score+2)
            if (eatSound) {
                eatSound.replayAsync();
            }

            let newFood;
            do {
                newFood = {
                    x: Math.floor(Math.random() * NUM_COLUMNS),
                    y: Math.floor(Math.random() * NUM_ROWS),
                };
            } while (snake.some((seg) => seg.x === newFood.x && seg.y === newFood.y));
    
            setFood(newFood);
        } else {
            newSnake.pop();
        }

        setSnake(newSnake);
    };

    useEffect(() => {
        if (isPlaying) {
            const interval = setInterval(onGameTick, speed);
            return () => clearInterval(interval);

        }
    }, [snake, direction, gameOver, isPlaying,speed]);

    const handleControl = () => {
        if (gameOver) {
            restartGame();
        }
        else {
            setIsPlaying(!isPlaying);
        }

    }

    const restartGame = () => {
        setSnake(initialSnake);
        setFood(initialFood);
        setDirection('RIGHT');
        setGameOver(false);
        setSpeed(300)
        setScore(0)
    };

    const onGestureEvent = (event) => {
        const { translationX, translationY } = event.nativeEvent;

        if (Math.abs(translationX) > Math.abs(translationY)) {
            if (translationX > 0 && direction !== 'LEFT') {
                setDirection('RIGHT');
            } else if (translationX < 0 && direction !== 'RIGHT') {
                setDirection('LEFT');
            }
        } else {
            if (translationY > 0 && direction !== 'UP') {
                setDirection('DOWN');
            } else if (translationY < 0 && direction !== 'DOWN') {
                setDirection('UP');
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.controls}>
                <Text style={styles.score}>Score: {score}</Text>

                <TouchableOpacity onPress={handleControl} style={styles.button}>
                    <Text style={styles.buttonText}>{!gameOver ? isPlaying ? 'Pause' : 'Play' : "Restart"}</Text>
                </TouchableOpacity>
            </View>
            <GestureHandlerRootView>
                <PanGestureHandler onGestureEvent={onGestureEvent}>
                    <View style={[styles.gameArea, { width, height: GAME_AREA_HEIGHT }]}>
                        {snake.map((segment, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.snakeSegment,
                                    {
                                        left: segment.x * GRID_SIZE,
                                        top: segment.y * GRID_SIZE,
                                    },
                                ]}
                            />
                        ))}

                        <Animated.View
                            style={[
                                styles.food,
                                {
                                    left: food.x * GRID_SIZE,
                                    top: food.y * GRID_SIZE,
                                    transform: [{ scale: foodScale }],
                                },
                            ]}
                        />

                        {gameOver && (
                            <View style={styles.gameOverOverlay}>
                                <Text style={styles.gameOverText}>Game Over!!</Text>
                                {/* <TouchableOpacity onPress={restartGame} style={styles.restartButton}>
                                    <Text style={styles.restartButtonText}>Restart</Text>
                                </TouchableOpacity> */}
                            </View>
                        )}
                    </View>
                </PanGestureHandler>
            </GestureHandlerRootView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222',
    },
    controls: {
        height: CONTROLS_HEIGHT,
        backgroundColor: '#444',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: hp('3%'),
    },
    score: {
        color: 'white',
        fontSize:  hp('2%'),
    },
    button: {
        backgroundColor: '#ff5722',
        paddingVertical: wp('2%'),
        paddingHorizontal:  hp('2%'),
        borderRadius: wp('5%'),
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    gameArea: {
        backgroundColor: 'black',
        position: 'relative',
    },
    snakeSegment: {
        position: 'absolute',
        width: GRID_SIZE,
        height: GRID_SIZE,
        backgroundColor: 'green',
        borderRadius: GRID_SIZE / 2,
    },
    food: {
        position: 'absolute',
        width: GRID_SIZE,
        height: GRID_SIZE,
        backgroundColor: 'red',
        borderRadius: GRID_SIZE / 2,
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
    restartButton: {
        backgroundColor: '#ff5722',
        paddingVertical:  hp('5%'),
        paddingHorizontal:  hp('5%'),
        borderRadius:  hp('5%'),
    },
    restartButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize:  hp('5%'),
    },
});


export default Game;