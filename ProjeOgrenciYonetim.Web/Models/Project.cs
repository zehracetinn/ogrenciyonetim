namespace ProjeOgrenciYonetim.Web.Models
{
    public class Project
    {
        public int Id { get; set; }

        public string Name { get; set; } = default!;

        public string Description { get; set; } = default!;

        
        public int DurationWeeks { get; set; }

        
        public string Technologies { get; set; } = default!;

        public ICollection<ProjectApplication> Applications { get; set; }
            = new List<ProjectApplication>();
    }
}
