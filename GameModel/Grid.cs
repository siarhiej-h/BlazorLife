using System;
using System.Collections.Generic;

namespace GameModel
{
    public class Grid
    {
        private Cell[,] Cells;

        private Cell[,] CellsNext;

        public Grid(int width, int height, double probability = 0.5d)
        {
            Cells = new Cell[height, width];
            CellsNext = new Cell[height, width];
            PopulateGrid(Cells, CellsNext, probability);
            PopulateNeighbours(Cells);
            PopulateNeighbours(CellsNext);
        }

        public IEnumerable<(int x, int y)> GetAliveCells()
        {
            var height = Cells.GetLength(0);
            var width = Cells.GetLength(1);
            for (int i = 0; i != height; i++)
            {
                for (int j = 0; j != width; j++)
                {
                    if (Cells[i, j].IsAlive)
                        yield return (j, i);
                }
            }
        }

        private static void PopulateGrid(Cell[,] cells, Cell[,] nextGen, double probability)
        {
            var rand = new Random(DateTime.Now.Millisecond);
            var height = cells.GetLength(0);
            var width = cells.GetLength(1);
            for (int i = 0; i != height; i++)
            {
                for (int j = 0; j != width; j++)
                {
                    var outcome = rand.NextDouble() < probability ? true : false;
                    cells[i, j] = new Cell(outcome);
                    nextGen[i, j] = new Cell(false);
                }
            }
        }

        private static void PopulateNeighbours(Cell[,] cells)
        {
            var height = cells.GetLength(0);
            var width = cells.GetLength(1);
            for (int i = 0; i != height; i++)
            {
                int up = i == 0 ? height - 1 : i - 1;
                int down = i == height - 1 ? 0 : i + 1;

                for (int j = 0; j != width; j++)
                {
                    int left = j == 0 ? width - 1 : j - 1;
                    int right = j == width - 1 ? 0 : j + 1;

                    var cell = cells[i, j];

                    int neighboursCounter = 0;
                    cell.Neighbours[neighboursCounter++] = cells[up, left];
                    cell.Neighbours[neighboursCounter++] = cells[up, j];
                    cell.Neighbours[neighboursCounter++] = cells[up, right];
                    cell.Neighbours[neighboursCounter++] = cells[i, left];
                    cell.Neighbours[neighboursCounter++] = cells[i, right];
                    cell.Neighbours[neighboursCounter++] = cells[down, left];
                    cell.Neighbours[neighboursCounter++] = cells[down, j];
                    cell.Neighbours[neighboursCounter] = cells[down, right];
                }
            }
        }

        public (IEnumerable<(int x, int y)> alive, IEnumerable<(int x, int y)> dead) NextGeneration()
        {
            var alive = new List<(int i, int j)>();
            var dead = new List<(int i, int j)>();
            var height = Cells.GetLength(0);
            var width = Cells.GetLength(1);

            for (int i = 0; i != height; i++)
            {
                for (int j = 0; j != width; j++)
                {
                    var cell = Cells[i, j];
                    var cellNextGen = CellsNext[i, j];
                    cellNextGen.IsAlive = PrepareNextState(cell, CountAliveNeighbours(cell));

                    if (cell.IsAlive != cellNextGen.IsAlive)
                    {
                        (cellNextGen.IsAlive ? alive : dead).Add((j, i));
                    }
                }
            }

            (Cells, CellsNext) = (CellsNext, Cells);
            return (alive, dead);
        }

        private static bool PrepareNextState(Cell cell, int aliveNeighbours)
        {
            bool nextState = cell.IsAlive;
            if (nextState && aliveNeighbours < 2)
            {
                nextState = false;
            }
            else if (nextState && aliveNeighbours > 3)
            {
                nextState = false;
            }
            else if (!nextState && aliveNeighbours == 3)
            {
                nextState = true;
            }

            return nextState;
        }

        private static int CountAliveNeighbours(Cell cell)
        {
            int aliveNeighbours = 0;

            for (int k = 0; k != 8; k++)
            {
                if (cell.Neighbours[k].IsAlive)
                {
                    aliveNeighbours++;
                }
            }

            return aliveNeighbours;
        }
    }
}
