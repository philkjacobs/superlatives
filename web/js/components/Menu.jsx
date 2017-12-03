import * as React from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import * as QueryString from 'query-string';
import Notifications, {notify} from 'react-notify-toast';
import ReactModal from 'react-modal';
import {MODAL_STYLE} from './ModalStyle.jsx';

export function Player(props){
  return(
    <div className="custom-button waitingroom">
      {props.name}
    </div>
  )
}

export class ShareGameModal extends React.Component{
    constructor(props){
      super(props);
      this.onCopy = this.onCopy.bind(this)
    }
  render(){
    return(
    <ReactModal isOpen={this.props.isOpen} style={MODAL_STYLE}>
      <div className="modal-custom-header">
        <h1>You're in!</h1><div className="description">Invite friends to this game by:</div>
          <ol>
            <li>
              Sharing this game code
              <div className="shareModalGameId">A123-B456-C789-D321</div>
              Your friends can join by going to superlatives.com > Join game
            </li>
            <li>
              Sharing a direct game link (faster) 
              Your friends can join by tapping the link
              <CopyToClipboard text={window.location.origin+"?game="+this.props.gameId} onCopy={this.onCopy}>
                <button className="custom-button">Copy game link</button>
              </CopyToClipboard>
            </li>
          </ol>
          
        <div className="subtitle"><button onClick={this.props.toggleModal.bind(this)}>Tap to hide</button></div>            
      </div>
    </ReactModal>
  )
  }

  onCopy(){
    notify.show("Copied to clipboard!","success",this.props.TOAST_TIMEOUT)
  }
}

export class MenuScreen extends React.Component{
  render(){
    return(
      <div className="container vt-center">       

          <button
            onClick={this.props.hostGameButtonPressed}
            className="custom-button menu">Host Game
          </button>

          <button
            onClick={this.props.joinGameButtonPressed}
            className="custom-button menu">Join Game
          </button>
          
      </div>
      )
  }
}

export class WaitingRoom extends React.Component {

  constructor(props){
    super(props);
    this.state ={
      showModal:true
    }
    this.startGameButtonPressed = this.startGameButtonPressed.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
  }



  render(){
    return(
      <div>
        <div>
          {this.state.showModal ? <ShareGameModal gameId={this.props.gameId}
                                                  isOpen={this.state.showModal}
                                                  toggleModal={function(){this.toggleModal()}.bind(this)}/> : null}
          
          <h1>Waiting Room</h1>
          <div className="player-list">
            {this.props.players.map(function(player){
                return (
                  <Player name={player} />
                );
            }.bind(this))}
            </div>
            {this.props.isHost ? 
              <div>
                <button className="action-button top-button" onClick={this.toggleModal}>
                Share Game
                </button>
                <button className="action-button bottom-button" onClick={this.startGameButtonPressed}>
                Start Game
                </button>
              </div> : null}

          </div>
      </div>
    )
  }

  startGameButtonPressed(){
    // Change game state so other devices will start the game too

    this.props.changeGameState("write")

  }

  toggleModal(){
    this.setState({showModal:!this.state.showModal})
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
          <div className="modal-custom-header">Enter game link</div>
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
              <button className="btn-lg btn-outline-danger" onClick={this.closeModal}>Cancel</button>
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