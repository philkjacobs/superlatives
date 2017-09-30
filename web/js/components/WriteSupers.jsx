import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Superlative from './Superlative.jsx'
import AssignSupers from './AssignSupers.jsx';
import Notifications, {notify} from 'react-notify-toast';
import Timer from './Timer.jsx';

var now = Date.now()

export default class WriteSupers extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      super: ""
    };

    this.handleChange = this.handleChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  handleChange(e){
    this.setState({
      super: e.target.value
    });
  }

  onSubmit(e){
    e.preventDefault();
    this.setState({super:""})
    this.props.submitSuper(this.state.super)
  }

  render(){
    return(
      <div>
        <Timer now={this.props.now}/>
        <form onSubmit={this.onSubmit}>
            <label>
              <input type="text" value={this.state.super} onChange={this.handleChange}/>
            </label>
            <input type="submit" value="Add Super"/>
          </form>
      </div>
    )
  }
}