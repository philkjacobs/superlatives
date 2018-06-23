import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ReactModal from 'react-modal';
import {MODAL_STYLE} from './components/ModalStyle.jsx';
import {MOVE_TO_ASSIGN_MODAL_STYLE} from './components/ModalStyle.jsx';
import {ONBOARDING_MODAL_STYLE} from './components/ModalStyle.jsx';
import Loader from './components/Loader.jsx';
import * as Menu from './components/Menu.jsx';
import WriteSupers from './components/WriteSupers.jsx';
import AssignSupers from './components/AssignSupers.jsx';
import ReadSupers from './components/ReadSupers.jsx';
import FeedbackModal from './components/FeedbackModal.jsx';
import OnboardingModal from './components/OnboardingModal.jsx';
import Notifications, {notify} from 'react-notify-toast';
import {withCookies, Cookies, CookiesProvider} from 'react-cookie';
import * as QueryString from 'query-string';


export const TOAST_TIMEOUT = 3000;
const REFRESH_TIMER = 20000;


class Application extends React.Component {
  constructor(props){
    super(props);

    const params = QueryString.parse(location.search);
    this.state = {
      playerName:"",
      isHost:false,
      showJoinScreen:false,
      showOptionsModal:false,
      statusText:"",
      gameId: params.game !== undefined ? params.game : "",
      players:[],
      waitingOnPlayers:[],
      // This will either be "name", "menu", "room", "wait", "write", "assign", "read"
      gameState:"name",
      socket:null,
      supers:[],
      pingInterval: null,
      showOnboardingModal: false,
      showFeedbackModal: false,
      feedbackMessage:"",
      showSuperWrittenToast:false,
      reconnectionCount: 1,
    };

    this.hostGameButtonPressed = this.hostGameButtonPressed.bind(this);
    this.joinGameButtonPressed = this.joinGameButtonPressed.bind(this);
    this.optionsButtonPressed = this.optionsButtonPressed.bind(this);
    this.submitFeedbackButtonPressed = this.submitFeedbackButtonPressed.bind(this);
    this.showOnboardingButtonPressed = this.showOnboardingButtonPressed.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleIdChange = this.handleIdChange.bind(this);
    this.continueButtonPressed = this.continueButtonPressed.bind(this);
    this.changeGameState = this.changeGameState.bind(this);
    this.listenForServerMessages = this.listenForServerMessages.bind(this);
    this.closeJoinModal = this.closeJoinModal.bind(this);
    this.closeOptionsModal = this.closeOptionsModal.bind(this);
    this.closeFeedbackModal = this.closeFeedbackModal.bind(this);
    this.closeOnboardingModal = this.closeOnboardingModal.bind(this);
    this.sendFeedbackToServer = this.sendFeedbackToServer.bind(this);
    this.ping = this.ping.bind(this);
    this.showSuperWrittenToast = this.showSuperWrittenToast.bind(this);
    this.onNameSubmit = this.onNameSubmit.bind(this);
    this.socketOnClose = this.socketOnClose.bind(this);
    this.backToMainMenuButtonPressed = this.backToMainMenuButtonPressed.bind(this);
    this.createSocketUrl = this.createSocketUrl.bind(this);

  }

  render() {
    if(this.state.gameState!="name") var style = {display:'none'}

    return (
      <div>
        <Notifications />

        {this.state.gameState=="wait" ? <div><h1>Waiting on</h1>{this.state.waitingOnPlayers.map(function(player){
return(<div className="custom-button waitingroom">{player}</div>)
}.bind(this))}</div> : null}

        <div style={style} className="vt-center input-group-lg">
          <div className="start-text">Start by typing your name below</div>
            <form onSubmit={this.onNameSubmit}>
                <label style={{display:'block'}}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Ben"
                    value={this.state.playerName}
                    onChange={this.handleNameChange}
                    ref={(input) => {this.nameInput = input}}/>
                </label>
              </form>

          <button
            onClick={this.continueButtonPressed}
            className="custom-button">Continue
          </button>

        </div>

        {this.state.showSuperWrittenToast ? <div className="added-toast">Added! Keep writing...</div> : null}

        {this.state.gameState=="menu" ? <Menu.MenuScreen
          playerName={this.state.playerName} 
          hostGameButtonPressed={this.hostGameButtonPressed}
          joinGameButtonPressed={this.joinGameButtonPressed}/> : null}

        {this.state.showJoinScreen ? <div><ReactModal isOpen={true}
                                                      onRequestClose={this.closeJoinModal}
                                                      style={MOVE_TO_ASSIGN_MODAL_STYLE}
                                                      shouldCloseOnOverlayClick={true}><Menu.JoinGame
          gameId={this.state.gameId}
          onChange={function(e){this.handleIdChange(e)}.bind(this)}
          onSubmit={function(data){this.login('join')}.bind(this)}
          closeModal={this.closeJoinModal}/>
                      </ReactModal></div> : null}



        {this.state.gameState !== 'read' && this.state.gameState !== 'menu' && this.state.socket !== null && this.state.socket.readyState !== WebSocket.OPEN ? <div><ReactModal isOpen={true}
                                                      style={MOVE_TO_ASSIGN_MODAL_STYLE}>
                                                      <h2>Connection lost.</h2>
                                                      <p>It looks like you were disconnected from the game. Wait for the next game to rejoin.</p>
                                                      <button className="btn btn-danger btn-lg btn-block" onClick={this.backToMainMenuButtonPressed}>Return to main menu</button>
                      </ReactModal></div> : null}

        {this.state.showOptionsModal ? <div><ReactModal isOpen={true}
                                                      onRequestClose={this.closeOptionsModal}
                                                      style={MOVE_TO_ASSIGN_MODAL_STYLE}
                                                      shouldCloseOnOverlayClick={true}>
                                                      <button className="custom-button modal"
                                                              onClick={this.submitFeedbackButtonPressed}>Submit feedback</button>
                                                      <button className="custom-button modal"
                                                              onClick={this.showOnboardingButtonPressed}>Learn the game</button>
                      </ReactModal></div> : null}

        {this.state.showOnboardingModal ? <div><ReactModal isOpen={true}
                                                      onRequestClose={this.closeOnboardingModal}
                                                      style={ONBOARDING_MODAL_STYLE}
                                                      shouldCloseOnOverlayClick={true}>
                                                      <div onClick={this.closeOnboardingModal}><OnboardingModal/></div>                       
                      </ReactModal></div> : null}

        {this.state.showFeedbackModal ? <div><ReactModal isOpen={true}
                                                      onRequestClose={this.closeFeedbackModal}
                                                      style={MOVE_TO_ASSIGN_MODAL_STYLE}
                                                      shouldCloseOnOverlayClick={true}>
                                                      <FeedbackModal
          feedbackMessage={this.state.feedbackMessage}
          onChange={function(e){this.handleFeedbackTextChange(e)}.bind(this)}
          onSubmit={function(data){this.sendFeedbackToServer(data)}.bind(this)} />
                                                      
                      </ReactModal></div> : null}

        {this.state.gameState=="room" ? <Menu.WaitingRoom
          players={this.state.players}
          isHost={this.state.isHost}
          gameId={this.state.gameId}
          changeStatus={function(state, statusText){this.changeStatus(state,statusText)}.bind(this)}
          gameState={this.state.gameState}
          changeGameState={function(state){this.changeGameState(state)}.bind(this)}
          TOAST_TIMEOUT={TOAST_TIMEOUT}/> : null}

        {this.state.gameState=="write" ? <WriteSupers
          isHost={this.state.isHost}
          players={this.state.players}
          submitSuper={function(data){this.writeSuper(data)}.bind(this)}
          changeGameState={function(state){this.changeGameState(state)}.bind(this)}
          gameState={this.state.gameState}
          now={Date.now()}/> : null }

        {this.state.gameState=="assign" ? <AssignSupers
          players={this.removePlayerNameFromPlayerList()}
          supers={this.state.supers}
          changeGameState={function(state){this.changeGameState(state)}.bind(this)}
          assignSuper={function(player, superText){this.assignSuper(player,superText)}.bind(this)} /> : null }

        {this.state.gameState=="read" ? <ReadSupers
          supers={this.state.supers}
          changeGameState={function(state){this.changeGameState(state)}.bind(this)} /> : null}

          
          
            <div className="help-box" onClick={this.optionsButtonPressed}>?</div>

          
      </div>
    )
  }

  componentDidMount(){
    this.setState({pingInterval: setInterval(this.ping, REFRESH_TIMER)});
    this.nameInput.focus();
  }

  componentWillUnmount() {
    this.stopPing()
  }

  handleNameChange(e){
    this.setState({
      playerName: e.target.value
    });
  }

  handleIdChange(e){
    this.setState({
      gameId: e.target.value
    });
  }

  handleFeedbackTextChange(e){
    this.setState({
      feedbackMessage:e.target.value
    });
  }

  onNameSubmit(e){     
    e.preventDefault();       
    document.activeElement.blur();               
    this.continueButtonPressed();     
  }

  backToMainMenuButtonPressed(){
    this.changeGameState("menu")
  }

  continueButtonPressed(){
    // Check for no name
    if(this.state.playerName==""){
      notify.show("Please enter a name.","error",TOAST_TIMEOUT)
    // Check for long name
    } else if(this.state.playerName.length>22){
      notify.show("Please enter a shorter name.","error",TOAST_TIMEOUT)
    } else {
      if(this.state.gameId==""){
        this.setState({
          gameState:"menu"
        })
      } else {
      this.login('join')
      }
    }
  }

  hostGameButtonPressed(){
    this.login('host')
    this.setState({
      isHost: true,
      showJoinScreen: false
    });
  }

  joinGameButtonPressed(){
    this.setState({
      isHost: false,
      showJoinScreen: true
    });
  }

  optionsButtonPressed(){
    this.setState({
      showOptionsModal:true
    });
  }

  submitFeedbackButtonPressed(){
    this.setState({
      showOptionsModal: false,
      showFeedbackModal:true
    })
  }

  changeStatus(status, statusText){
    this.setState({
      statusText:statusText,
      gameState:status
    });

    if(this.state.statusText=="menu"){
      this.setState({
        showHostScreen: false,
        showJoinScreen: false
      });
    }
  }

  closeJoinModal(){
    this.setState({showJoinScreen:false})
  }

  closeOptionsModal(){
    this.setState({showOptionsModal:false})
  }

  closeFeedbackModal(){
    this.setState({
      showFeedbackModal:false,
      feedbackMessage:""
    });
  }

  closeOnboardingModal(){
    this.setState({
      showOnboardingModal: false,
      showOptionsModal: false
    })
  }

  showOnboardingButtonPressed(){
    this.setState({showOnboardingModal:true})
  }

  login(type){
    const webSocket = new WebSocket(this.createSocketUrl(type));

    this.setState((prevState) => {
      return {
        socket: webSocket,
        reconnectionCount: prevState.reconnectionCount+1 ? type === 'reconnect' : prevState.reconnectionCount
      }
    }, () => {
      this.listenForServerMessages();
    })
  }

  createSocketUrl(type) {
    const socketType = IS_PROD ? 'wss' : 'ws';
    switch(type) {
      case 'host':
        return `${socketType}://${location.host}/ws?name=${this.state.playerName}`;
      case 'join':
        return `${socketType}://${location.host}/ws?name=${this.state.playerName}&game=${this.state.gameId}`;
      case 'reconnect':
        return `${socketType}://${location.host}/ws?name=${this.state.playerName}&game=${this.state.gameId}&reconnect=${this.props.cookies.get('reconnection')}`;
      default:
        throw 'everybody knows shit fuck'
    }
  };

  changeGameState(state){
    // Send message to server with new game state

    // If new state is assign, change gameState to "wait" until the server returns the assign_supers_list message. If new state is read, change gameState to "wait" until the server returns the read_supers_list message. 

    var message;

    if(state === "read" || state === "assign"){
      this.setState({
        gameState:"wait"
      })
    } else {
      this.setState({
        gameState:state
      })
    }

    if(state === "assign"){
      message = {"msg":"change_state", "data":{"state":state, "force":1}, "error":""}
      this.state.socket.send(JSON.stringify(message))
    } else {
      message = {"msg":"change_state", "data":{"state":state}, "error":""}
      this.state.socket.send(JSON.stringify(message))
    }
  }

  ping(){
    this.state.socket.send(JSON.stringify({"msg":"ping","data":null,"error":null}))
  }

  stopPing() {
    this.state.pingInterval && clearInterval(this.state.pingInterval);
  }

  writeSuper(data){
    // Write super to server
    const message = {"msg":"write_supers","data":{"super":data}, "error":""}
    this.state.socket.send(JSON.stringify(message))

    this.showSuperWrittenToast()
  }

  assignSuper(player,superText){
    // Assign super to server  
    const message = {"msg":"assign_super","data":{"name":player, "super":superText}, "error":""}
    this.state.socket.send(JSON.stringify(message))
  }

   removePlayerNameFromPlayerList(){
    const {
      players,
      playerName,
    } = this.state;
    return players.filter((p) => {
      return p !== playerName
    })
  }

  showSuperWrittenToast(){
    this.setState({showSuperWrittenToast:true})

    setTimeout(function() { this.setState({showSuperWrittenToast: false}); }.bind(this), 1000);
  }

  listenForServerMessages(){
    this.state.socket.onopen = function(){this.setState({ reconnectionCount: 1 })}.bind(this);

    this.state.socket.onclose = this.socketOnClose;

    this.state.socket.onmessage = function(event){
      const response = JSON.parse(event.data);

      if(response.error){
        notify.show(response.error,"error",TOAST_TIMEOUT)
      }

      if(response.msg === 'login'){
        // Assuming success, go to the waiting room or update player list if already in waiting room
        this.setState({
          gameId:response.data.game,
          players:response.data.players,
          gameState:"room",
          showJoinScreen:false,
        })
      }

      if(response.msg === "change_state"){
        const state = response.data.state.toLowerCase();

        if(state === "read" || state === "assign"){
          this.setState({
            gameState:"wait"
          })
        } else {
          this.setState({
            gameState:state
          })
        }
      }

      // If we're in the assign stage, check if the server has returned a list of supers
      if(response.msg === "assign_supers_list"){
        this.setState({
          gameState: "assign",
          supers:response.data.supers
        })
      }

      // If we're in the read stage, check if the server has returned a list of supers
      if(response.msg === "read_supers_list"){
        this.setState({
          gameState: "read",
          supers:response.data.supers
        })
        this.state.socket.close();
      }

      // If a super is assigned to the user, console log
      if(response.msg === "assign_super"){
        notify.show("Someone assigned you an award!","success",TOAST_TIMEOUT)
      }

      if(response.msg === "waiting_on"){
        this.setState({
          waitingOnPlayers:response.data.players
        })
      }

      if(response.msg === "reconnection") {
        const FOUR_HOURS_IN_SECONDS = 4 * 60 * 60;
        this.props.cookies.set('reconnection', response.data.hmac, '/', {
          maxAge: FOUR_HOURS_IN_SECONDS,
        })
      }
    }.bind(this)
  }

  socketOnClose(){
    this.stopPing();
    switch(this.state.gameState){
      case "read":
        this.props.cookies.remove('reconnection');
        this.setState({gameId:""});
        break;
      default:
        this.setState((prevState) => {return {reconnectionCount:prevState.reconnectionCount+1}}, () => {
          if(this.state.reconnectionCount < 6) {
            setTimeout(() => this.login('reconnect'), 1000 * this.state.reconnectionCount ** 2)
          }
        })

    }
  }

  sendFeedbackToServer(message){
    var url = "https://super-latives.herokuapp.com/feedback";
    var params = "feedback="+message;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

    xhr.onreadystatechange = function () {
      if(xhr.readyState === 4) {
        notify.show("Feedback submitted, thank you!","success",TOAST_TIMEOUT)
      } else {
        notify.show("Error sending feedback.","error",TOAST_TIMEOUT)
      }
    };

    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(params);
    this.setState({feedbackMessage:""})
  }
}

const ApplicationWithCookies = withCookies(Application);

function Root(){
  return (
    <CookiesProvider>
      <ApplicationWithCookies />
    </CookiesProvider>
  );
}

ReactDOM.render(
  <Root/>,
  document.getElementById('root')
);