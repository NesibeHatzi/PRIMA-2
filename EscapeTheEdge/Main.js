"use strict";
///<reference types="../EscapeTheEdge/FUDGE/FudgeCore.js"/>
var EscapeTheEdge;
///<reference types="../EscapeTheEdge/FUDGE/FudgeCore.js"/>
(function (EscapeTheEdge) {
    var f = FudgeCore;
    let mover;
    EscapeTheEdge.musicMuted = true;
    EscapeTheEdge.soundMuted = false;
    let keysPressed = {};
    loadFilesWithResponse();
    window.addEventListener("load", init);
    function init(_event) {
        EscapeTheEdge.showMenue(); //-> style.ts
        document.getElementById("startButton").addEventListener("click", startGame);
        document.getElementById("controlButton").addEventListener("click", EscapeTheEdge.showControls);
        document.getElementById("musicButton").addEventListener("click", EscapeTheEdge.toggleMusic);
        document.getElementById("soundButton").addEventListener("click", EscapeTheEdge.toggleSounds);
        document.getElementById("creditsButton").addEventListener("click", EscapeTheEdge.showCredits);
        document.getElementById("backButton").addEventListener("click", EscapeTheEdge.showMenue);
        document.getElementById("playAgain").addEventListener("click", playAgain);
        EscapeTheEdge.canvas = document.querySelector("canvas");
        f.RenderManager.initialize(true, false);
    } //close init
    async function loadFilesWithResponse() {
        let response = await fetch("Scripts/data.json");
        let offer = await response.text();
        EscapeTheEdge.data = JSON.parse(offer);
    } //close loadFiles
    EscapeTheEdge.loadFilesWithResponse = loadFilesWithResponse;
    function startGame() {
        EscapeTheEdge.Sound.init();
        document.getElementById("stats").style.width = EscapeTheEdge.canvas.width + "px";
        document.getElementById("menue").style.display = "none";
        document.getElementById("gameWrapper").style.display = "initial";
        EscapeTheEdge.rootNode = new f.Node("RootNode");
        mover = new f.Node("Mover");
        EscapeTheEdge.items = new f.Node("Items");
        EscapeTheEdge.characters = new f.Node("Characters");
        let img = document.querySelector("img");
        let txtFigures = new f.TextureImage();
        txtFigures.image = img;
        EscapeTheEdge.Enemy.generateSprites(txtFigures);
        EscapeTheEdge.BoboBullet.generateSprites(txtFigures);
        EscapeTheEdge.Bobo.generateSprites(txtFigures);
        EscapeTheEdge.Collectable.generateSprites(txtFigures);
        EscapeTheEdge.bobo = new EscapeTheEdge.Bobo("Bobo");
        EscapeTheEdge.characters.appendChild(EscapeTheEdge.bobo);
        EscapeTheEdge.level = new EscapeTheEdge.Level(1);
        EscapeTheEdge.rootNode.appendChild(EscapeTheEdge.level);
        EscapeTheEdge.rootNode.appendChild(mover);
        EscapeTheEdge.rootNode.appendChild(EscapeTheEdge.characters);
        EscapeTheEdge.rootNode.appendChild(EscapeTheEdge.items);
        mover.addComponent(new f.ComponentTransform());
        let camera = new f.Node("Camera");
        let cmpCam = new f.ComponentCamera();
        camera.addComponent(cmpCam);
        cmpCam.pivot.translateZ(5);
        cmpCam.pivot.lookAt(f.Vector3.ZERO());
        cmpCam.pivot.translateY(0.3);
        cmpCam.backgroundColor = new f.Color(0.4, 0.4, 0.4, 1);
        mover.appendChild(camera);
        let cmpLightAmbient = new f.ComponentLight(new f.LightAmbient(f.Color.CSS("WHITE")));
        EscapeTheEdge.rootNode.addComponent(cmpLightAmbient);
        let light = new f.Node("Light");
        let cmpLight;
        cmpLight = new f.ComponentLight(new f.LightDirectional(f.Color.CSS("WHITE")));
        cmpLight.pivot.translate(new f.Vector3(0, 0, 10));
        cmpLight.pivot.lookAt(new f.Vector3(0, 0, 0));
        light.addComponent(cmpLight);
        mover.appendChild(light);
        EscapeTheEdge.viewport = new f.Viewport();
        EscapeTheEdge.viewport.initialize("Viewport", EscapeTheEdge.rootNode, camera.getComponent(f.ComponentCamera), EscapeTheEdge.canvas);
        //starting game
        f.RenderManager.update();
        EscapeTheEdge.viewport.draw();
        document.addEventListener("keydown", handleKeyboard);
        document.addEventListener("keyup", handleKeyboard);
        f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        f.Loop.start(f.LOOP_MODE.TIME_GAME, 10);
    } //close startGame
    function update() {
        processInput();
        updateCamera();
        EscapeTheEdge.viewport.draw();
        f.RenderManager.update();
        document.getElementById("health").style.width = EscapeTheEdge.bobo.health + "%";
        document.getElementById("mana").style.width = EscapeTheEdge.bobo.mana + "%";
        if (EscapeTheEdge.bobo.cmpTransform.local.translation.y >= EscapeTheEdge.level.height)
            win();
    } //close update
    function updateCamera() {
        let cmpCam = mover.getChildrenByName("Camera")[0].getComponent(f.ComponentCamera);
        let boboPos = EscapeTheEdge.bobo.cmpTransform.local.translation;
        cmpCam.pivot.translation = new f.Vector3(boboPos.x / 2, boboPos.y + 0.8, cmpCam.pivot.translation.z);
        /****************************************
         * Kamerahintrgrund oben heller machen? !!
         */
    } //close updateCamera
    function removeNodeFromNode(_toRemove, _fromNode) {
        _fromNode.removeChild(_toRemove);
    }
    EscapeTheEdge.removeNodeFromNode = removeNodeFromNode;
    function handleKeyboard(_event) {
        keysPressed[_event.code] = (_event.type == "keydown");
        if (_event.code == f.KEYBOARD_CODE.SPACE && _event.type == "keydown")
            EscapeTheEdge.bobo.act(EscapeTheEdge.ACTION.JUMP);
        if (_event.code == f.KEYBOARD_CODE.ARROW_LEFT && _event.type == "keydown")
            EscapeTheEdge.bobo.shoot(-1);
        if (_event.code == f.KEYBOARD_CODE.ARROW_RIGHT && _event.type == "keydown")
            EscapeTheEdge.bobo.shoot(1);
    } //close handleKeyboard
    function processInput() {
        if (keysPressed[f.KEYBOARD_CODE.ARROW_DOWN])
            EscapeTheEdge.bobo.toSize(EscapeTheEdge.SIZE.SMALL);
        else if (keysPressed[f.KEYBOARD_CODE.ARROW_UP])
            EscapeTheEdge.bobo.toSize(EscapeTheEdge.SIZE.BIG);
        else
            EscapeTheEdge.bobo.toSize(EscapeTheEdge.SIZE.MEDIUM);
        if (keysPressed[f.KEYBOARD_CODE.A])
            EscapeTheEdge.bobo.act(EscapeTheEdge.ACTION.WALK, EscapeTheEdge.DIRECTION.LEFT);
        else if (keysPressed[f.KEYBOARD_CODE.D])
            EscapeTheEdge.bobo.act(EscapeTheEdge.ACTION.WALK, EscapeTheEdge.DIRECTION.RIGHT);
        else
            EscapeTheEdge.bobo.act(EscapeTheEdge.ACTION.IDLE);
    } //close processInput
    function gameOver() {
        EscapeTheEdge.Sound.stopMusic();
        f.Loop.stop();
        document.getElementById("gameWrapper").style.display = "none";
        document.getElementById("endScreen").style.display = "initial";
        document.getElementById("winScreen").style.display = "none";
        document.getElementById("score").innerText = (Number(EscapeTheEdge.bobo.cmpTransform.local.translation.y.toFixed(1)) * 10).toString();
    } //close gameOver
    EscapeTheEdge.gameOver = gameOver;
    function win() {
        f.Loop.stop();
        EscapeTheEdge.Sound.play("win");
        document.getElementById("gameWrapper").style.display = "none";
        document.getElementById("endScreen").style.display = "initial";
        document.getElementById("deathScreen").style.display = "none";
    } //close win
    EscapeTheEdge.win = win;
    function playAgain() {
        location.reload();
    }
    function randNumb(_min, _max) {
        return Math.random() * (_max - _min) + _min;
    }
    EscapeTheEdge.randNumb = randNumb;
})(EscapeTheEdge || (EscapeTheEdge = {})); //close Namespace
//# sourceMappingURL=Main.js.map