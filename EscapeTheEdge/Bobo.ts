namespace EscapeTheEdge {
    import f = FudgeCore;

    export enum ACTION {
        IDLE = "Idle",
        WALK = "Walk",
        JUMP = "Jump"
    }

    export enum SIZE {
        SMALL = "Small",
        MEDIUM = "Medium",
        BIG = "Big"
    }
    export enum DIRECTION {
        LEFT, RIGHT
    }

    export class Bobo extends Moveable {
        protected mana: number = 100;
        // private static sprites: Sprite[];
        private speedMax: f.Vector2 = new f.Vector2(1.5, 5); // units per second
        // private static gravity: f.Vector2 = f.Vector2.Y(-3);
        // private action: ACTION;
        // private time: f.Time = new f.Time();
        // public speed: f.Vector3 = f.Vector3.ZERO();
        private size: SIZE = SIZE.MEDIUM;


        constructor(_name: string = "Bobo") {
            super(_name);
            this.addComponent(new f.ComponentTransform());

            for (let sprite of Bobo.sprites) {
                let nodeSprite: NodeSprite = new NodeSprite(sprite.name, sprite);
                nodeSprite.activate(false);

                nodeSprite.addEventListener(
                    "showNext",
                    (_event: Event) => { (<NodeSprite>_event.currentTarget).showFrameNext(); },
                    true
                );

                this.appendChild(nodeSprite);
            }

            this.show(ACTION.IDLE);
            f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
        } //close constructor

        public static generateSprites(_txtImage: f.TextureImage): void {
            Bobo.sprites = [];
            let sprite: Sprite = new Sprite(ACTION.WALK);
            sprite.generateByGrid(_txtImage, f.Rectangle.GET(1, 1, 17, 17), 6, new f.Vector2(1, 1), 64, f.ORIGIN2D.BOTTOMCENTER);
            Bobo.sprites.push(sprite);

            sprite = new Sprite(ACTION.IDLE);
            sprite.generateByGrid(_txtImage, f.Rectangle.GET(1, 18, 17, 17), 7, new f.Vector2(1, 1), 64, f.ORIGIN2D.BOTTOMCENTER);
            Bobo.sprites.push(sprite);
        } //close generate Sprites

        public act(_action: ACTION, _direction?: DIRECTION): void {
            switch (_action) {
                case ACTION.IDLE:
                    this.speed.x = 0;
                    break;
                case ACTION.WALK:
                    let direction: number = (_direction == DIRECTION.RIGHT ? 1 : -1);
                    this.speed.x = this.speedMax.x; // * direction;
                    this.cmpTransform.local.rotation = f.Vector3.Y(90 - 90 * direction);
                    // console.log(direction);
                    break;
                case ACTION.JUMP:
                    // if (this.speed.y == 0) //für kein doppelSprung
                    console.log(this.speedMax.y);
                    this.speed.y = 2;
                    break;
            }
            this.show(_action);
        } //close act

        public toSize(_size: SIZE): void {
            if (this.mana <= 0) {
                _size = SIZE.MEDIUM;
            }
            this.size = _size;
            console.log(this.size);
            switch (_size) {
                case SIZE.MEDIUM:
                    this.cmpTransform.local.scaling = new f.Vector3(1, 1, 1);
                    this.speedMax = new f.Vector2(1, 2);
                    break;
                case SIZE.SMALL:
                    this.cmpTransform.local.scaling = new f.Vector3(0.5, 0.5, 1);
                    this.speedMax = new f.Vector2(5, 1);
                    break;
                case SIZE.BIG:
                    this.cmpTransform.local.scaling = new f.Vector3(1.5, 1.5, 1);
                    this.speedMax = new f.Vector2(0.5, 10);
                    break;
            }

        } //close toSize

        protected update = (_event: f.Eventƒ): void => {
            this.broadcastEvent(new CustomEvent("showNext"));

            let timeFrame: number = f.Loop.timeFrameGame / 1000;
            this.speed.y += Bobo.gravity.y * timeFrame;
            let distance: f.Vector3 = f.Vector3.SCALE(this.speed, timeFrame);
            this.cmpTransform.local.translate(distance);

            //mana abzeihen für größe
            if (this.size != SIZE.MEDIUM) {
                this.mana -= 5;

            }
            if (this.mana < 0) {
                this.mana = 0;
            } else if (this.mana > 100) {
                this.mana = 100;
            }
            console.log(this.mana);

            this.checkCollision(distance);
        } //close update


    } //close class

} //close namespace