import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Loader from './Loader.jsx';
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
            {this.props.supers.length==0 ? 
            <div>
              <Loader statusText="That's it!" />
              <button   onClick={this.newGameButtonPressed}
                        className="btn-lg action-button">
                Go to menu
              </button>
            </div> : 
            <div>
              <div className="description">Here's what your friends assigned you</div>
              <Superlative name={this.props.supers[0]} className="vt-center player"/>
              <div className="subtitle next-super">Wait for everyone to read one before going to the next.</div>
              <button   onClick={this.nextButtonClicked} 
                        className="btn-lg action-button">
                        Next
              </button>
            </div>}
          </div>
         : 
        <div>
          <Loader statusText="Loading supers that were assigned to you!" />
        </div>
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