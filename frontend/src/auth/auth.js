angular.module('Auth', [])

.factory('AuthService', ['$http', '$rootScope', function($http, $rootScope) {
    var credentials = {
        username: undefined,
        password: undefined
    };
    return {
        login: function (username, password) {
            credentials.username = username;
            credentials.password = password;

            var encoded = btoa(username + ':' + password);
            $http.defaults.headers.common.Authorization = 'Basic ' + encoded;
            return $http
                .get('http://localhost:8000/api/users/by_name/' + username + '/')
                .success(function(data) {
                    $rootScope.$broadcast('Login', {
                        username: credentials.username,
                        password: credentials.password,
                        first_name: data.first_name,
                        last_name: data.last_name,
                        region: data.extra.region,
                        office: data.extra.office
                    });
                })
                .error(function(message) {
                    $rootScope.$broadcast('LoginFailed', message);
                });
        },
        logout: function () {
            credentials.username = undefined;
            credentials.password = undefined;

            $http.defaults.headers.common.Authorization = 'Basic ';

            $rootScope.$broadcast('Logout');
        },
        isAuthenticated: function () {
            return !!credentials.username;
        }
    };
}]);
