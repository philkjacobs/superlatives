import * as React from 'react';
import * as ReactDOM from 'react-dom';

export default class FeedbackModal extends React.Component {
  constructor(props){
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  render(){
    return(
          <div>
          <div className="description join">Send us feedback</div>
            <form onSubmit={this.onSubmit}>
              <label style={{display:'block'}}>
                <input  type="text"
                        value={this.props.feedbackMessage}
                        onChange={this.props.onChange}
                        className="form-control"
                        />
              </label>
              <input  type="submit"
                      value="Send"
                      className="custom-button join" />
            </form>
          </div>
    )
  }

  onSubmit(e){
    e.preventDefault();
    this.props.onSubmit(this.props.feedbackMessage)
  }
}