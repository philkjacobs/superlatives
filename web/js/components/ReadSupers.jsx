import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Superlative from './Superlative.jsx'
import Notifications, {notify} from 'react-notify-toast';

// Hard-coding supers for testing 
var supers = [
  {
  "name":"Most likely to die in a freak accident",
  "created_by":"A",
  "assigned_by":"B",
  "receipient":"C"
  },
  {
  "name":"Most loyal",
  "created_by":"D",
  "assigned_by":"E",
  "receipient":"F"
  },
  {
  "name":"Best hair",
  "created_by":"D",
  "assigned_by":"E",
  "receipient":"F"
  },
  {
  "name":"Most likely to become president",
  "created_by":"D",
  "assigned_by":"E",
  "receipient":"F"
  }
]

export default class ReadSupers extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      currentSuper:"",
      supersList:[]
    }

    this.nextButtonClicked = this.nextButtonClicked.bind(this)

  }
  render() {
    return (
      <div>
        <Notifications />
        <Superlative name={this.state.currentSuper}/>
        <button onClick={this.nextButtonClicked}>Next superlative</button>
      </div>
    )
  }

  // Load supers from server when the DOM is loaded
  componentDidMount(){
    this.setState({
      supersList:supers,
      currentSuper:supers[0].name
    })
  }

  nextButtonClicked(){
    
    // Save assignment to server
    // If there are supers left, go to next super; otherwise go to Done screen.
    this.state.supersList.shift()

    if(this.state.supersList.length>0){
      this.state.currentSuper = this.state.supersList[0].name
      
    } else {
      this.props.onStatusChange(true,"That's it! Host a new game or join an existing one.");
    }

    this.setState(this.state)
  }
}