using Microsoft.JSInterop;
using System;
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

        public async Task Paint(IEnumerable<(int x, int y)> cellsAlive = null, IEnumerable<(int x, int y)> cellsDead = null)
        {
            cellsAlive ??= Enumerable.Empty<(int x, int y)>();
            cellsDead ??= Enumerable.Empty<(int x, int y)>();
            var obj = new
            {
                Alive = cellsAlive
                    .Select(c => new { c.x, c.y })
                    .ToArray(),
                Dead = cellsDead
                    .Select(c => new { c.x, c.y })
                    .ToArray()
            };

            await _jsRuntime.InvokeVoidAsync("interopModel.paint", obj);
        }

        public async Task<(int Rows, int Cols)> GetSize(int pixelSize)
        {
            int[] values = await _jsRuntime.InvokeAsync<int[]>("interopModel.getSize", pixelSize);
            return (values[0], values[1]);
        }

        public async Task Init(int pixelSize)
        {
            await _jsRuntime.InvokeVoidAsync("createInteropModel", pixelSize);
        }

        public async Task Clear()
        {
            await _jsRuntime.InvokeVoidAsync("interopModel.clear");
        }
    }
}
