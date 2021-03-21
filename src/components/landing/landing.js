import Helmet from 'react-helmet';
import React, { Component } from 'react';

class Landing extends Component {
  handleData(key) {
    key.preventDefault();
    const redirectUrl = '/data';
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 1000);
  }

  render() {
    return (
      <div className="landing-page">

        <Helmet>
          <style>{'body { background-color: #ffff;}'}</style>
        </Helmet>

        <div className="container">

          <div className="content-container">

            <h1>Frontend Challenge</h1>

            <button type="submit" onClick={(key) => { this.handleData(key); }}>Check Users Now</button>

          </div>

        </div>

      </div>

    );
  }
}

export default Landing;
