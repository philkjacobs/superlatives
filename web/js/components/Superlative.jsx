import * as React from 'react';
import * as ReactDOM from 'react-dom';

const Superlative = (props) => {
    return(
    <div>
      <h1>{props.name}</h1>
    </div>
  )
};

Superlative.propTypes = {
  name: React.PropTypes.string.isRequired
}

export default Superlative;