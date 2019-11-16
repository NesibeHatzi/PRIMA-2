namespace L08_FudgeCraft {
    import f = FudgeCore;

    export class Fragment extends f.Node {

        fragmentDef: number[][][] = this.getShapeArray();
        position: f.Vector3 = new f.Vector3(0, 0, 0);
        materials: f.Material[] = this.createMaterials();

        constructor(_shape: number) {
            super("Fragment-Type" + _shape);
            let shape: number[][] = this.fragmentDef[_shape];
            let mtr: f.Material = this.getMaterial(_shape);
            f.Debug.log(mtr);
            //schleife durch eine Form um die einzelnen Cubes zu setzen
            for (let position of shape) {
                //einen Nullvektor erstellen an dessen Werte die Position gesetzt wird
                let vctPosition: f.Vector3 = f.Vector3.ZERO();
                vctPosition.set(position[0], position[1], position[2]);
                //neuen Cube an der vectorPosition erstellen und anhängen
                let cube: Cube = new Cube(vctPosition, mtr);
                this.appendChild(cube);
            }
        } //close constructor

        getShapeArray(): number[][][] {
            //[Index der Form][Eine Form][Position eines Cubes]
            let shapeArray: number[][][] =
                [
                    [[-1, 0, 0], [0, 0, 0], [1, 0, 0], [1, 1, 0]], //L: Orange Ricky
                    [[-1, -1, 0], [-1, 0, 0], [0, 0, 0], [1, 0, 0]], //J: Blue Ricky
                    [[0, 0, 0], [0, 1, 0], [-1, 1, 0], [1, 0, 0]], //Z: Cleveland Z
                    [[0, 0, 0], [0, 1, 0], [1, 1, 0], [-1, 0, 0]], //S: Rhode Island Z
                    [[0, 0, 0], [0, 1, 0], [-1, 0, 0], [1, 0, 0]], //T: Teewee 
                    [[0, 0, 0], [0, 1, 0], [1, 0, 0], [1, 1, 0]], //O: Smashboy
                    [[0, 0, 0], [1, 0, 0], [2, 0, 0], [-1, 0, 0]] // I: Hero
                ];
            return shapeArray;
        } //close getShapeArray

        createMaterials(): f.Material[] {
            let mtrArray: f.Material[] = [];
            mtrArray = [
                new f.Material("Orange", f.ShaderFlat, new f.CoatColored(new f.Color(1, 0.75, 0, 1))),
                new f.Material("Blue", f.ShaderFlat, new f.CoatColored(f.Color.BLUE)),
                new f.Material("Red", f.ShaderFlat, new f.CoatColored(f.Color.RED)),
                new f.Material("Green", f.ShaderFlat, new f.CoatColored(f.Color.GREEN)),
                new f.Material("Magenta", f.ShaderFlat, new f.CoatColored(f.Color.MAGENTA)),
                new f.Material("Yellow", f.ShaderFlat, new f.CoatColored(f.Color.YELLOW)),
                new f.Material("Cyan", f.ShaderFlat, new f.CoatColored(f.Color.CYAN))
            ];
            return mtrArray;
        }

        getMaterial(_shape: number): f.Material {
            let mtr: f.Material = this.materials[_shape];
            return mtr;
        }


    } //close class Fragment

} //namespace zu