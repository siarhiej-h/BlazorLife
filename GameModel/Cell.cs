namespace GameModel
{
    public class Cell
    {
        public bool IsAlive;

        public Cell[] Neighbours = new Cell[8];

        public Cell(bool isAlive)
        {
            IsAlive = isAlive;
        }
    }
}
