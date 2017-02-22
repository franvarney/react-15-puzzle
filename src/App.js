import React, {Component} from 'react';
import Shuffle from 'shuffle-array';

import './App.css';

function initArray(size) {
  const tiles = Array(size * size).fill().map(Function.call, (n) => ++n);
  tiles[tiles.length - 1] = null;
  return tiles;
}

class App extends Component {
  constructor(props) {
    super(props);

    const tiles = initArray(4);
    const shuffled = Shuffle(tiles);

    this.state = {
      empty: shuffled.indexOf(null),
      final: tiles.slice(),
      hasWon: false,
      moves: 0,
      size: 4,
      tiles: shuffled
    };
  }

  isInColumn(id) {
    return Math.abs(id - this.state.empty) >= this.state.size &&
           this.state.empty % this.state.size === id % this.state.size;
  }

  isInRow(id) {
    return Math.abs(id - this.state.empty) < this.state.size &&
           Math.floor(id / this.state.size) === Math.floor(this.state.empty / this.state.size);
  }

  checkWin(tiles) {
    return tiles.every((tile, i) => {
      return this.state.final[i] === tile || false;
    });
  }

  reorderTiles(id) {
    const {empty} = this.state;
    const tiles = this.state.tiles.slice();
    const increments = this.isInColumn(id) ? this.state.size : 1;
    const min = Math.min(id, empty);
    const max = Math.max(id, empty);

    for (let i = min; i < max; i += increments) {
      if (!this.state.tiles[max]) {
        tiles[i + increments] = this.state.tiles[i];
      } else tiles[i] = this.state.tiles[increments + i];
    }

    if (this.state.tiles[max]) tiles[max] = null;
    if (this.state.tiles[min]) tiles[min] = null;

    return tiles;
  }

  handleTileClick(event) {
    const id = Number(event.target.id);

    if (!(this.isInColumn(id) || this.isInRow(id))) return false;

    const tiles = this.reorderTiles(id);
    const hasWon = this.checkWin(tiles);

    this.setState({
      tiles: tiles,
      empty: id,
      hasWon: hasWon,
      moves: this.state.moves + 1
    });
  }

  handleButtonClick() {
    const tiles = initArray(this.state.size);
    const shuffled = Shuffle(tiles);
    const empty = shuffled.indexOf(null);

    this.setState({
      empty: empty,
      hasWon: false,
      moves: 0,
      tiles: shuffled
    });
  }

  handleIncrement(event) {
    if (event.target.disabled) return;

    const size = this.state.size + 1;
    const tiles = initArray(size);
    const shuffled = Shuffle(tiles);

    this.setState({
      size: size,
      percent: 100 / size,
      tiles: shuffled,
      empty: shuffled.indexOf(null)
    });
  }

  handleDecrement(event) {
    if (event.target.disabled) return;

    const size = this.state.size - 1;
    const tiles = initArray(size);
    const shuffled = Shuffle(tiles);

    this.setState({
      size: size,
      percent: 100 / size,
      tiles: shuffled,
      empty: shuffled.indexOf(null)
    });
  }

  render() {
    return (
      <div className="container puzzle">
        <header>
          <h1>{this.state.size * this.state.size - 1} Puzzle</h1>
        </header>
        <p className="moves">Moves: {this.state.moves}</p>
        <div className="row grid">
          {this.wrapTiles(this.state.tiles)}
        </div>
        <div className="row other">
          {this.state.hasWon && <span className="message">You win!</span>}
          <button onClick={this.handleButtonClick.bind(this)}>Start Over</button>
          <span>Change size:
            <button disabled={this.state.size >= 9}
              onClick={this.handleIncrement.bind(this)}>+</button>
            <button disabled={this.state.size <= 3}
              onClick={this.handleDecrement.bind(this)}>-</button>
          </span>
        </div>
      </div>
    );
  }

  wrapTiles(tiles) {
    return tiles.map((tile='', key) => {
      const classes = tile ? 'tile' : 'tile empty';
      const size = 100 / this.state.size;
      return (
        <div
          key={key}
          className={classes}
          onClick={this.handleTileClick.bind(this)}
          style={{ width: `${size}%`, height: `${size}%` }}>
          <span id={key}>{tile}</span>
        </div>
      );
    });
  }
}

export default App;
