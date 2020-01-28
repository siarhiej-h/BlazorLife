namespace GameModel
{
    public class Cell
    {
        public bool IsAlive;

        public int NeighboursAlive = 0;

        public Cell(bool isAlive)
        {
            IsAlive = isAlive;
        }
    }
}
