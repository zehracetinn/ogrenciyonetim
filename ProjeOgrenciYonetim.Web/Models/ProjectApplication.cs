using System;
using System.Text.Json.Serialization;

namespace ProjeOgrenciYonetim.Web.Models
{
    public class ProjectApplication
    {
        public int Id { get; set; }

        public int StudentId { get; set; }

        [JsonIgnore]
        public Student Student { get; set; } = default!;

        public int ProjectId { get; set; }

        
        [JsonIgnore]
        public Project Project { get; set; } = default!;
        
        public DateTime ApplyDate { get; set; } = DateTime.UtcNow;
        public DateTime AppliedAt { get; set; } = DateTime.UtcNow;

        public ApplicationStatus Status { get; set; } = ApplicationStatus.Pending;
    }

    public enum ApplicationStatus
    {
        Pending = 0,
        Approved = 1,
        Rejected = 2
    }
}
