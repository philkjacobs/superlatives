import * as React from 'react';
import * as ReactDOM from 'react-dom';

export default class OnboardingModal extends React.Component {
  constructor(props){
    super(props)
  }

  render(){
    return(
          <div>
            <h2>This game has three stages.</h2>
            <br />
            <h3>Stage 1: Write</h3>
            <p>Write descriptive awards, e.g. “most likely to get a ticket for driving too slowly”, “best dancer”, etc.</p>
            <h3>Stage 2: Assign</h3>
            <p>You will be given a random list of awards. Assign them to the person that best fits the description. You can’t assign awards to yourself!</p>
            <h3>Stage 3: Read</h3>
            <p>After all awards have been assigned, go around the group reading the awards assigned to you, one at a time.</p>
          </div>
    )
  }
}