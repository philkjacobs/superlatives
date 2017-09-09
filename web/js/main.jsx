import * as React from 'react';
import * as ReactDOM from 'react-dom';

class Application extends React.Component {
  render() {
    return (
      <div>
        <h1>Welcome to Superlatives</h1>
        <button onClick={this.hostGameButtonPressed}>Host Game</button>
        <button onClick={this.joinGameButtonPressed}>Join Game</button>
      </div>
    )
  }

  hostGameButtonPressed(){
    console.log("Host button pressed");
  }

  joinGameButtonPressed(){
    console.log("Join game button pressed");
  }

}

ReactDOM.render(
  <Application />,
  document.getElementById('root')
);