import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ReactModal from 'react-modal';
import Superlative from './Superlative.jsx'
import AssignSupers from './AssignSupers.jsx';
import Notifications, {notify} from 'react-notify-toast';
import Timer from './Timer.jsx';

var now = Date.now()

export default class WriteSupers extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      super: "",
      showSubmitModal:false
    };

    this.handleChange = this.handleChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.moveToAssign = this.moveToAssign.bind(this)
    this.showSubmitModal = this.showSubmitModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
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

  showSubmitModal(e){
    e.preventDefault();
    this.setState({
      showSubmitModal:true
    })
  }

  closeModal(){
    this.setState({
      showSubmitModal:false
    })
  }

  render(){
    return(
      <div>
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
          <form onSubmit={this.showSubmitModal}>
            <label>
              <input  type="submit"
                      value="Continue to next stage"
                      className="btn btn-warning"/>
            </label>
          </form>
          {this.state.showSubmitModal ? <div><ReactModal isOpen={true} onRequestClose={this.closeModal}>
            <h2>Continuing to the next stage will give everyone fifteen more seconds and then automatically move them to the next round.</h2>
              <div>
                <br />
                <button className="btn btn-primary btn-lg btn-block" onClick={this.moveToAssign}>Continue to next stage</button>
                <button className="btn btn-danger btn-lg btn-block" onClick={this.closeModal}>Stay in current stage</button>
              </div>
          </ReactModal></div> : null}
      </div>
    )
  }
}