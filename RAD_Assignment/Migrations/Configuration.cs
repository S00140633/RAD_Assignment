namespace RAD_Assignment.Migrations
{
    using Models;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Data.Entity.Spatial;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<RAD_Assignment.Models.ActivitiesDB>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
            AutomaticMigrationDataLossAllowed = true;
        }

        protected override void Seed(RAD_Assignment.Models.ActivitiesDB context)
        {
            List<Customer> customers = new List<Customer>()
            {
                new Customer() {FirstName="Joe", LastName="Blogs", DOB=DateTime.Parse("15/05/1986"), Bookings = new List<Booking>()
                {
                    new Booking() {Country = "Australia",City="Thredbo Village",BookingDate=DateTime.Parse("05/05/2016"), Activity_Name= "Cascade Hut Trail", Longitude =148.26433f, Latitude= -36.52314f },
                    new Booking() {Country = "Australia", City= "Picton",BookingDate=DateTime.Parse("30/05/2016"), Activity_Name="Thirlmere Lakes National Park", Longitude=150.537027f ,Latitude= -34.232213f }
                }},
                new Customer() {FirstName="John", LastName = "Hancock", DOB = DateTime.Parse("12/02/1990"), Bookings = new List<Booking>() {
                    new Booking() {Country = "United States", City="Chelan", BookingDate=DateTime.Parse("12/06/2016"), Activity_Name="Steliko Ridge Trail #1454", Longitude =-120.26159f, Latitude= 47.78097f  },
                    new Booking() {Country = "United States", City="Bishop", BookingDate=DateTime.Parse("12/07/2016"), Activity_Name="Pleasant Valley Pit", Longitude=-118.399664f, Latitude= 37.361388f },
                } }
            };

            customers.ForEach(c => context.Customers.Add(c));
        }
    }
}
