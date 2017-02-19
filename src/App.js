import React, {Component} from 'react';
import Shuffle from 'shuffle-array';

import './App.css';

const SIZE = 4;
const TILES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null];
const FINAL = TILES.slice();

class App extends Component {
  constructor(props) {
    super(props);

    const shuffled = Shuffle(TILES);
    const empty = shuffled.indexOf(null);

    this.state = {
      empty: empty,
      hasWon: false,
      moves: 0,
      tiles: shuffled
    };
  }

  isInColumn(id) {
    return Math.abs(id - this.state.empty) >= SIZE &&
           this.state.empty % SIZE === id % SIZE;
  }

  isInRow(id) {
    return Math.abs(id - this.state.empty) < SIZE &&
           Math.floor(id / SIZE) === Math.floor(this.state.empty / SIZE);
  }

  checkWin(tiles) {
    return tiles.every((tile, i) => {
      return FINAL[i] === tile || false;
    });
  }

  reorderTiles(id) {
    const {empty} = this.state;
    const tiles = this.state.tiles.slice();
    const increments = this.isInColumn(id) ? SIZE : 1;
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
    const shuffled = Shuffle(TILES);
    const empty = shuffled.indexOf(null);

    this.setState({
      empty: empty,
      hasWon: false,
      moves: 0,
      tiles: shuffled
    });
  }

  render() {
    return (
      <div className="container puzzle">
        <header>
          <h1>15 Puzzle</h1>
        </header>
        <p className="moves">Moves: {this.state.moves}</p>
        <div className="row grid">
          {this.wrapTiles(this.state.tiles)}
        </div>
        <div className="row other">
          {this.state.hasWon && <span className="message">You win!</span>}
          <button onClick={this.handleButtonClick.bind(this)}>Start Over</button>
        </div>
      </div>
    );
  }

  wrapTiles(tiles) {
    return tiles.map((tile='', key) => {
      const classes = tile ? 'tile' : 'tile empty';
      return (
        <div key={key} className={classes} onClick={this.handleTileClick.bind(this)}>
          <span id={key}>{tile}</span>
        </div>
      );
    });
  }
}

export default App;
