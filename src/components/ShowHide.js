import React from 'react';

class ShowHide extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: props.defaultOpen || false,
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(({ show }) => ({ show: !show }));
  }

  render() {
    const { name, children } = this.props;
    const { show } = this.state;
    return (
      <div>
        <div style={{ margin: '10px 0' }}>
          <button onClick={this.toggle}>
            {`${show ? 'Hide' : 'Show'} ${name}`}
          </button>
        </div>
        <div>
          {show && children}
        </div>
      </div>
    );
  }
}

export default ShowHide;
