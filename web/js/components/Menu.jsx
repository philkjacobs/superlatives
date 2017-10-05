import * as React from 'react';
import * as ReactDOM from 'react-dom';
import WriteSupers from './WriteSupers.jsx';
import AssignSupers from './AssignSupers.jsx';
import ReadSupers from './ReadSupers.jsx';
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
      {this.props.gameState=="room" ? <div>
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
        </div> : null }

      {this.props.gameState=="write" ?
        <WriteSupers
          submitSuper={this.props.submitSuper}
          changeStatus={this.props.changeStatus}
          players={this.props.players}
          gameState={this.props.gameState}
          now={Date.now()}/> : null }

      {this.props.gameState=="assign" ?
        <AssignSupers
          changeStatus={this.props.changeStatus}
          players={this.props.players}
          assignSuper={this.props.assignSuper}/> : null }

      {this.props.gameState=="read" ?
        <ReadSupers
          changeStatus={this.props.changeStatus} /> : null }

      </div>
    )
  }

  startGameButtonPressed(){
    // Change game state so other devices will start the game too
    // TODO: This needs to change state at the Application level
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
                <input type="text" value={this.props.gameId} onChange={this.props.onChange}/>
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
    this.props.onSubmit(this.props.gameId)
  }

}