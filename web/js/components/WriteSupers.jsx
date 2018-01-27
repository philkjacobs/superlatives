import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ReactModal from 'react-modal';
import Superlative from './Superlative.jsx'
import AssignSupers from './AssignSupers.jsx';
import Notifications, {notify} from 'react-notify-toast';
import {MOVE_TO_ASSIGN_MODAL_STYLE} from './ModalStyle.jsx';
import Timer from './Timer.jsx';
import {TOAST_TIMEOUT} from '../main.jsx';

export default class WriteSupers extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      now:Date.now(),
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
    notify.show("The game has started!","success",TOAST_TIMEOUT)
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
      this.moveToAssign(e);
    } else {
      // Timer still running. Submit super to server.
      this.props.submitSuper(this.state.super)
      this.setState({super:""})
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
        <Timer now={this.state.now} didTimerRunOut={function(){this.stopTimer()}.bind(this)} />
        <form onSubmit={this.onSubmit} className="input-group-lg vt-center">

            <label style={{display:'block'}}>
              <input  type="text"
                      placeholder="Enter award here..."
                      value={this.state.super}
                      onChange={this.handleChange}
                      className="form-control"/>
            </label>
            <div className="input-subtitle">Select enter to submit ↵
            </div>
            {this.state.didTimerRunOut ? <input  type="submit"
                    placeholder="Continue"
                    value="Continue"
                    className="btn-lg btn-outline-secondary action-button bottom-button"
                    /> : <div><input  type="submit"
                    placeholder="Write award..."
                    value="Add Award"
                    className="btn-lg btn-outline-secondary action-button top-button"
                    />

                    {this.props.isHost ? <div><form onSubmit={this.showSubmitModal}>
                    <label>
                      <input  type="submit"
                              value="Stop timer"
                              className="action-button bottom-button fixed-width"/>
                    </label>
                    </form></div> : null}</div>
                  }    
          </form>
          
          
          {this.state.showSubmitModal ? <div className="moveToAssign">
          <ReactModal isOpen={true}
                      onRequestClose={this.closeModal}
                      style={MOVE_TO_ASSIGN_MODAL_STYLE}
                      shouldCloseOnOverlayClick={true}>
            <h2>Move everyone to the next stage?</h2>
              <div>
                <br />
                <button className="btn btn-primary btn-lg btn-block" onClick={this.moveToAssign}>Yes, continue to next stage</button>
                <button className="btn btn-danger btn-lg btn-block" onClick={this.closeModal}>No, stay in current stage</button>
              </div>
          </ReactModal></div> : null}
      </div>
    )
  }
}