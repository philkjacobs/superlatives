import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Notifications, {notify} from 'react-notify-toast';

class HostGame extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      gameId: props.gameId
    }
  }

  render(){
    return(
      <div>
        <h3>Heres your special game code. Share this with your friends </h3>
        {this.state.gameId}
      </div>
    )
  }

  fetchGameID(){
    // Magic code to fetch game ID
  }
}

HostGame.propTypes = {
  gameId: React.PropTypes.string.isRequired
};

HostGame.defaultProps = {
  gameId: "TEST GAME"
}

class JoinGame extends React.Component {
  render(){
    return(
      <div>
        <h3>Enter magic code to join game:</h3>
        <form onSubmit={this.onSubmit}>
            <label>
              <input type="text" />
            </label>
            <input type="submit" value="Join Game" />
          </form>
      </div>
    )
  }

  onSubmit(e){
    e.preventDefault();
    notify.show('Not yet built!', "error", 2000)
  }
}

class Application extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      showHostScreen: false,
      showJoinScreen: false
    }

    this.hostGameButtonPressed = this.hostGameButtonPressed.bind(this);
    this.joinGameButtonPressed = this.joinGameButtonPressed.bind(this);
  }
  render() {
    return (
      <div>
        <Notifications />
        <h1>Welcome to Superlatives</h1>
        <button onClick={this.hostGameButtonPressed} className="btn-rounded btn-outlined orange-btn">Host Game</button>
        <button onClick={this.joinGameButtonPressed} className="btn-rounded btn-outlined green-btn">Join Game</button>
        {this.state.showHostScreen ? <HostGame /> : null}
        {this.state.showJoinScreen ? <JoinGame /> : null}
      </div>
    )
  }

  hostGameButtonPressed(){
    console.log("Host button pressed");
    
    this.setState({
      showHostScreen: true,
      showJoinScreen: false
    });

  }

  joinGameButtonPressed(){
    console.log("Join game button pressed");

    this.setState({
      showJoinScreen: true,
      showHostScreen: false
    });
  }

  goToWaitingRoom(){
    notify.show('Not yet built!');
  }

}

ReactDOM.render(
  <Application />,
  document.getElementById('root')
);