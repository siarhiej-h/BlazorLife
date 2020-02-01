class WindowInteropModel {
    constructor(dotNetRef, pixelSize) {
        this.dotNetRef = dotNetRef;
        this.pixelBorderSize = 1;
        const canvas = document.getElementById('lifeCanvas');
        canvas.removeAttribute('hidden');
        this.ctx = canvas.getContext('2d');
        this.pixelSize = pixelSize;

        this.resizeCanvas(canvas);

        let boundOnClick = this.onClick.bind(this);
        canvas.addEventListener("click", boundOnClick, false);
    }

    resize(pixelSize) {
        this.pixelSize = pixelSize;
        const canvas = document.getElementById('lifeCanvas');
        this.resizeCanvas(canvas);
    }

    resizeCanvas(canvas) {
        let containerWidth = window.outerWidth * .97;
        let containerHeight = window.outerHeight * .85;
        this.cols = 2 * Math.floor(containerWidth / this.pixelSize / 2);
        this.rows = 2 * Math.floor(containerHeight / this.pixelSize / 2);

        canvas.width = this.pixelSize * this.cols;
        canvas.height = this.pixelSize * this.rows;

        // I only want to repaint changed cells, so I need to have current state stored somewhere
        this.cells = [];
        for (let i = 0; i !== this.rows; i++) {
            for (let j = 0; j !== this.cols; j++) {
                this.cells[this.cols * i + j] = false;
            }
        }
    }

    onClick(event) {

        if (!event) {
            return;
        }

        let x = Math.floor(event.offsetX / this.pixelSize);
        let y = Math.floor(event.offsetY / this.pixelSize);

        let cells = [];
        if (this.isGliderMode) {
            cells = this.getGlider(x, y);
        }
        else {
            cells = [{ x: x, y: y, isAlive: this.cells[this.cols * y + x] === true ? false : true }];
        }

        let alive = cells.filter(c => c.isAlive); 
        let dead = cells.filter(c => !c.isAlive);
        this.paint(alive, dead);
        this.updateState(alive, dead);

        this.dotNetRef.invokeMethodAsync('JsOnClick', cells);
    }

    getSize() {
        return [this.rows, this.cols];
    }

    paint(alive, dead) {
        if (dead) {
            this.ctx.fillStyle = 'white';
            this.paintCells(dead);
        }

        if (alive) {
            this.ctx.fillStyle = '#252525';
            this.paintCells(alive);
        }
    }

    paintCells(cells) {
        let size = this.pixelSize - this.pixelBorderSize;
        for (const cell of cells) {
            let x = cell.x * this.pixelSize + this.pixelBorderSize;
            let y = cell.y * this.pixelSize + this.pixelBorderSize;
            this.ctx.fillRect(x, y, size, size);
        }
    }

    setGliderMode(isGliderMode, direction) {
        this.isGliderMode = isGliderMode;

        if (direction !== undefined && this.gliderDirection !== null) {
            this.gliderDirection = direction;
        }
    }

    setGliderDirection(direction) {
        this.gliderDirection = direction;
    }

    processBitmap(numbers) {
        let x = 0;
        let y = 0;

        let newDead = [];
        let newAlive = [];

        // This thing works with 32-bit integers. Each integer contains state of 32 cells.
        for (let number of numbers) {
            for (let i = 0; i !== 32; i++) {
                let isAlive = (number & (1 << i)) != 0;
                let wasAlive = this.cells[y * this.cols + x];
                if (isAlive !== wasAlive) {
                    (isAlive ? newAlive : newDead).push({ x: x, y: y });
                }

                x++;
                if (x === this.cols) {
                    x = 0;
                    y++;
                }

                if (y === this.rows) {
                    break;
                }
            }
        }

        this.paint(newAlive, newDead);
        this.updateState(newAlive, newDead);
    }

    updateState(alive, dead) {
        if (dead) {
            for (let cell of dead) {
                this.cells[cell.y * this.cols + cell.x] = false;
            }
        }

        if (alive) {
            for (let cell of alive) {
                this.cells[cell.y * this.cols + cell.x] = true;
            }
        }
    }

    getGlider(x, y) {
        let left = x === 0 ? this.cols - 1 : x - 1;
        let right = x === this.cols - 1 ? 0 : x + 1;
        let up = y === 0 ? this.rows - 1 : y - 1;
        let down = y === this.rows - 1 ? 0 : y + 1;
        switch (this.gliderDirection) {
            case 0:
                return [
                    { x: left, y: up, isAlive: true }, { x: x, y: up, isAlive: true }, { x: right, y: up, isAlive: true },
                    { x: left, y: y, isAlive: true }, { x: x, y: y, isAlive: false }, { x: right, y: y, isAlive: false },
                    { x: left, y: down, isAlive: false }, { x: x, y: down, isAlive: true }, { x: right, y: down, isAlive: false },
                ];
            case 1:
                return [
                    { x: left, y: up, isAlive: true }, { x: x, y: up, isAlive: true }, { x: right, y: up, isAlive: true },
                    { x: left, y: y, isAlive: false }, { x: x, y: y, isAlive: false }, { x: right, y: y, isAlive: true },
                    { x: left, y: down, isAlive: false }, { x: x, y: down, isAlive: true }, { x: right, y: down, isAlive: false },
                ];
            case 2:
                return [
                    { x: left, y: up, isAlive: false }, { x: x, y: up, isAlive: true }, { x: right, y: up, isAlive: false },
                    { x: left, y: y, isAlive: true }, { x: x, y: y, isAlive: false }, { x: right, y: y, isAlive: false },
                    { x: left, y: down, isAlive: true }, { x: x, y: down, isAlive: true }, { x: right, y: down, isAlive: true },
                ];
            case 3:
                return [
                    { x: left, y: up, isAlive: false }, { x: x, y: up, isAlive: true }, { x: right, y: up, isAlive: false },
                    { x: left, y: y, isAlive: false }, { x: x, y: y, isAlive: false }, { x: right, y: y, isAlive: true },
                    { x: left, y: down, isAlive: true }, { x: x, y: down, isAlive: true }, { x: right, y: down, isAlive: true },
                ];
        }
    }

    clear() {
        for (let i = 0; i !== this.rows; i++) {
            for (let j = 0; j !== this.cols; j++) {
                this.cells[i * this.cols + j] = false;
            }
        }
        this.ctx.clearRect(0, 0, this.cols * this.pixelSize, this.rows * this.pixelSize);
    }
}

function createInteropModel(dotNetRef, pixelSize) {
    window.interopModel = new WindowInteropModel(dotNetRef, pixelSize);
}