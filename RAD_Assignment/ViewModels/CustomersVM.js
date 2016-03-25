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
        ajaxHelper(customerUri, 'POST', self.newCustomer).done(function (data) {
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
        self.BookingsForCustomer.removeAll()//clear observable Array
        self.CustomerName(customer.FirstName)
        self.CustomerId(customer.Id)

        ko.utils.arrayForEach(self.bookings(), function (item) {
            if (item.CustomerId == customer.Id) {
                self.BookingsForCustomer.push(item);
                $('#NewBooking').hide();//add selected customer bookings
                $('#CreateBooking, #AllBookings').show();
                             
            }
        })
    }

    self.CreateBooking = function () {
        $('#AllBookings').hide();
        $('#NewBooking').show();
        toastr.success('Click on booking to see activities')
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
                $.each(data.places, function (i, v) {
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
    self.ActivityId = ko.observable();

    self.CentreActivies = function (centre) {
        $('#Activitydetails').show();

        self.Activities.removeAll();
        self.ActivityId(centre.unique_id);
        ko.utils.arrayForEach(self.places(), function (item) {
            if (item.unique_id == centre.unique_id) {
                self.Activities.push(item);

            }
        })

    }



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

                ajaxHelper(bookingsUri, 'POST', self.NewBooking).done(function (data) {
                    self.BookingsForCustomer.push(data);
                    toastr.success("Booking Confirmed");
                    $('#NewBooking').hide();
                    $('#AllBookings').show();
                })
            }
        })


    }
    self.DeletedId = ko.observable();

    self.DeleteBooking = function (booking) {
        $.ajax({
            url: bookingsUri + booking.Id,
            type:'DELETE',
            success: function (data) {
                self.BookingsForCustomer.remove(data);
                toastr.success('Booking Deleted')
            },
            error: function () {
                toastr.error('Sorry. Booking Not Deleted')
            }
        })

    }
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

    $("#datepicker").datepicker();
    $("#datepicker1").datepicker({
        onSelect: function () {
            var empty = false;

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

    ko.applyBindings(CVM)
})
