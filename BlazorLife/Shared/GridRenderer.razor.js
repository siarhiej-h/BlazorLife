import { default as Stats } from '/stats.module.js';

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

        this.disposed = false;
        const stats = new Stats();
        stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        stats.dom.style.left = '';
        stats.dom.style.right = '0px';
        stats.dom.style.transform = 'scale(1.5)';
        stats.dom.style.transformOrigin = 'top right';
        stats.dom.style.opacity = '1';
        document.body.appendChild(stats.dom);
        this.stats = stats;
    }

    onNextFrame(callbackName) {
        window.requestAnimationFrame(() => {
            if (!this.disposed) {
                this.stats.begin();
                this.dotNetRef.invokeMethod(callbackName);
                this.stats.end();
            }
        });
    }

    disposeContext() {
        stats.dom.remove();
        this.disposed = true;
    }

    resize(pixelSize) {
        this.started = false;
        this.pixelSize = pixelSize;
        const canvas = document.getElementById('lifeCanvas');
        return this.resizeCanvas(canvas);
    }

    resizeCanvas(canvas) {
        let containerWidth = window.outerWidth * .97;
        let containerHeight = window.outerHeight * .85;
        this.cols = 2 * Math.floor(containerWidth / this.pixelSize / 2);
        this.rows = 2 * Math.floor(containerHeight / this.pixelSize / 2);

        canvas.width = this.pixelSize * this.cols + 1;
        canvas.height = this.pixelSize * this.rows + 1;

        return [this.rows, this.cols];
    }

    onClick(event) {

        if (!event) {
            return;
        }

        let x = Math.floor(event.offsetX / this.pixelSize);
        let y = Math.floor(event.offsetY / this.pixelSize);
        this.dotNetRef.invokeMethodAsync('JsOnClick', x, y);
    }

    getSize() {
        return [this.rows, this.cols];
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

    renderState(state, stateLength, alive) {
        const entry = Blazor.platform.getArrayEntryPtr(state, 0, 8 * stateLength);
        var data = new Int32Array(Module.HEAP32.buffer, entry, 2 * stateLength);
        this.ctx.fillStyle = alive ? '#252525' : 'white';
        
        let size = this.pixelSize - this.pixelBorderSize;
        for (let item = 0; item < stateLength; item++) {
            let x = data[item * 2] * this.pixelSize + this.pixelBorderSize;
            let y = data[item * 2 + 1] * this.pixelSize + this.pixelBorderSize;
            this.ctx.fillRect(x, y, size, size);
        }

    }

    clear() {
        this.ctx.clearRect(0, 0, this.cols * this.pixelSize, this.rows * this.pixelSize);
    }
}

export function createInteropModel(dotNetRef, pixelSize) {
    window.interopModel = new WindowInteropModel(dotNetRef, pixelSize);
    return window.interopModel;
}