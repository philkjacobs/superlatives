import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Superlative from './Superlative.jsx'
import Notifications, {notify} from 'react-notify-toast';

export default class ReadSupers extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      showReadScreen:false,
    }

    this.nextButtonClicked = this.nextButtonClicked.bind(this)
    this.newGameButtonPressed = this.newGameButtonPressed.bind(this)
  }

  componentDidMount(){
    setTimeout(function() { this.setState({showReadScreen: true}); }.bind(this), 5000);
  }

  render() {

    return (
      <div>

      {this.state.showReadScreen ?
          <div>
            <Notifications />
            <p><b>Here are the superlatives that were assigned to you:</b></p>
          
            {this.props.supers.length==0 ? 
            <div>That's it! <br/>
              <button   onClick={this.newGameButtonPressed}
                        className="btn-lg btn-outline-secondary">
                  Back to menu
              </button>
            </div> : 
            <div>
              <Superlative name={this.props.supers[0]}/>
              <button   onClick={this.nextButtonClicked} 
                        className="btn-lg btn-outline-secondary">
                        Next superlative
              </button>
            </div>}
          </div>
         : 
        <div><p><b>Loading the supers that we're assigned to you!</b></p></div>
      }
      </div>
    )
  }

  nextButtonClicked(){ 
    this.props.supers.shift()
    this.forceUpdate()
  }

  newGameButtonPressed(){
    this.props.changeGameState("menu")
  }
}