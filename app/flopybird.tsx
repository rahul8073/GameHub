import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
const { width, height } = Dimensions.get('window')
const bird_Size = wp('15%')
const obstacle_width = wp('10%')
const obstacle_gaps = hp('25%')
const gravity = 6
export default function FlopyBird() {
    const [birdBottom, setBirdBottom] = useState(height/2)
    const [obstacleLeft, setObstacleLeft] = useState(width)
    const [obstacleHight, setObstacleHeight] = useState(20);
    const [gameOver, setGameover] = useState(false);
    const [score, setScore] = useState(0)
    let birdtime;
    let obstackleTime;
    const backgroundAnim = useRef(new Animated.Value(0)).current;
    const soundRef = useRef({ bgMusic: null, gameOverSound: null });

    useEffect(() => {
        const loadSound = async () => {
            try {
                // Load background music
                const bgMusic = await Audio.Sound.createAsync(
                    require('../assets/flopybird/birdbgsound.mp3'),
                    { shouldPlay: false, isLooping: true, volume: 0.5 }
                );

                // Load game over sound
                const gameOverSound = await Audio.Sound.createAsync(
                    require('../assets/snakeAudio/gameover.mp3')
                );

                // Save sound instances in the ref
                soundRef.current = {
                    bgMusic: bgMusic.sound, // Correctly assign the sound object
                    gameOverSound: gameOverSound.sound,
                };

                // Start background music if the game is not over
                if (!gameOver) {
                    soundRef.current.bgMusic.playAsync();
                }
            } catch (error) {
                console.error('Error loading sounds:', error);
            }
        };

        loadSound();

        return () => {
            const { bgMusic, gameOverSound } = soundRef.current;

            // Unload sounds to free resources
            if (bgMusic) bgMusic.unloadAsync();
            if (gameOverSound) gameOverSound.unloadAsync();
        };
    }, []);


    useEffect(() => {
        const { bgMusic, gameOverSound } = soundRef.current;
        if (gameOverSound) {
            if (gameOver) {
                gameOverSound.replayAsync();
            }
        }

        if (bgMusic) {
            if (gameOver) {
                bgMusic.stopAsync(); // Stop the background music on game over
            } else {
                bgMusic.setPositionAsync(0); // Reset position
                bgMusic.playAsync(); // Play the background music when game restarts
            }
        }
    }, [gameOver]);

    // useEffect(() => {
    //     if (!gameOver) {
    //       Animated.loop(
    //         Animated.timing(backgroundAnim, {
    //           toValue: -width,
    //           duration: 8000,
    //           useNativeDriver: true,
    //         })
    //       ).start();
    //     } else {
    //       backgroundAnim.stopAnimation();
    //     }
    //   }, [gameOver]);

    useEffect(() => {
        if (!gameOver) {

            birdtime = setInterval(() => {
                setBirdBottom(prev => Math.max(prev - gravity, 0))
            }, 30);
            return () => clearInterval(birdtime)

        }
    }, [gameOver])

    useEffect(() => {
        if (!gameOver) {
            obstackleTime = setInterval(() => {
                setObstacleLeft(prev => (prev > -(obstacle_gaps) ? Math.max(prev - 5) : width))

                if (obstacleLeft <= -obstacle_gaps) {
                    setObstacleHeight(Math.random() * (height - obstacle_gaps))
                    setScore((score) => score + 1);
                }
            }, 10);
       
            if (obstacleLeft <= 0 && obstacleLeft>= -5 ) {
                setScore((score) => score + 1);
            }


            return () => clearInterval(obstackleTime)

        }

    }, [obstacleLeft, gameOver])

    useEffect(() => {
    //    console.log(obstacleHight ,obstacle_gaps,birdBottom);
       
        if (
            birdBottom <= 0 || birdBottom >= (height - bird_Size) ||
            // bottom obstacle collison
            (birdBottom <= obstacleHight &&
                obstacleLeft < (bird_Size + obstacle_width) &&
                obstacleLeft+obstacle_width > bird_Size

            ) ||
            // top obstacle collison
            (birdBottom >= obstacleHight+obstacle_gaps &&
                obstacleLeft < (bird_Size + obstacle_width - obstacle_gaps) &&
                obstacleLeft+obstacle_width > bird_Size - obstacle_gaps

            )
        ) {
            setGameover(true);
            clearInterval(birdtime);
            clearInterval(obstackleTime);
        }
        
    }, [birdBottom, obstacleHight, obstacleLeft]);

    const jump = () => {
        if (!gameOver)
            setBirdBottom((prev) => Math.max(prev + 90, 0))
    }
    const restartGame = () => {
        setGameover(false);
        setBirdBottom(height/2)
        setObstacleHeight(20);
        setObstacleLeft(width)
        setScore(0)
    }
    return (
        <TouchableWithoutFeedback onPress={jump}>
            <View style={styles.container}>

                <Animated.Image
                    source={require('../assets/flopybird/cloudbg.jpg')}
                    style={[
                        styles.background,
                        {
                            transform: [{ translateX: backgroundAnim }],
                        },
                    ]}
                />

                <Animated.Image
                    source={require('../assets/flopybird/bird.png')}
                    style={[
                        styles.bird,
                        {
                            bottom: birdBottom,
                            left: bird_Size / 2
                        }
                    ]}
                />

                <LinearGradient
                    colors={['#EF1212', '#C9491A', '#4EC2B4']}
                    style={[
                        styles.obstacle,
                        {
                            height: obstacleHight,
                            left: obstacleLeft,
                            bottom: 0
                        }
                    ]}

                />
                <LinearGradient
                    // Background Linear Gradient
                    colors={['#4EC2B4', '#C9491A', '#EF1212']}
                    style={[
                        styles.obstacle,
                        {
                            height: height-obstacleHight-obstacle_gaps-bird_Size,
                            left: obstacleLeft + obstacle_gaps,
                            top: 0
                        }
                    ]}
                />


                <Text style={styles.score}>Score: {score}</Text>


                {gameOver && (
                    <View style={styles.gameOverOverlay}>
                        <Text style={styles.gameOverText}>Game Over!!</Text>
                        <TouchableOpacity onPress={restartGame} style={styles.restartButton}>
                            <Text style={styles.restartButtonText}>Restart</Text>
                        </TouchableOpacity>
                    </View>
                )}

            </View>

        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000'
    },
    score: {
        position: 'absolute',
        top: 50,
        alignSelf: 'center',
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
    },
    background: {
        position: 'absolute',
        width: width * 2, // Double the width for seamless scrolling
        height: hp('130%'),
        resizeMode: 'cover',
    },
    bird: {
        width: bird_Size,
        height: bird_Size,
        position: 'absolute',
        resizeMode: 'contain',
        // backgroundColor:'pink'
    },
    obstacle: {
        position: 'absolute',
        width: obstacle_width,
        // backgroundColor: '#56A3A7',
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
        fontSize: hp('5%'),
        marginBottom: hp('5%'),
    },
    restartButton: {
        backgroundColor: '#ff5722',
        padding: hp('2%'),
        borderRadius: hp('5%'),
    },
    restartButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: hp('2%'),
    },

})