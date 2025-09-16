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
    const boardPadding = useResponsiveSize(2); // Account for board container padding
    const actualBoardSize = boardSize - (boardPadding * 2);
    const squareSize = actualBoardSize / 3;
    const lineThickness = useResponsiveSize(1);

    let lineStyle = {};

    const padding = squareSize * 0.15; // Extend line beyond squares

    // Get the winning color based on the winner
    const getWinningLineColor = () => {
      if (winner === 'player') return '#00ff88'; // Green for X (player)
      if (winner === 'cpu') return '#0066ff'; // Blue for O (CPU)
      return '#00ff88'; // Default green
    };

    if (winningLine.type === 'horizontal') {
      const row = winningLine.start.row;
      lineStyle = {
        width: lineDrawAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, actualBoardSize + (padding * 2)],
        }),
        height: lineThickness,
        top: boardPadding + (row * squareSize) + (squareSize / 2) - (lineThickness / 2),
        left: boardPadding - padding,
      };
    } else if (winningLine.type === 'vertical') {
      const col = winningLine.start.col;
      lineStyle = {
        width: lineThickness,
        height: lineDrawAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, actualBoardSize + (padding * 2)],
        }),
        top: boardPadding - padding,
        left: boardPadding + (col * squareSize) + (squareSize / 2) - (lineThickness / 2),
      };
    } else if (winningLine.type === 'diagonal') {
      const isMainDiagonal = winningLine.start.row === 0 && winningLine.start.col === 0;
      // Simple: diagonal of the board plus some padding
      const diagonalLength = Math.sqrt(2) * actualBoardSize + (padding * 2);

      if (isMainDiagonal) {
        // Top-left to bottom-right: start from top-left corner
        lineStyle = {
          width: lineDrawAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, diagonalLength],
          }),
          height: lineThickness,
          top: boardPadding - padding,
          left: boardPadding - padding,
          transformOrigin: 'left center',
          transform: [{ rotate: '45deg' }],
        };
      } else {
        // Top-right to bottom-left: start from top-right corner
        lineStyle = {
          width: lineDrawAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, diagonalLength],
          }),
          height: lineThickness,
          top: boardPadding - padding,
          left: boardPadding + actualBoardSize + padding,
          transformOrigin: 'left center',
          transform: [{ rotate: '135deg' }],
        };
      }
    }

    return (
      <View style={styles.winningLineContainer}>
        <Animated.View style={[styles.winningLine, lineStyle, { backgroundColor: getWinningLineColor() }]} />
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
      backgroundColor: '#1a1a1a',
    },
    titleContainer: {
      marginBottom: useResponsiveSize(3, 'height'),
      shadowColor: '#00ff88',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 15,
      elevation: 10,
    },
    title: {
      fontSize: useResponsiveSize(8),
      fontFamily: 'Poppins-Bold',
      textAlign: 'center',
      color: '#00ff88',
    },
    status: {
      fontSize: useResponsiveSize(5),
      fontFamily: 'Poppins-Medium',
      textAlign: 'center',
      marginBottom: useResponsiveSize(4, 'height'),
      color: '#a0a0a0',
      minHeight: useResponsiveSize(4, 'height'),
    },
    board: {
      width: useResponsiveSize(85),
      aspectRatio: 1,
      marginBottom: useResponsiveSize(4, 'height'),
      position: 'relative',
      backgroundColor: '#262626',
      borderRadius: useResponsiveSize(4),
      padding: useResponsiveSize(2),
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
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
      backgroundColor: '#00ff88',
      position: 'absolute',
    },
    row: {
      flex: 1,
      flexDirection: 'row',
    },
    resetButton: {
      paddingVertical: useResponsiveSize(3, 'height'),
      paddingHorizontal: useResponsiveSize(12),
      backgroundColor: '#00ff88',
      borderRadius: useResponsiveSize(8),
      alignItems: 'center',
      shadowColor: '#00ff88',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    resetButtonText: {
      color: '#1a1a1a',
      fontSize: useResponsiveSize(4.5),
      fontFamily: 'Poppins-SemiBold',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Tic Tac Toe</Text>
      </View>

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