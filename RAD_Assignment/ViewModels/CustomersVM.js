var CustomersVM = function () {
    var self = this;

    //Ajax helper
    function ajaxHelper(uri, method, data) {
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: data ? ko.toJSON(data) : null
        }).fail(function (jqXHR, textStatus, errorThrown) {
            toastr.error("oops something went wrong")
        });
    }
    var customerUri = '/api/customers/'
    var bookingsUri = '/api/bookings/'
    var uri = 'https://trailapi-trailapi.p.mashape.com/'

    self.customers = ko.observableArray();

    self.bookings = ko.observableArray();

    self.BookingsForCustomer = ko.observableArray();

    self.places = ko.observableArray();

    self.Activities = ko.observableArray();

    self.GetCustomers = function () {
        ajaxHelper(customerUri, 'GET').done(function (data) {
            self.customers(data);
            toastr.success('Select a Customer to see their bookings.')
        })
    }

    self.GetBookings = function () {
        ajaxHelper(bookingsUri, 'GET').done(function (data) {
            self.bookings(data);
        })
    }

    self.CreateCustomer = function () {
        $('.panel-body, .createbtn').hide();
        $('#CreateCustomer, #crteCust').show();
        
    }

    self.newCustomer = {
        FirstName: ko.observable(),
        LastName: ko.observable(),
        DOB: ko.observable(),
    }

    self.CreateNewCustomer = function () {
        ajaxHelper(customerUri, 'POST', self.newCustomer).done(function (data)
        {
            self.customers.push(data);
            $('#CreateCustomer, #crteCust').hide();
            $('.panel-body, .createbtn').show();
           

        })
    }
    //observables to store selected customer
    self.CustomerName = ko.observable();
    self.CustomerId = ko.observable();

    //get selected customer bookings
    self.CustomerBookings = function (customer) {
        self.BookingsForCustomer.removeAll()
        self.CustomerName(customer.FirstName)
        self.CustomerId(customer.Id)

        ko.utils.arrayForEach(self.bookings(), function (item) {
            if (item.CustomerId == customer.Id) {
                self.BookingsForCustomer.push(item);
                $('#CreateBooking, #AllBookings').show();
                $('#NewBooking').hide();
                toastr.success('Click on booking to see activities')
            }
        })
    }

    self.CreateBooking = function () {
        $('#AllBookings').hide();
        $('#NewBooking').show();
    }

    

    $('.dropdown-menu li').on('click', function () {
        var country = $(this).text();
        self.places.removeAll()
        $.ajax({
            url: uri, // The URL to the API. You can get this by clicking on "Show CURL example" from an API profile
            type: 'GET', // The HTTP Method
            data: { 'q[country_cont]': country, 'limit': '20' }, // Additional parameters here
            datatype: 'json',
            success: function (data) {
                $.each(data.places, function(i,v){
                    self.places.push(v)
                    $('.list-group').show();
                    toastr.success('Select an Activity Centre to see activities')
                })
            },
            error: function (err)
            { toastr.error('Oops! something went wrong. Please try again'); },
            beforeSend: function (xhr) {
                xhr.setRequestHeader("X-Mashape-Authorization", "HvbD5fjX4JmshhXjwUpYo1S0cLMYp1ao6cQjsnPktNQTP8S1rc"); // Enter here your Mashape key
            }
        });

    });
    self.CentreActivies = function (centre) {
        self.Activities.removeAll();
        ko.utils.arrayForEach(self.places(), function (item) {
            if (item.unique_id == centre.unique_id) {
                self.Activities.push(item);
            }
        })
    }


}
$(document).ready(function () {
    toastr.options.preventDuplicates = true;
    var CVM = new CustomersVM;
    $("#datepicker").datepicker();
    $('#crteCust,#CreateBooking').hide();
    CVM.GetCustomers();
    CVM.GetBookings();

    ko.applyBindings(CVM)
})