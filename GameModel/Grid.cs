﻿using System.Collections;

namespace GameModel
{
    public class Grid
    {
        private static Random Random = new Random(Guid.NewGuid().GetHashCode());

        private Cell[] Cells { get; set; }

        private Cell[] CellsNext { get; set; }

        private CellData[] Alive;
        private CellData[] Dead;
        private int AliveLength = 0;
        private int DeadLength = 0;

        public int Width { get; private set; }

        public int Height { get; private set; }

        public bool this [int x, int y]
        {
            get
            {
                return Cells[y * Width + x].IsAlive;
            }
        }

        private Grid(int width, int height)
        {
            Width = width;
            Height = height;

            Cells = new Cell[height * width];
            CellsNext = new Cell[height * width];

            for (int i = 0; i != height; i++)
            {
                for (int j = 0; j != width; j++)
                {
                    Cells[i * width + j] = new Cell(false);
                    CellsNext[i * width + j] = new Cell(false);
                }
            }
            Alive = new CellData[width * height];
            Dead = new CellData[width * height];
        }

        public static Grid Create(int width, int height, StartOptions options, double probability = 0.1)
        {
            var grid = new Grid(width, height);
            Populate(grid, options, probability);
            return grid;
        }

        public (CellData[] alive, int aliveLength, CellData[] dead, int deadLength) GetAliveCells()
        {
            return (Alive, AliveLength, Dead, DeadLength);
        }

        public void Set(int x, int y, bool isAlive)
        {
            var cell = Cells[y * Width + x];
            if (cell.IsAlive != isAlive)
            {
                cell.IsAlive = isAlive;
                ref var state = ref (isAlive ? ref Alive[AliveLength++] : ref Dead[DeadLength++]);
                state.X = x;
                state.Y = y;
                UpdateCellNeighbours(Cells, y, x, isAlive);
            }
        }

        public (CellData[] alive, int aliveLength, CellData[] dead, int deadLength) NextGeneration()
        {
            AliveLength = 0;
            DeadLength = 0;
            for (int i = 0; i != Cells.Length; i++)
            {
                CellsNext[i].NeighboursAlive = Cells[i].NeighboursAlive;
            }

            for (int i = 0; i != Height; i++)
            {
                var iWidth = i * Width;
                for (int j = 0; j != Width; j++)
                {
                    var cell = Cells[iWidth + j];
                    var cellNextGen = CellsNext[iWidth + j];
                    cellNextGen.IsAlive = PrepareNextState(cell);

                    if (cellNextGen.IsAlive != cell.IsAlive)
                    {
                        UpdateCellNeighbours(CellsNext, i, j, cellNextGen.IsAlive);
                        ref var state = ref (cellNextGen.IsAlive ? ref Alive[AliveLength++] : ref Dead[DeadLength++]);
                        state.X = j;
                        state.Y = i;
                    }
                }
            }

            (Cells, CellsNext) = (CellsNext, Cells);
            return (Alive, AliveLength, Dead, DeadLength);
        }

        private void UpdateCellNeighbours(Cell[] cells, int row, int column, bool newValue)
        {
            var upRow = (row == 0 ? Height - 1 : row - 1) * Width;
            var downRow = (row == Height - 1 ? 0 : row + 1) * Width;
            int left = column == 0 ? Width - 1 : column - 1;
            int right = column == Width - 1 ? 0 : column + 1;
            int rowWidth = row * Width;

            if (newValue)
            {
                cells[upRow + left].NeighboursAlive++;
                cells[upRow + column].NeighboursAlive++;
                cells[upRow + right].NeighboursAlive++;

                cells[rowWidth + left].NeighboursAlive++;
                cells[rowWidth + right].NeighboursAlive++;

                cells[downRow + left].NeighboursAlive++;
                cells[downRow + column].NeighboursAlive++;
                cells[downRow + right].NeighboursAlive++;
            }
            else
            {
                cells[upRow + left].NeighboursAlive--;
                cells[upRow + column].NeighboursAlive--;
                cells[upRow + right].NeighboursAlive--;

                cells[rowWidth + left].NeighboursAlive--;
                cells[rowWidth + right].NeighboursAlive--;

                cells[downRow + left].NeighboursAlive--;
                cells[downRow + column].NeighboursAlive--;
                cells[downRow + right].NeighboursAlive--;
            }
        }

        private static bool PrepareNextState(Cell cell)
        {
            bool nextState = cell.IsAlive;
            if (nextState && cell.NeighboursAlive < 2)
            {
                nextState = false;
            }
            else if (nextState && cell.NeighboursAlive > 3)
            {
                nextState = false;
            }
            else if (!nextState && cell.NeighboursAlive == 3)
            {
                nextState = true;
            }

            return nextState;
        }

        private static Grid Populate(Grid grid, StartOptions options, double probability = 0.5)
        {
            switch (options)
            {
                case StartOptions.Random:
                    PopulateRandomGrid(grid, probability);
                    break;

                case StartOptions.Blank:
                default:

                    break;
            }

            return grid;
        }

        private static void PopulateRandomGrid(Grid grid, double probability)
        {
            grid.AliveLength = 0;
            grid.DeadLength = 0;
            for (int i = 0; i != grid.Height; i++)
            {
                int iWidth = i * grid.Width;
                for (int j = 0; j != grid.Width; j++)
                {
                    var outcome = Random.NextDouble() < probability ? true : false;
                    grid.Cells[iWidth + j].IsAlive = outcome;
                    if (outcome)
                    {
                        ref var state = ref grid.Alive[grid.AliveLength++];
                        (state.X, state.Y) = (j, i);
                        grid.UpdateCellNeighbours(grid.Cells, i, j, outcome);
                    }
                }
            }
        }
    }
}
