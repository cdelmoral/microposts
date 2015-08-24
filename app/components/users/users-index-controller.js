(function() {
'use strict';

angular
    .module('angularjsTutorial.users')
    .controller('UsersIndexCtrl', UsersIndexCtrl);

UsersIndexCtrl.$inject = ['PageSvc', 'UsersService'];

function UsersIndexCtrl(pageSvc, usersService) {
    var ctrl = this;

    ctrl.users = [];

    initializeController();

    function initializeController() {
        pageSvc.setPageTitle('Users');

        usersService.getUsers().success(function(users) {
            ctrl.users = users;
        }).error(function(data, status) {
            console.log(data, status);
            ctrl.users = [];
        });
    }
}

})();