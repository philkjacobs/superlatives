import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ReactModal from 'react-modal';
import Superlative from './Superlative.jsx'
import AssignSupers from './AssignSupers.jsx';
import Notifications, {notify} from 'react-notify-toast';
import Timer from './Timer.jsx';

var now;

export default class WriteSupers extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      super: "",
      showSubmitModal:false,
      didTimerRunOut:false
    };

    this.handleChange = this.handleChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.moveToAssign = this.moveToAssign.bind(this)
    this.showSubmitModal = this.showSubmitModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.stopTimer = this.stopTimer.bind(this)
  }

  componentDidMount(){
    now = Date.now();
  }

  handleChange(e){
    this.setState({
      super: e.target.value
    });
  }

  onSubmit(e){
    e.preventDefault();

    if(this.state.didTimerRunOut==true){
      // Timer run out. Move to next stage.
      this.showSubmitModal(e);
    } else {
      // Timer still running. Submit super to server.
      this.setState({super:""})
      this.props.submitSuper(this.state.super)
    }
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

  stopTimer(){
    this.setState({
      didTimerRunOut: true
    })
  }

  render(){

    return(
      <div>
        <Timer now={now} didTimerRunOut={function(){this.stopTimer()}.bind(this)} />
        <form onSubmit={this.onSubmit} className="input-group-lg vt-center">

            <label style={{display:'block'}}>
              <input  type="text"
                      value={this.state.super}
                      onChange={this.handleChange}
                      className="form-control"/>
            </label>
            {this.state.didTimerRunOut ? <input  type="submit"
                    placeholder="Continue"
                    value="Continue"
                    className="btn-lg btn-outline-secondary action-button"
                    /> : <div><input  type="submit"
                    placeholder="Write super..."
                    value="Add Super"
                    className="btn-lg btn-outline-secondary action-button second-button"
                    />

                    {this.props.isHost ? <div><form onSubmit={this.showSubmitModal}>
                    <label>
                      <input  type="submit"
                              value="Stop timer and continue"
                              className="btn btn-warning action-button"/>
                    </label>
                    </form></div> : null}</div>
                  }    
          </form>
          
          
          {this.state.showSubmitModal ? <div><ReactModal isOpen={true} onRequestClose={this.closeModal}>
            <h2>Continuing to the next stage will automatically move everyone to the next round.</h2>
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