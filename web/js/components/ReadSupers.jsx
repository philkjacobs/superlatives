import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Superlative from './Superlative.jsx'
import Notifications, {notify} from 'react-notify-toast';

// Hard-coding supers for testing 
var supers = [
  {
  "name":"Most likely to die in a freak accident"
  },
  {
  "name":"Most loyal"
  },
  {
  "name":"Best hair"
  },
  {
  "name":"Most likely to become president"
  }
]

export default class ReadSupers extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      supersList:supers
    }

    this.nextButtonClicked = this.nextButtonClicked.bind(this)
    this.newGameButtonPressed = this.newGameButtonPressed.bind(this)

  }
  render() {
    return (
      <div>
        <Notifications />
        {this.state.supersList.length==0 ? <div>That's it! <button onClick={this.newGameButtonPressed}>Back to menu</button></div> : <Superlative name={this.state.supersList[0].name}/>}
        
        <button onClick={this.nextButtonClicked}>Next superlative</button>
      </div>
    )
  }

  // Load supers from server when the DOM is loaded
  componentDidMount(){
    this.setState({
      supersList:supers,
    })
  }

  nextButtonClicked(){
    
    // Save assignment to server
    // If there are supers left, go to next super; otherwise go to Done screen.
    this.setState({
      supersList:this.state.supersList.slice(1)      
    })
  }

  newGameButtonPressed(){
    this.props.changeStatus("none", "")
  }
}