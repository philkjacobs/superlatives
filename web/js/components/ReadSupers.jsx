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
      position:0,
      showMenuOptions:false
    }

    this.nextButtonClicked = this.nextButtonClicked.bind(this)
    this.previousButtonClicked = this.previousButtonClicked.bind(this)
    this.newGameButtonPressed = this.newGameButtonPressed.bind(this)
    this.backToAwardsButtonPressed = this.backToAwardsButtonPressed.bind(this)
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
            {this.state.showMenuOptions ? 
            <div>
              <Loader statusText="That's it!" />
              <button   onClick={this.backToAwardsButtonPressed}
                        className="action-button top-button">
                Back to awards
              </button>
              <button   onClick={this.newGameButtonPressed}
                        className="action-button bottom-button">
                Go to menu
              </button>
              
            </div> : 
            <div>
              <div className="description">Here's what your friends assigned you:</div>
              <div className="superlative">{this.props.supers[this.state.position]}</div>
              <div className="subtitle read-count">{this.state.position+1}/{this.props.supers.length}</div>
              <div className="subtitle next-super">Wait for everyone to read one before going to the next.</div>
              <button   onClick={this.previousButtonClicked} 
                        className="action-button bottom-button">
                        Previous
              </button>
              <button   onClick={this.nextButtonClicked} 
                        className="action-button top-button">
                        Next
              </button>
            </div>}
          </div>
         : 
        <div>
          <Loader statusText="Loading awards that were assigned to you!" />
        </div>
      }
      </div>
    )
  }

  nextButtonClicked(){ 
    if(this.state.position==this.props.supers.length-1){
      this.setState({showMenuOptions:true})
    } else {
      this.setState({position:this.state.position + 1})
    }
  }

  previousButtonClicked(){
    if(this.state.position==0){
    } else {
      this.setState({position:this.state.position - 1})
    }
  }    

  newGameButtonPressed(){
    this.props.changeGameState("menu")
  }

  backToAwardsButtonPressed(){
    this.setState({showMenuOptions:false})
  }
}