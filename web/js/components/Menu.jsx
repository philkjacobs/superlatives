import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Notifications, {notify} from 'react-notify-toast';

// Hard-coding player names. These will eventually live-update as new players are added to the database for a given gameID
export var players = ['Mathew', 'Jeremy', 'Ben', 'Philip', 'Julia', 'Brian']

export function Player(props){
  return(
    <div>
      {props.name}
    </div>
  )
}

export class WaitingRoom extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      startGame: false
    }
    this.startGameButtonPressed = this.startGameButtonPressed.bind(this)
  }

  render(){
    return(
      <div>
      <h3>Heres your special game code: {this.props.gameId}.</h3>
      <p>Share this with your friends</p>
        <h3>Waiting Room</h3>
        {this.props.players.map(function(player){
            return (
              <Player name={player} />
            );
        }.bind(this))}
        {this.props.isHost ? <button className="btn-rounded btn-outlined orange-btn" onClick={this.startGameButtonPressed}>
          Start Game
        </button> : null}
        {this.state.startGame ? <WriteSupers /> : null}
      </div>
    )
  }

  startGameButtonPressed(){
    // Change game state so other devices will start the game too
    this.setState({
      startGame: true
    })
  }
}

WaitingRoom.propTypes = {
  gameId: React.PropTypes.string.isRequired,
  isHost: React.PropTypes.Bool
}

export class JoinGame extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      goToWaitingRoom: false
    }
    this.onSubmit = this.onSubmit.bind(this)
  }
  render(){
    return(
      <div>
          {this.state.goToWaitingRoom ? <WaitingRoom players={players} gameId={this.props.gameId}/> : <div>
          <h3>Enter magic code to join game:</h3>
            <form onSubmit={this.onSubmit}>
              <label>
                <input type="text" />
              </label>
              <input type="submit" value="Join Game" />
            </form>
          </div>}
      </div>
      // Listen for server to tell us to start game
    )
  }

  onSubmit(e){
    e.preventDefault();
    // For now, it's always true. Eventually, it'll do a check before going to the waiting room
    this.setState({
      goToWaitingRoom: true
    });
  }
}