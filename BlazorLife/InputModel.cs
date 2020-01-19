using System.ComponentModel.DataAnnotations;

namespace BlazorLife
{
    public class InputModel
    {
        [Range(1, 100000, ErrorMessage = "Invalid number of generations")]
        public string GenerationsToCalculate { get; set; }
    }
}
