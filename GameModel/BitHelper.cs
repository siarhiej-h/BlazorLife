using System.Collections;

namespace GameModel
{
    public static class BitHelper
    {
        public static int[] ConvertToIntegers(BitArray bitArray)
        {
            var integers = new int[(bitArray.Length + 31) / 32];
            bitArray.CopyTo(integers, 0);

            return integers;
        }
    }
}
