import * as React from 'react';
import * as ReactDOM from 'react-dom';

const Loader = (props) => {
    return(
    <div className="vt-center">
      <h1>{props.statusText}</h1>
    </div>
  )
};

export default Loader;