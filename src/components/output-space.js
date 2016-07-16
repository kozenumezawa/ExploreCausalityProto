import React from 'react'
import THREE from 'three'
const OrbitControls = require('three-orbit-controls')(THREE);

var readstream = require('rps-netcdf/fs/readstream');
var readrandom = require('rps-netcdf/fs/readrandom');
var netcdf = require('rps-netcdf');

export default class OutputSpace extends React.Component {
  constructor(props) {
    super(props);

    this.threeRender = this.threeRender.bind(this);

    var file = '../../NetCDF/MSM2016070900P.nc';
    var headerbuffer = readstream(file);

    // Read the header of a NetCDF file
    netcdf.readheader(headerbuffer, function(header) {
      console.log(JSON.stringify(header, null, 2));

      var randombuffer = readrandom(file);

      // Read a variable
      netcdf.readvariable(header, randombuffer, 'lat', function(err, data) {
        if (err != null) {
          return console.error(err);
        }
        console.log(data);
      });

      // Read records
      netcdf.readrecords(header, randombuffer, function(err, data) {
        if (err != null) {
          return console.error(err);
        }
        console.log(data);
      });
    });

   }

  //  初期描画が発生した直後に実行される
  componentDidMount() {
    const width = 500;
    const height = 500;

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer();
    const pixel_ratio = (window.devicePixelRatio) ? window.devicePixelRatio : 1;
    this.renderer.setPixelRatio(pixel_ratio);
    this.renderer.setSize(width, height);

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000 );
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    document.getElementById('output_space').appendChild(this.renderer.domElement);

    const geometry = new THREE.CubeGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);
    this.camera.position.z = 5;

    this.threeRender();
  }

  threeRender() {
    requestAnimationFrame(this.threeRender);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return (
      <div id="output_space">
      </div>
    );
  }
}