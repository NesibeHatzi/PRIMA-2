///<reference types="../Fudge/FudgeCore.js"/> 
namespace L08_FudgeCraft {
    import f = FudgeCore;
    export let viewport: f.Viewport;

    document.addEventListener("DOMContentLoaded", handleLoad);

    let game: f.Node;
    let currentFragment: Fragment;
    let firstFragment: Fragment;


    // ############################################################################################
    // ############################################################################################
    function handleLoad(_event: Event): void {
        console.log("Hello World");
        const canvas: HTMLCanvasElement = document.querySelector("canvas");
        f.RenderManager.initialize(true); //true um Antialiasing zu vermeiden

        //Camera
        let camera: f.Node = new f.Node("Camera");
        let cmpCam: f.ComponentCamera = new f.ComponentCamera();
        camera.addComponent(cmpCam);
        cmpCam.pivot.translate(new f.Vector3(0, 3, 30)); // kamera auf ort setzen
        // cmpCam.pivot.lookAt(f.Vector3.ZERO()); // um auf 0|0|0 zu schauen


        //create Game Node
        let game: f.Node = createGame();

        let cmpLight: f.ComponentLight = new f.ComponentLight(new f.LightDirectional(f.Color.WHITE));
        cmpLight.pivot.lookAt(new f.Vector3(0.5, 0, 0.5));
        game.addComponent(cmpLight);

        viewport = new f.Viewport();     
        viewport.initialize("Viewport", game, camera.getComponent(f.ComponentCamera), canvas);
        viewport.draw();
        console.log("after viewport.draw(): " + currentFragment.getCubesPositions()); //erst hier ist die position im raum richtig erfasst

        window.addEventListener("keydown", handleKeyDown);

        console.log("Setup done");
    } //close handleLoad


    function createGame(): f.Node {
        game = new f.Node("Game");

        let fragment: Fragment;
        fragment = new Fragment(0);
        firstFragment = fragment;
        game.appendChild(fragment);

        fragment = new Fragment(1);
        fragment.addComponent(new f.ComponentTransform);
        currentFragment = fragment;
        game.appendChild(fragment);

        return game;
    } //close createGame


    // ############################################################################################
    // ############################################################################################
    function handleKeyDown(_event: KeyboardEvent): void {

        processInput(_event, 1);
        

        if (checkIfHit()) {
            processInput(_event, -1);
            //fragment fest setzen und neues erstellen
        }


    } //close handleKeyDown


    function checkIfHit(): boolean {

        console.log("firstFrag: " + firstFragment.getCubesPositions());
        console.log("currentFrag: " + currentFragment.getCubesPositions());

        for (let fragment of game.getChildren()) {
            // console.log("1. durch alle game.getChildren");
            if (fragment != currentFragment && fragment instanceof Fragment) {
                // console.log("2. if fragment != currentFragment und Fragment instace");
                for (let othersPosition of fragment.getCubesPositions()) {
                    // console.log("3. for otherpositions of fragment.getCubesPositions");
                    for (let currentPosition of currentFragment.getCubesPositions()) {
                        // console.log("4. for currentPos of currentFrag.getCubesPositions");
                        // console.log(othersPosition);
                        // console.log(currentPosition);
                        if (othersPosition[0] == currentPosition[0] && othersPosition[1] == currentPosition[1]) {
                            console.log("5. HIT! ");
                            return true;
                        }
                    }
                }
            }
        }

        return false;
    } //close checkIfHit


    function processInput(_event: KeyboardEvent, _moveOn: number): void {

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
        viewport.draw();
    } //close process Input


} //close Namespace