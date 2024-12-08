import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { HueSaturationShader } from "three/examples/jsm/shaders/HueSaturationShader.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { Space } from "../core/Space";


export class Composer extends EffectComposer {
    space:Space;
    get sizer() {
        return this.space.sizer;
    }

    renderPass: RenderPass;
    shaderPass: ShaderPass;
    outLinePass: OutlinePass;
    outputPass: OutputPass
    
    constructor(space:Space) {
        super(space.renderer);

        this.space = space;

        this.renderPass = new RenderPass(this.space.scene, this.space.camera);
        this.addPass(this.renderPass);

        this.shaderPass = new ShaderPass(HueSaturationShader);
        this.shaderPass.uniforms["saturation"].value = 0.5;
        this.addPass(this.shaderPass);

        this.outLinePass = new OutlinePass(
            new THREE.Vector2(
                this.space.canvas.clientWidth,
                this.space.canvas.clientHeight
            ),
            this.space.scene,
            this.space.camera
        );
        this.setOutlineStyle();

        this.addPass(this.outLinePass);
        
        this.outputPass = new OutputPass();
        this.addPass(this.outputPass);
    }

    resize() {
        this.space.composer.setSize(this.sizer.width, this.sizer.height);
        this.space.composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.space.composer.render();
    }

    update(){
        this.render();
    }

    getOutlinePass(){
        return this.passes.includes(this.outLinePass);
    }

    setOutlineStyle(){
        this.outLinePass.edgeStrength = 3;
        this.outLinePass.edgeGlow = 0.9;
        this.outLinePass.edgeThickness = 3;
        this.outLinePass.pulsePeriod = 3;
        this.outLinePass.visibleEdgeColor.set('#ffffff'); 
        this.outLinePass.hiddenEdgeColor.set('#000000');
    }
}