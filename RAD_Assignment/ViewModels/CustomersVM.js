var CustomersVM = function () {
    var self = this;

    //Ajax helper
    function ajaxHelper(uri, method, data) {
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: data ? JSON.stringify(data) : null
        }).fail(function (jqXHR, textStatus, errorThrown) {
            toastr.error("oops something went wrong")
        });
    }
    var customerUri = '/api/customers/'
    var bookingsUri = '/api/bookings/'

    self.customers = ko.observableArray();

    self.bookings = ko.observableArray();

    self.GetCustomers = function () {
        ajaxHelper(customerUri, 'GET').done(function (data) {
            self.customers(data);
            toastr.success('Select a Customer to see their bookings.')
        })
    }

    

}
$(document).ready(function () {
    var CVM = new CustomersVM;

    CVM.GetCustomers();

    ko.applyBindings(CVM)
})