namespace RAD_Assignment.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ChangedCoordinates : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Bookings", "Latitude", c => c.Single(nullable: false));
            AddColumn("dbo.Bookings", "Longitude", c => c.Single(nullable: false));
            DropColumn("dbo.Bookings", "Location");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Bookings", "Location", c => c.Geography());
            DropColumn("dbo.Bookings", "Longitude");
            DropColumn("dbo.Bookings", "Latitude");
        }
    }
}
