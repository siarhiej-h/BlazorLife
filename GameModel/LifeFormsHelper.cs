namespace GameModel
{
    public static class LifeFormsHelper
    {
        public static (int x, int y, bool isAlive)[] GetGlider(GliderDirection direction, Grid grid, int x, int y)
        {
            var up = (y == 0 ? grid.Height : y) - 1;
            var down = y == grid.Height - 1 ? 0 : y + 1;
            var left = (x == 0 ? grid.Width : x) - 1;
            var right = x == grid.Width - 1 ? 0 : x + 1;
            switch (direction)
            {
                case GliderDirection.UpLeft:
                    return new[]
                    {
                        (left, up, true), (x, up, true), (right, up, true),
                        (left, y, true), (x, y, false), (right, y, false),
                        (left, down, false), (x, down, true), (right, down, false)
                    };

                case GliderDirection.UpRight:
                    return new[]
                    {
                        (left, up, true), (x, up, true), (right, up, true),
                        (left, y, false), (x, y, false), (right, y, true),
                        (left, down, false), (x, down, true), (right, down, false)
                    };
                case GliderDirection.DownLeft:
                    return new[]
                    {
                        (left, up, false), (x, up, true), (right, up, false),
                        (left, y, true), (x, y, false), (right, y, false),
                        (left, down, true), (x, down, true), (right, down, true)
                    };
                case GliderDirection.DownRight:
                    return new[]
                    {
                        (left, up, false), (x, up, true), (right, up, false),
                        (left, y, false), (x, y, false), (right, y, true),
                        (left, down, true), (x, down, true), (right, down, true)
                    };
                default:
                    return new (int, int, bool)[0];
            };
        }
    }
}
