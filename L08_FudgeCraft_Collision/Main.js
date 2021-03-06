"use strict";
///<reference types="../Fudge/FudgeCore.js"/> 
var L08_FudgeCraft_Collision;
///<reference types="../Fudge/FudgeCore.js"/> 
(function (L08_FudgeCraft_Collision) {
    var f = FudgeCore;
    document.addEventListener("DOMContentLoaded", handleLoad);
    let fragment;
    let currentFragment;
    // ############################################################################################
    // ############################################################################################
    function handleLoad(_event) {
        // grid.set("Jonas", new Cube(new f.Vector3(3, 3, 0), new f.Material("Cyan", f.ShaderFlat, new f.CoatColored(f.Color.CYAN))));
        // console.log(grid);
        console.log("Hello World");
        const canvas = document.querySelector("canvas");
        f.RenderManager.initialize(true); //true um Antialiasing zu vermeiden
        //Camera
        let camera = new f.Node("Camera");
        let cmpCam = new f.ComponentCamera();
        camera.addComponent(cmpCam);
        cmpCam.pivot.translate(new f.Vector3(0, 6, 30)); // kamera auf ort setzen
        cmpCam.backgroundColor = f.Color.CSS("DARK_GREY");
        // cmpCam.pivot.lookAt(f.Vector3.ZERO()); // um auf 0|0|0 zu schauen
        //create Game Node
        L08_FudgeCraft_Collision.game = new f.Node("Game");
        L08_FudgeCraft_Collision.grid = new L08_FudgeCraft_Collision.Grid();
        createStart();
        //Light
        let cmpLight = new f.ComponentLight(new f.LightDirectional(f.Color.CSS("WHITE")));
        cmpLight.pivot.lookAt(new f.Vector3(0.5, 0, 0.5));
        L08_FudgeCraft_Collision.game.addComponent(cmpLight);
        let cmpLightAmbient = new f.ComponentLight(new f.LightAmbient(f.Color.CSS("GREY")));
        L08_FudgeCraft_Collision.game.addComponent(cmpLightAmbient);
        //Viewport
        L08_FudgeCraft_Collision.viewport = new f.Viewport();
        L08_FudgeCraft_Collision.viewport.initialize("Viewport", L08_FudgeCraft_Collision.game, camera.getComponent(f.ComponentCamera), canvas);
        L08_FudgeCraft_Collision.viewport.draw();
        // console.log("currentFragment after viewport.draw(): " + currentFragment.getCubesPositions()); //erst hier ist die position im raum richtig erfasst
        window.addEventListener("keydown", handleKeyDown);
        console.log("Setup done");
    } //close handleLoad
    function createStart() {
        let rndFragNum = Math.floor(Math.random() * 7);
        fragment = new L08_FudgeCraft_Collision.Fragment(rndFragNum);
        currentFragment = fragment;
        L08_FudgeCraft_Collision.game.appendChild(currentFragment);
        for (let cube of currentFragment.cubes) {
            console.log("set cube at pos: " + cube.transformComp.local.translation);
            let position = cube.transformComp.local.translation;
            cube.cmpTransform.local.translation = position;
            L08_FudgeCraft_Collision.grid.push(position, new L08_FudgeCraft_Collision.GridElement(cube));
        }
        rndFragNum = Math.floor(Math.random() * fragment.fragmentDef.length);
        fragment = new L08_FudgeCraft_Collision.Fragment(rndFragNum);
        fragment.addComponent(new f.ComponentTransform(f.Matrix4x4.TRANSLATION(new f.Vector3(0, 7, 0))));
        currentFragment = fragment;
        L08_FudgeCraft_Collision.game.appendChild(fragment);
        return L08_FudgeCraft_Collision.game;
    } //close createGame
    // ############################################################################################
    // ############################################################################################
    function handleKeyDown(_event) {
        processInput(_event, 1);
        if (checkIfHit()) {
            processInput(_event, -1); //die bewegung rückgängig machen
            // f.RenderManager.update();
            fragment.setAtPosition();
            createNewFragment(); //neues Fragment erstellen und zum currentFrag machen
        }
    } //close handleKeyDown
    function checkIfHit() {
        for (let cube of currentFragment.getChildren()) {
            let element = L08_FudgeCraft_Collision.grid.pull(cube.mtxWorld.translation);
            if (element) {
                return true;
            }
        }
        return false;
    } //close checkIfHit
    function createNewFragment() {
        let rndFragNum = Math.floor(Math.random() * fragment.fragmentDef.length);
        fragment = new L08_FudgeCraft_Collision.Fragment(rndFragNum);
        fragment.addComponent(new f.ComponentTransform);
        fragment.cmpTransform.local.translate(new f.Vector3(0, 7, 0));
        currentFragment = fragment;
        L08_FudgeCraft_Collision.game.appendChild(fragment);
        f.RenderManager.update();
        L08_FudgeCraft_Collision.viewport.draw();
    } //close createNewFragment
    function processInput(_event, _moveOn) {
        //bewegung
        switch (_event.code) {
            case f.KEYBOARD_CODE.W: //W später raus nehmen
                currentFragment.cmpTransform.local.translateY(_moveOn * 1);
                break;
            case f.KEYBOARD_CODE.A:
                currentFragment.cmpTransform.local.translateX(_moveOn * -1);
                break;
            case f.KEYBOARD_CODE.D:
                currentFragment.cmpTransform.local.translateX(_moveOn * 1);
                break;
            case f.KEYBOARD_CODE.S:
                currentFragment.cmpTransform.local.translateY(_moveOn * -1);
                break;
        }
        //Rotation
        switch (_event.code) {
            case f.KEYBOARD_CODE.Q:
                currentFragment.cmpTransform.local.rotateZ(_moveOn * 90);
                break;
            case f.KEYBOARD_CODE.E:
                currentFragment.cmpTransform.local.rotateZ(_moveOn * -90);
                break;
        }
        f.RenderManager.update();
        L08_FudgeCraft_Collision.viewport.draw();
    } //close process Input
})(L08_FudgeCraft_Collision || (L08_FudgeCraft_Collision = {})); //close Namespace
//# sourceMappingURL=Main.js.map