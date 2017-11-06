import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Notifications, {notify} from 'react-notify-toast';

export function Player(props){
  return(
    <div className="player">
      {props.name}
    </div>
  )
}

export class MenuScreen extends React.Component{
  render(){
    return(
      <div className="container">       

          <button
            onClick={this.props.hostGameButtonPressed}
            className="btn btn-primary menu-button">Host Game
          </button>

          <button
            onClick={this.props.joinGameButtonPressed}
            className="btn btn-primary menu-button">Join Game
          </button>
          
      </div>
      )
  }
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

      <div>
        <div className="description">Share this game code with your friends:</div>
        <div className="player">{this.props.gameId}</div>
        <div className="description">Waiting Room</div>

          {this.props.players.map(function(player){
              return (
                <Player name={player} />
              );
          }.bind(this))}
          {this.props.isHost ? <button className="action-button" onClick={this.startGameButtonPressed}>
            Start Game
          </button> : null}
        </div>

      </div>
    )
  }

  startGameButtonPressed(){
    // Change game state so other devices will start the game too

    this.props.changeGameState("write")

  }
}

WaitingRoom.propTypes = {
  gameId: React.PropTypes.string.isRequired
}

export class JoinGame extends React.Component {
  constructor(props){
    super(props)

    this.onSubmit = this.onSubmit.bind(this)
  }
  render(){
    return(
          <div>
          <h3>Enter magic code to join game:</h3>
            <form onSubmit={this.onSubmit}>
              <label style={{display:'block'}}>
                <input  type="text"
                        value={this.props.gameId}
                        onChange={this.props.onChange}
                        className="form-control"
                        />
              </label>
              <input  type="submit"
                      value="Join Game"
                      className="btn-lg btn-outline-secondary" />
            </form>
          </div>
      // Listen for server to tell us to start game
    )
  }

  onSubmit(e){
    e.preventDefault();
    this.props.onSubmit(this.props.gameId)
  }
}