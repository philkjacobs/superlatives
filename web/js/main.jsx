import * as React from 'react';
import * as ReactDOM from 'react-dom';

class Component extends React.Component {
  render() {
    return (
      <div>
        <h1>Welcome to Superlatives</h1>
        <button onClick={this.hostGameButtonPresed}>Host Game</button>
        <button onClick={this.joinGameButtonPresed}>Join Game</button>
      </div>
    )
  }
}

ReactDOM.render(
  <Component />,
  document.getElementById('root')
);