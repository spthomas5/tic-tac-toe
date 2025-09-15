import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Animated } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import Square from './Square';
import { useResponsiveSize } from './hooks/useResponsiveSize';

type Cell = 'X' | 'O' | null;
type Board = Cell[][];
type WinningLine = {
  start: { row: number; col: number };
  end: { row: number; col: number };
  type: 'horizontal' | 'vertical' | 'diagonal';
};

const GameBoard = () => {
  const [board, setBoard] = useState<Board>([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ])

  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<'player' | 'cpu' | 'draw' | null>(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winningLine, setWinningLine] = useState<WinningLine | null>(null);
  const confettiRef = useRef<ConfettiCannon>(null);
  const lineDrawAnim = useRef(new Animated.Value(0)).current;

  const animateWinningLine = () => {
    lineDrawAnim.setValue(0);

    Animated.timing(lineDrawAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    if (winningLine) {
      animateWinningLine();
    }
  }, [winningLine]);

  const makeAIMove = (currentBoard: Board) => {
    // Find all empty cells
    const emptyCells = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (currentBoard[i][j] === null) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    // Pick a random empty cell
    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { row, col } = emptyCells[randomIndex];

      // Make the move
      const newBoard = currentBoard.map(r => [...r]);
      newBoard[row][col] = 'O';
      setBoard(newBoard);

      // Check if AI won
      const result = checkWinner(newBoard);
      if (result.winner === 'O') {
        setWinner('cpu');
        setGameOver(true);
        setWinningLine(result.winningLine);
      } else if (result.winner === 'X') {
        setWinner('player');
        setGameOver(true);
        setWinningLine(result.winningLine);
      } else if (result.winner === 'draw') {
        setWinner('draw');
        setGameOver(true);
      }

      // CPU turn is over
      setIsPlayerTurn(true);
    }
  };

  const handlePress = (rowIndex: number, colIndex: number) => {

    // Player moves (X)
    const newBoard = board.map(row => [...row]);
    newBoard[rowIndex][colIndex] = 'X';
    setBoard(newBoard);

    // Check if player won
    const result = checkWinner(newBoard);
    if (result.winner === 'X') {
      setWinner('player');
      setGameOver(true);
      setWinningLine(result.winningLine);
      setTimeout(() => confettiRef.current?.start(), 100);
      return;
    } else if (result.winner === 'draw') {
      setWinner('draw');
      setGameOver(true);
      return;
    }

    // AI moves after a delay
    setIsPlayerTurn(false);
    setTimeout(() => {
      makeAIMove(newBoard);
    }, 500);
  };

  const checkWinner = (board: Board): { winner: 'X' | 'O' | 'draw' | null; winningLine: WinningLine | null } => {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
        return {
          winner: board[i][0],
          winningLine: {
            start: { row: i, col: 0 },
            end: { row: i, col: 2 },
            type: 'horizontal'
          }
        };
      }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
      if (board[0][i] && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
        return {
          winner: board[0][i],
          winningLine: {
            start: { row: 0, col: i },
            end: { row: 2, col: i },
            type: 'vertical'
          }
        };
      }
    }

    // Check diagonal (top-left to bottom-right)
    if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
      return {
        winner: board[0][0],
        winningLine: {
          start: { row: 0, col: 0 },
          end: { row: 2, col: 2 },
          type: 'diagonal'
        }
      };
    }

    // Check diagonal (top-right to bottom-left)
    if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
      return {
        winner: board[0][2],
        winningLine: {
          start: { row: 0, col: 2 },
          end: { row: 2, col: 0 },
          type: 'diagonal'
        }
      };
    }

    // Check for draw
    const isDraw = board.every(row => row.every(cell => cell !== null));
    if (isDraw) return { winner: 'draw', winningLine: null };

    return { winner: null, winningLine: null };
  };
  
  const resetGame = () => {
    setBoard([
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ]);
    setGameOver(false);
    setWinner(null);
    setWinningLine(null);
    setIsPlayerTurn(true);
    confettiRef.current?.stop();
  };

  const renderWinningLine = () => {
    if (!winningLine) return null;

    const boardSize = useResponsiveSize(85);
    const squareSize = boardSize / 3;
    const lineThickness = useResponsiveSize(1);

    let lineStyle = {};

    const padding = squareSize * 0.15; // Extend line beyond squares

    if (winningLine.type === 'horizontal') {
      const row = winningLine.start.row;
      lineStyle = {
        width: lineDrawAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, boardSize + (padding * 2)],
        }),
        height: lineThickness,
        top: (row * squareSize) + (squareSize / 2) - (lineThickness / 2),
        left: -padding,
      };
    } else if (winningLine.type === 'vertical') {
      const col = winningLine.start.col;
      lineStyle = {
        width: lineThickness,
        height: lineDrawAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, boardSize + (padding * 2)],
        }),
        top: -padding,
        left: (col * squareSize) + (squareSize / 2) - (lineThickness / 2),
      };
    } else if (winningLine.type === 'diagonal') {
      const isMainDiagonal = winningLine.start.row === 0 && winningLine.start.col === 0;
      const extendedLength = Math.sqrt(2) * (boardSize + (padding * 2));

      lineStyle = {
        width: lineDrawAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, extendedLength],
        }),
        height: lineThickness,
        top: (boardSize / 2) - (lineThickness / 2),
        left: -(extendedLength - boardSize) / 2,
        transformOrigin: 'left center',
        transform: [{ rotate: isMainDiagonal ? '45deg' : '-45deg' }],
      };
    }

    return (
      <View style={styles.winningLineContainer}>
        <Animated.View style={[styles.winningLine, lineStyle]} />
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: useResponsiveSize(5),
      paddingVertical: useResponsiveSize(2, 'height'),
    },
    title: {
      fontSize: useResponsiveSize(8),
      fontFamily: 'Poppins-Bold',
      textAlign: 'center',
      marginBottom: useResponsiveSize(3, 'height'),
      color: '#333',
    },
    status: {
      fontSize: useResponsiveSize(5),
      fontFamily: 'Poppins-Medium',
      textAlign: 'center',
      marginBottom: useResponsiveSize(4, 'height'),
      color: '#666',
      minHeight: useResponsiveSize(4, 'height'),
    },
    board: {
      width: useResponsiveSize(85),
      aspectRatio: 1,
      marginBottom: useResponsiveSize(4, 'height'),
      position: 'relative',
    },
    winningLineContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      pointerEvents: 'none',
    },
    winningLine: {
      backgroundColor: '#000000',
      position: 'absolute',
    },
    row: {
      flex: 1,
      flexDirection: 'row',
    },
    resetButton: {
      paddingVertical: useResponsiveSize(2, 'height'),
      paddingHorizontal: useResponsiveSize(8),
      backgroundColor: '#007AFF',
      borderRadius: useResponsiveSize(3),
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.5,
      elevation: 5,
    },
    resetButtonText: {
      color: 'white',
      fontSize: useResponsiveSize(4.5),
      fontFamily: 'Poppins-SemiBold',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tic Tac Toe</Text>

      {/* Show game status */}
      <Text style={styles.status}>
        {winner === 'player' && 'You Win! 🎉'}
        {winner === 'cpu' && 'CPU Wins! 🤖'}
        {winner === 'draw' && "It's a Draw! 🤝"}
        {!winner && !gameOver && !isPlayerTurn && 'CPU\'s Turn'}
        {!winner && !gameOver && isPlayerTurn && 'Your Turn'}
      </Text>

      <View style={styles.board}>
        {board.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              <Square
                key={`${rowIndex}-${colIndex}`}
                value={cell}
                onPress={() => handlePress(rowIndex, colIndex)}
                row={rowIndex}
                col={colIndex}
                disabled={!isPlayerTurn || gameOver || cell !== null}
              />
            ))}
          </View>
        ))}
        {renderWinningLine()}
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={resetGame} >
        <Text style={styles.resetButtonText}>New Game</Text>
      </TouchableOpacity>

      {winner === 'player' && (
        <ConfettiCannon
          ref={confettiRef}
          count={150}
          origin={{x: -10, y: 0}}
          autoStart={false}
          fadeOut={true}
        />
      )}

    </View>
  );
};

export default GameBoard;