using RAD_Assignment.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace RAD_Assignment.DAL
{
    public class BookingRepository:IRepository<Booking>
    {
        private ActivitiesDB context;

        public BookingRepository(ActivitiesDB context)
        {
            this.context = context;
        }
        public void Delete(Booking booking)
        {
            context.Bookings.Remove(booking);
        }

        public void Dispose()
        {
            context.Dispose();
        }

        public IQueryable<Booking> Get()
        {
            return context.Bookings;
        }

        public Booking GetByID(int id)
        {
            return context.Bookings.Find(id);
        }

        public bool ItemExists(int id)
        {
            return context.Bookings.Count(e => e.Id == id) > 0;
        }

        public void Post(Booking booking)
        {
            context.Bookings.Add(booking);
        }

        public void Put(Booking booking)
        {
            context.Entry(booking).State = EntityState.Modified;
        }

        public async Task Save()
        {
            await context.SaveChangesAsync();
        }
    }
}