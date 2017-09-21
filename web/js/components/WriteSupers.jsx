import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Superlative from './Superlative.jsx'
import Notifications, {notify} from 'react-notify-toast';
import Timer from './Timer.jsx';

export default class WriteSupers extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      super: ""
    };

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(e){
    this.setState({
      super: e.target.value
    });
  }

  render(){
    return(
      <div>
        <Timer />
        <form onSubmit={this.onSubmit.bind(this)}>
            <label>
              <input type="text" value={this.state.super} onChange={this.handleChange}/>
            </label>
            <input type="submit" value="Add Super"/>
          </form>
      </div>
    )
  }

  onSubmit(e){
    e.preventDefault();
    this.setState({super:""})
    console.log("Add " + this.state.super + " to super list.")

      // Send super to super entity for gameID
  }
}