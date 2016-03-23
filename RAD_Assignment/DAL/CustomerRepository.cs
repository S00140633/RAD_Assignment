using RAD_Assignment.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using System.Data.Entity;

namespace RAD_Assignment.DAL
{
    public class CustomerRepository : IRepository<Customer>
    {
        private ActivitiesDB context;

        public CustomerRepository(ActivitiesDB context)
        {
            this.context = context;
        }
        public void Delete(Customer customer)
        {
            context.Customers.Remove(customer);
        }

        public void Dispose()
        {
            context.Dispose();
        }

        public IQueryable<Customer> Get()
        {
            return context.Customers;
        }

        public Customer GetByID(int id)
        {
            return context.Customers.Find(id);
        }

        public bool ItemExists(int id)
        {
            return context.Customers.Count(e => e.Id == id) > 0;
        }

        public void Post(Customer item)
        {
            context.Customers.Add(item);
        }

        public void Put(Customer item)
        {
            context.Entry(item).State = EntityState.Modified;
        }

        public async Task Save()
        {
            await context.SaveChangesAsync();
        }
    }
}