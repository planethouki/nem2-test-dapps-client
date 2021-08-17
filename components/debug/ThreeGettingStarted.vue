<template>
  <div class="mb-5">
    <h1>Three.js</h1>
    <div ref="a"></div>
  </div>
</template>

<script>
import {
  Line,
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  LineBasicMaterial,
  Vector3,
  BufferGeometry,
  AmbientLight, DirectionalLight, MeshStandardMaterial, BoxGeometry, Mesh
} from 'three'

export default {
  name: "ThreeGettingStarted",
  mounted() {
    this.$refs.a.innerHTML = ""

    const renderer = new WebGLRenderer();
    renderer.setSize( window.innerWidth / 2, window.innerHeight / 2 );
    this.$refs.a.appendChild( renderer.domElement );

    const camera = new PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
    camera.position.set( 0, 50, -100 );
    camera.lookAt( 0, 0, 0 );

    const scene = new Scene();

    (() => {
      const material = new LineBasicMaterial( { color: 0x0000ff } );
      const points = [];
      points.push( new Vector3( - 10, 0, 0 ) );
      points.push( new Vector3( 0, 10, 0 ) );
      points.push( new Vector3( 10, 0, 0 ) );

      const geometry = new BufferGeometry().setFromPoints( points );
      const line = new Line( geometry, material );
      scene.add( line );
    })();

    let box;
    (() => {
      const geometry = new BoxGeometry(10, 10, 10);
      const material = new MeshStandardMaterial({
        color: 0x0000ff
      });
      box = new Mesh(geometry, material);
      box.position.set(20, 0, 0);
      scene.add(box);
    })();

    const directionalLight = new DirectionalLight( 0xffffff, 2);
    directionalLight.lookAt(0, -100, 100);
    scene.add( directionalLight );

    renderer.render( scene, camera );

    function tick() {
      requestAnimationFrame(tick);

      box.rotation.x += 0.01;
      box.rotation.y += 0.01;

      renderer.render(scene, camera);
    }
    tick();

  }
}
</script>

<style scoped>

</style>
