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

    //url for APIs
    var customerUri = '/api/customers/'
    var bookingsUri = '/api/bookings/'
    var uri = 'https://trailapi-trailapi.p.mashape.com/'


    //Obersvable arrays for storing booking, customers and activities
    self.customers = ko.observableArray();

    self.bookings = ko.observableArray();

    self.BookingsForCustomer = ko.observableArray();

    self.places = ko.observableArray();

    self.Activities = ko.observableArray();


    // retrieves all customers
    self.GetCustomers = function () {
        ajaxHelper(customerUri, 'GET').done(function (data) {
            self.customers(data);
            toastr.success('Select a Customer to see their bookings.')
        })
    }

    //retrieves all bookings
    self.GetBookings = function () {
        ajaxHelper(bookingsUri, 'GET').done(function (data) {
            self.bookings(data);
        })
    }

    //displays create customer form
    self.CreateCustomer = function () {
        $('.panel-body, .createbtn').hide();
        $('#CreateCustomer, #crteCust').show();

    }

    //object to stores customer details
    self.newCustomer = {
        FirstName: ko.observable(),
        LastName: ko.observable(),
        DOB: ko.observable(),
    }

    //posts data to create new customer
    self.CreateNewCustomer = function () {
        ajaxHelper(customerUri, 'POST', self.newCustomer).done(function (data) {
            //clears form
            self.newCustomer.FirstName('')
            self.newCustomer.LastName('')
            self.newCustomer.DOB('')

            self.customers.push(data);// adds new customer to observable array
            $('#CreateCustomer, #crteCust').hide();
            $('.panel-body, .createbtn').show();
        })
    }
    //cancel create customer
    self.CancelCreateCustomer = function () {
        $('#CreateCustomer, #crteCust').hide();
        $('.panel-body, .createbtn').show();
    }
    //observables to store selected customer
    self.CustomerName = ko.observable();
    self.CustomerId = ko.observable();

    //get selected customer bookings
    self.CustomerBookings = function (customer) {
        self.BookingsForCustomer.removeAll()//clear observable Array
        self.CustomerName(customer.FirstName)
        self.CustomerId(customer.Id)
        $('#NewBooking').hide();//add selected customer bookings
        $('#CreateBooking, #AllBookings').show();
        ko.utils.arrayForEach(self.bookings(), function (item) {// sorts through all bookings and picks out the selected customer bookings
            if (item.CustomerId == customer.Id) {
                self.BookingsForCustomer.push(item);                             
            }
        })
    }

    //displays create new booking page
    self.CreateBooking = function () {
        $('#AllBookings').hide();
        $('#NewBooking').show();
        toastr.success('Please select a Country')
    }


    //when user selects country it calls the Trail API and passes it the country as a parameter
    $('.dropdown-menu li').on('click', function () {
        var country = $(this).text();
        self.places.removeAll()
        $.ajax({
            url: uri, // The URL to the API. You can get this by clicking 
            type: 'GET', // The HTTP Method
            data: { 'q[country_cont]': country, 'limit': '20' }, // Additional parameters here
            datatype: 'json',
            success: function (data) {
                $.each(data.places, function (i, v) {
                    self.places.push(v)// add returned data to observable array
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
    self.ActivityId = ko.observable();

    // displays activities for an selected activity centre
    self.CentreActivies = function (centre) {
        $('#Activitydetails').show();

        self.Activities.removeAll();
        self.ActivityId(centre.unique_id);
        ko.utils.arrayForEach(self.places(), function (item) {// finds related activities to selected Activity centre
            if (item.unique_id == centre.unique_id) {
                self.Activities.push(item);

            }
        })

    }


    // object to strore new booking details
    self.NewBooking = {
        Country: ko.observable(),
        City: ko.observable(),
        Activity_Name: ko.observable(),
        BookingDate: ko.observable(),
        Latitude: ko.observable(),
        Longitude: ko.observable(),
        CustomerId: ko.observable()
    }

    // passes booking info to ajax call
    self.BookActivity = function () {
        ko.utils.arrayForEach(self.places(), function (item) {
            if (item.unique_id == self.ActivityId()) {
                var latitude = parseFloat(item.lat)
                var longitude = parseFloat(item.lon)
                var bookingdate = $('#datepicker1').val();
                self.NewBooking.Country(item.country);
                self.NewBooking.City(item.city);
                self.NewBooking.Activity_Name(item.name);
                self.NewBooking.Latitude(latitude);
                self.NewBooking.Longitude(longitude);
                self.NewBooking.BookingDate(bookingdate);
                self.NewBooking.CustomerId(self.CustomerId())

                //posts booking info to web api
                ajaxHelper(bookingsUri, 'POST', self.NewBooking).done(function (data) {
                    self.BookingsForCustomer.push(data);
                    $('#datepicker1').val('')
                    self.GetBookings();
                    toastr.success("Booking Confirmed");
                    $('#NewBooking').hide();
                    $('#AllBookings').show();
                })
            }
        })


    }
    //store deleted booking until the deletion is confirmed
    self.DeletedBooking = ko.observable();

    //store deleted customer until the deletion is confirmed
    self.DeletedCustomer = ko.observable();

    var deleted;

    // show confirm delete booking modal
    self.showModal = function (deleting) {
        deleted = deleting.Id;
        self.DeletedBooking(deleting)
        $('#delete').modal('show');
    };

    // show confirm delete customer modal
    self.showModalDelete = function (deleting) {
        deleted = deleting.Id;
        self.DeletedCustomer(deleting)
        $('#deleteCust').modal('show');
    };

    //delete booking
    self.DeleteBooking = function () {
        ajaxHelper(bookingsUri + deleted, 'Delete').done(function (data) {
            self.GetBookings();
            self.BookingsForCustomer.remove(self.DeletedBooking());//remove the deleted booking form the observable array
            toastr.success('Booking Deleted')
            $('#delete').modal('hide');
        })
    }

    //delete Customer
    self.DeleteCustomer = function () {
        ajaxHelper(customerUri + deleted, 'Delete').done(function (data) {
            self.customers.remove(self.DeletedCustomer());//remove the deleted booking form the observable array
            toastr.success('Customer Deleted')
            $('#CreateBooking, #AllBookings').hide();
            $('#deleteCust').modal('hide');
        })
    }

    // helps displays multiple google maps with different latitude and longitude
    ko.bindingHandlers.googlemap = {
                init: function (element, valueAccessor) {
                    var
                      value = valueAccessor(),
                      latLng = new google.maps.LatLng(value.latitude, value.longitude),
                      mapOptions = {
                          zoom: 10,
                          center: latLng,
                          mapTypeId: google.maps.MapTypeId.ROADMAP
                      },
                      map = new google.maps.Map(element, mapOptions),
                      marker = new google.maps.Marker({
                          position: latLng,
                          map: map
                      });
                }
            };

    



}
$(document).ready(function () {
    toastr.options.preventDuplicates = true;
    var CVM = new CustomersVM;

    //initialises datepickers
    $("#datepicker").datepicker();
    $("#datepicker1").datepicker({
        onSelect: function () {
            var empty = false;
            //check if date has been selected
            if ($(this).val() == '') {
                empty = true;
            }

            if (empty) {
                $('#BookNow').attr('disabled', 'disabled');
            } else {
                $('#BookNow').removeAttr('disabled');
            }
        },
        onClose: function () {
            var empty = false;

            if ($(this).val() == '') {
                empty = true;
            }

            if (empty) {
                $('#BookNow').attr('disabled', 'disabled');
            } else {
                $('#BookNow').removeAttr('disabled');
            }
        }

    });
    $('#crteCust,#CreateBooking').hide();
    CVM.GetCustomers();
    CVM.GetBookings();


    $('#BookNow').attr('disabled', 'disabled')

    ko.applyBindings(CVM)// binds viewModel
})
