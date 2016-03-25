using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using System.Data.Entity.Spatial;
using System.Data.Entity;

namespace RAD_Assignment.Models
{
    public class Customer
    {
        public int Id { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public DateTime DOB { get; set; }

        public List<Booking> Bookings { get; set; }
    }

    public class Booking
    {
        public int Id { get; set; }

        public string Country { get; set; }
        public string City { get; set; }
        public string Activity_Name{get; set;}

        public DateTime BookingDate { get; set;}

        public float Latitude { get; set; }

        public float Longitude {get; set; }
        public int CustomerId { get; set; }

        [ForeignKey("CustomerId")]
        public Customer Customer { get; set; }


    }

    public class ActivitiesDB : DbContext
    {
        public ActivitiesDB():base("ActivitiesDB")
        {

        }

        public DbSet<Customer> Customers { get; set; }

        public DbSet<Booking> Bookings { get; set; }
    }
}