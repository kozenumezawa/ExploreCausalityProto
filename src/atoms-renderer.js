import THREE from 'three'
const OrbitControls = require('three-orbit-controls')(THREE);

import vdap from 'vdap'

export default class AtmosphereRenderer {
  constructor(){
    const width = 500;
    const height = 500;

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer();
    const pixel_ratio = (window.devicePixelRatio) ? window.devicePixelRatio : 1;
    this.renderer.setPixelRatio(pixel_ratio);
    this.renderer.setSize(width, height);

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    document.getElementById('output_space').appendChild(this.renderer.domElement);

    const geometry = new THREE.CubeGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);
    this.camera.position.z = 5;

    vdap.loadData('http://localhost:8080/thredds/dodsC/hoge/MSM2016070921P.nc.dods?lon,lat,time,temp')
      .then((data) => {
        console.log(data);
        this.lon = data[0];
        this.lat = data[1];
        this.time = data[2];
        this.temp = data[3];
      })
      .then(() => {
        vdap.loadData('http://localhost:8080/thredds/dodsC/hoge/MSM2016070921P.nc.dods?rh')
          .then((data) => {
            this.rh = data[0];
            console.log(this.temp);
            console.log(this.rh);

          })
      });


    this.threeRender();
  }

  threeRender() {
    requestAnimationFrame(this.threeRender.bind(this));
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}