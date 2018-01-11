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
    <ReactModal isOpen={this.props.isOpen}
                style={MODAL_STYLE}
                shouldCloseOnOverlayClick={true}
                onRequestClose={this.props.toggleModal.bind(this)}>
      <div className="modal-custom-header">
        <div className="description share-modal">Share this game code with your friends:</div>
        <div className="shareModalGameId">{this.props.gameId}</div>
        <div className="share-text">
        <i>OR</i>
        </div>
        <CopyToClipboard text={window.location.origin+"?game="+this.props.gameId} onCopy={this.onCopy}>
          <button className="custom-button modal">Copy game link</button>
        </CopyToClipboard>
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

  componentDidMount(){
    notify.show("You're in!", "success", this.props.TOAST_TIMEOUT)
  }

  render(){
    return(
      <div>
        <div>
          {this.props.isHost ? <ShareGameModal gameId={this.props.gameId}
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
                <button className="action-button top-button fixed-width" onClick={this.toggleModal}>
                Share Game
                </button>
                <button className="action-button bottom-button fixed-width" onClick={this.startGameButtonPressed}>
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
          <div className="description join">Enter game code</div>
            <form onSubmit={this.onSubmit}>
              <label style={{display:'block'}}>
                <input  type="text"
                        value={this.props.gameId}
                        onChange={this.props.onChange}
                        className="form-control joinModalGameId"
                        />
              </label>
              <input  type="submit"
                      value="Join"
                      className="custom-button join" />
              
              <button className="custom-button join" onClick={this.props.closeModal.bind(this)}>Cancel</button>
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