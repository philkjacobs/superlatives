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
    this.moveToAssign = this.moveToAssign.bind(this)
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

  moveToAssign(e){
    e.preventDefault();
    this.props.changeGameState("assign")
  }

  render(){
    return(
      <div>
        <Timer now={this.props.now}/>
        <form onSubmit={this.onSubmit} className="input-group-lg vt-center">

            <label style={{display:'block'}}>
              <input  type="text"
                      value={this.state.super}
                      onChange={this.handleChange}
                      className="form-control"/>
            </label>
            <input  type="submit"
                    placeholder="Write super..."
                    value="Add Super"
                    className="btn-lg btn-outline-secondary action-button"/>
          </form>
          <form onSubmit={this.moveToAssign}>
            <label>
              <input  type="submit"
                      value="TESTING: Move to Assign stage"
                      className="btn btn-warning"/>
            </label>
          </form>
      </div>
    )
  }
}