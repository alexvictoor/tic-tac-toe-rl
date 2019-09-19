import React from 'react';
import './App.css';
import { Game } from './engine/game';
import { DummyAgent, QAgent } from './engine/agent';
import { train } from './engine/engine';

const App: React.FC = () => {
  return (
    <div className="App">
      
      <GameComponent/>
    </div>
  );
}

function Square(props: any) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component<any> {
  renderSquare(i: number) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class GameComponent extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    const firstAgent = new QAgent('Player1', 0.3, 0.2);
    const secondAgent = new QAgent('Player2', 0.3, 0.2);
    const initialGame = new Game();
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          game: initialGame,
        }
      ],
      stepNumber: 0,
      trainingDone: false,
      player2Agent: secondAgent.play,
    };
    this.triggerPlayer2Agent = this.triggerPlayer2Agent.bind(this);
    setTimeout(() => {
      train(firstAgent, secondAgent);
      this.setState({ trainingDone: true})
    });
  }

  handleClick(i: number) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const game: Game = current.game;
    const player1Turn = game.currentPlayer === "Player1";
    if (game.isOver() || !game.whereToPlay().includes(i) || !player1Turn) {
      return;
    }
    const newGame = game.play(i);
    this.updateGameState(player1Turn, i, newGame, this.triggerPlayer2Agent);
  }

  triggerPlayer2Agent(currentGame: Game) {
    const newGame: Game = this.state.player2Agent(currentGame);
    if (!currentGame.isOver()) {
      this.updateGameState(false, newGame.lastPlay, newGame);
    }
  }

  updateGameState(player1Turn: boolean, i: number, newGame: Game, cb?: (newGame: Game) => void) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    squares[i] = player1Turn ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          game: newGame,
          squares,
        }
      ]),
      stepNumber: history.length,
    }, cb && (() => { cb(newGame); }));
  }

  jumpTo(step: number) {
    this.setState({
      stepNumber: step,
    });
  }

  render() {

    if (!this.state.trainingDone) {
      return (<div>Machine is learning how to play...<br/>This might take a few seconds</div>);
    }

    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const game: Game = current.game;
    const winner = game.getWinner();

    const moves = history.map((step: any, move: any) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + game.currentPlayer;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i: any) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}


export default App;
