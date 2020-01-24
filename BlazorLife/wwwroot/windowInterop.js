class WindowInteropModel {
    constructor(dotNetRef, pixelSize, isGliderMode) {
        this.dotNetRef = dotNetRef;

        const canvas = document.getElementById('lifeCanvas');
        canvas.removeAttribute('hidden');
        this.ctx = canvas.getContext('2d');

        this.pixelSize = pixelSize;
        this.pixelBorderSize = 1;

        let containerWidth = window.innerWidth * .99;
        let containerHeight = window.innerHeight * .90;
        this.cols = 2 * Math.floor(containerWidth / pixelSize / 2);
        this.rows = 2 * Math.floor(containerHeight / pixelSize / 2);

        this.isGliderMode = isGliderMode;

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
            cells = [
                { x: x - 1, y: y - 1, isAlive: true }, { x: x, y: y - 1, isAlive: true }, { x: x + 1, y: y - 1, isAlive: true },
                { x: x - 1, y: y, isAlive: false }, { x: x, y: y, isAlive: false }, { x: x + 1, y: y, isAlive: true },
                { x: x - 1, y: y +1, isAlive: false }, { x: x, y: y + 1, isAlive: true }, { x: x + 1, y: y + 1, isAlive: false },
            ];
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

    clear() {
        this.ctx.clearRect(0, 0, this.cols * this.pixelSize, this.rows * this.pixelSize);
    }
}

function createInteropModel(dotNetRef, pixelSize, isGliderMode) {
    window.interopModel = new WindowInteropModel(dotNetRef, pixelSize, isGliderMode);
}