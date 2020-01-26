using Microsoft.JSInterop;
using BlazorLife.Shared;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BlazorLife
{
    public class WindowInterop
    {
        private IJSRuntime _jsRuntime;

        public WindowInterop(IJSRuntime jsRunTime)
        {
            _jsRuntime = jsRunTime;
        }

        public async Task<(int Rows, int Cols)> GetSize()
        {
            int[] values = await _jsRuntime.InvokeAsync<int[]>("interopModel.getSize");
            return (values[0], values[1]);
        }

        public async Task Init(DotNetObjectReference<LifeControl> componenteRef, int pixelSize)
        {
            await _jsRuntime.InvokeVoidAsync("createInteropModel", componenteRef, pixelSize);
        }

        public async Task Resize(int pixelSize)
        {
            await _jsRuntime.InvokeVoidAsync("interopModel.resize", pixelSize);
        }

        public async Task Clear()
        {
            await _jsRuntime.InvokeVoidAsync("interopModel.clear");
        }

        public async Task SetGliderMode(bool isGliderMode)
        {
            await _jsRuntime.InvokeVoidAsync("interopModel.setGliderMode", isGliderMode);
        }

        public async Task SetGliderMode(bool isGliderMode, GameModel.GliderDirection direction)
        {
            await _jsRuntime.InvokeVoidAsync("interopModel.setGliderMode", isGliderMode, direction);
        }

        public async Task SetGliderDirection(GameModel.GliderDirection direction)
        {
            await _jsRuntime.InvokeVoidAsync("interopModel.setGliderDirection", direction);
        }

        public async Task PaintBitmap(int[] array)
        {
            await _jsRuntime.InvokeVoidAsync("interopModel.processBitmap", array);
        }
    }
}
