import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

class Component extends React.Component {
  render() {
    return (
      <ListGroup>
        <ListGroupItem bsStyle="success">Hello</ListGroupItem>
        <ListGroupItem bsStyle="info">World</ListGroupItem>
        <ListGroupItem bsStyle="warning">Bootstrap</ListGroupItem>
        <ListGroupItem bsStyle="danger">React</ListGroupItem>
        <ListGroupItem bsStyle="success">Hello</ListGroupItem>
        <ListGroupItem bsStyle="info">World</ListGroupItem>
        <ListGroupItem bsStyle="warning">Bootstrap</ListGroupItem>
        <ListGroupItem bsStyle="danger">React</ListGroupItem>
        <ListGroupItem bsStyle="success">Hello</ListGroupItem>
        <ListGroupItem bsStyle="info">World</ListGroupItem>
        <ListGroupItem bsStyle="warning">Bootstrap</ListGroupItem>
        <ListGroupItem bsStyle="danger">React</ListGroupItem>
        <ListGroupItem bsStyle="success">Hello</ListGroupItem>
        <ListGroupItem bsStyle="info">World</ListGroupItem>
        <ListGroupItem bsStyle="warning">Bootstrap</ListGroupItem>
        <ListGroupItem bsStyle="danger">React</ListGroupItem>
        <ListGroupItem bsStyle="success">Hello</ListGroupItem>
        <ListGroupItem bsStyle="info">World</ListGroupItem>
        <ListGroupItem bsStyle="warning">Bootstrap</ListGroupItem>
        <ListGroupItem bsStyle="danger">React</ListGroupItem>
      </ListGroup>
    )
  }
}

ReactDOM.render(
  <Component />,
  document.getElementById('root')
);