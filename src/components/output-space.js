import React from 'react'

import AtmosphereRenderer from '../atoms-renderer'

export default class OutputSpace extends React.Component {
  constructor(props) {
    super(props);
   }

  //  初期描画が発生した直後に実行される
  componentDidMount() {
    this.AtmosphereRenderer = new AtmosphereRenderer();
  }

  render() {
    return (
      <div id="output_space">
      </div>
    );
  }
}