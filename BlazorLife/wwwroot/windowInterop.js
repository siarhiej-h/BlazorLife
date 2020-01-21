class WindowInteropModel {
    constructor(pixelSize) {
        const canvas = document.getElementById('lifeCanvas');
        canvas.removeAttribute('hidden');
        this.ctx = canvas.getContext('2d');

        this.pixelSize = pixelSize;
        this.pixelBorderSize = 1;

        let containerWidth = window.innerWidth * .99;
        let containerHeight = window.innerHeight * .90;
        this.cols = Math.floor(containerWidth / pixelSize);
        this.rows = Math.floor(containerHeight / pixelSize);

        canvas.width = this.pixelSize * this.cols;
        canvas.height = this.pixelSize * this.rows;
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

    clear() {
        this.ctx.clearRect(0, 0, this.cols * this.pixelSize, this.rows * this.pixelSize);
    }
}

function createInteropModel(pixelSize) {
    window.interopModel = new WindowInteropModel(pixelSize);
}