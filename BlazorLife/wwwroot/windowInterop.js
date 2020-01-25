class WindowInteropModel {
    constructor(dotNetRef, pixelSize, isGliderMode, gliderDirection) {
        this.dotNetRef = dotNetRef;

        const canvas = document.getElementById('lifeCanvas');
        canvas.removeAttribute('hidden');
        this.ctx = canvas.getContext('2d');

        this.pixelSize = pixelSize;
        this.pixelBorderSize = 1;

        let containerWidth = window.outerWidth * .99;
        let containerHeight = window.outerHeight * .85;
        this.cols = 2 * Math.floor(containerWidth / pixelSize / 2);
        this.rows = 2 * Math.floor(containerHeight / pixelSize / 2);

        this.isGliderMode = isGliderMode;
        this.gliderDirection = gliderDirection;

        canvas.width = this.pixelSize * this.cols;
        canvas.height = this.pixelSize * this.rows;

        let boundOnClick = this.onClick.bind(this);
        canvas.addEventListener("click", boundOnClick, false);
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
            cells = [{ x: x, y: y, isAlive: true }];
        }

        this.ctx.fillStyle = '#252525';
        this.paintCells(cells.filter(c => c.isAlive));

        this.ctx.fillStyle = 'white';
        this.paintCells(cells.filter(c => !c.isAlive));

        this.dotNetRef.invokeMethodAsync('JsOnClick', cells);
    }

    getSize() {
        return [this.rows, this.cols];
    }

    paint(data) {
        if (data.dead) {
            this.ctx.fillStyle = 'white';
            this.paintCells(data.dead);
        }

        if (data.alive) {
            this.ctx.fillStyle = '#252525';
            this.paintCells(data.alive);
        }
    }

    paintCells(cells) {
        for (const cell of cells) {
            let x = cell.x * this.pixelSize + this.pixelBorderSize;
            let y = cell.y * this.pixelSize + this.pixelBorderSize;
            let size = this.pixelSize - this.pixelBorderSize;
            this.ctx.fillRect(x, y, size, size);
        }
    }

    switchClickMode(isGliderMode) {
        this.isGliderMode = isGliderMode;

    }

    switchGliderDirection(direction) {
        this.gliderDirection = direction;
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
        this.ctx.clearRect(0, 0, this.cols * this.pixelSize, this.rows * this.pixelSize);
    }
}

function createInteropModel(dotNetRef, pixelSize, isGliderMode, gliderDirection) {
    window.interopModel = new WindowInteropModel(dotNetRef, pixelSize, isGliderMode, gliderDirection);
}