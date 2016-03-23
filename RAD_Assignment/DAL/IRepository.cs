using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace RAD_Assignment.DAL
{
    public interface IRepository<T> : IDisposable
    {
        IQueryable<T> Get();

        T GetByID(int id);

        void Put(T item);

        void Post(T item);

        void Delete(T item);

        bool ItemExists(int id);

        Task Save();

    }
}