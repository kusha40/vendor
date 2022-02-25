function ViewModel() {
    var self = this;

    self.Name = ko.observable('');
    self.Email = ko.observable('');
    self.Details = ko.observable('');

    self.AdditionalDetails = ko.observable('');
    self.availableTypes = ko.observableArray(['New', 'Open', 'Closed']);
    self.chosenType = ko.observable('');

    self.availableCountries = ko.observableArray(['France', 'Germany', 'Spain', 'United States', 'Mexico']),
        self.chosenCountries = ko.observableArray([]); // Initially, only Germany is selected


}

var viewModel = new ViewModel();

ko.applyBindings(viewModel);

$(document).on("msf:viewChanged", function (event, data) {
    var progress = Math.round((data.completedSteps / data.totalSteps) * 100);

    $(".progress-bar").css("width", progress + "%").attr('aria-valuenow', progress);
});

$(".msf:first").multiStepForm({
    activeIndex: 0,
    validate: {},
    hideBackButton: false,
    allowUnvalidatedStep: false,
    allowClickNavigation: true
});