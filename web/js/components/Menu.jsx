import * as React from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import * as ReactDOM from 'react-dom';
import Notifications, {notify} from 'react-notify-toast';

export function Player(props){
  return(
    <div className="player" id="waitingroom">
      {props.name}
    </div>
  )
}

export class MenuScreen extends React.Component{
  render(){
    return(
      <div className="container vt-center">       

          <button
            onClick={this.props.hostGameButtonPressed}
            className="player" id="menu">Host Game
          </button>

          <button
            onClick={this.props.joinGameButtonPressed}
            className="player" id="menu">Join Game
          </button>
          
      </div>
      )
  }
}

export class WaitingRoom extends React.Component {

  constructor(props){
    super(props);
    this.startGameButtonPressed = this.startGameButtonPressed.bind(this)
    this.onCopy = this.onCopy.bind(this)
  }

  onCopy(){
    notify.show("Copied to clipboard!","success",this.props.TOAST_TIMEOUT)
  }

  render(){
    return(
      <div>
        <div>
          <h1>You're in!</h1><div className="description">Invite friends to the game by copying the game link<br/></div>
          <CopyToClipboard text={window.location.href+"?game="+this.props.gameId} onCopy={this.onCopy}>
            <button className="player">Copy game link</button>
          </CopyToClipboard>
          <h1>Waiting Room</h1>
          <div className="player-list">
            {this.props.players.map(function(player){
                return (
                  <Player name={player} />
                );
            }.bind(this))}
            </div>
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