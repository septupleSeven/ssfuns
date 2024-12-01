import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const canvasSize = {
    width: innerWidth,
    height: innerHeight
}

export function App() {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(
        canvasSize.width,
        canvasSize.height
    )
    
    const container = document.querySelector("#app");
    container?.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(
        75,
        canvasSize.width / canvasSize.height,
        0.1,
        100
    );
    camera.position.set(0, 0, 3);
    
    const scene = new THREE.Scene();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    
    const cretaeObject = () => {
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
        });
        const geometry = new THREE.PlaneGeometry(1, 1);
        
        const mesh = new THREE.Mesh(geometry, material);

        return mesh;
    }

    const create = () => {
        const plane = cretaeObject();
        
        scene.add(plane);

        return {
            plane
        }
    }

    const draw = () => {
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(() => draw());
    }

    const initialize = () => {
        create();
        draw();
    }
    initialize();
}