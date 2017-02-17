/**
 * INSPINIA - Responsive Admin Theme
 *
 * Inspinia theme use AngularUI Router to manage routing and views Each view are
 * defined as state. Initial there are written state for all view in theme.
 *
 */
function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, USER_ROLES) {
    $urlRouterProvider.otherwise("/index/main");

    $ocLazyLoadProvider.config({
	// Set to true if you want to see what and when is dynamically loaded
	debug : false
    });

    $stateProvider

    .state('index', {
	abstract : true,
	url : "/index",
	templateUrl : "views/common/content.html",
	access : {
	    loginRequired : true,
	    authorizedRoles : [ USER_ROLES.all ]
	}
    }).state('index.main', {
	url : "/main",
	templateUrl : "views/main.html",
	data : {
	    pageTitle : 'Example view'
	},
	access : {
	    loginRequired : true,
	    authorizedRoles : [ USER_ROLES.admin ]
	}
    }).state('index.minor', {
	url : "/minor",
	templateUrl : "views/minor.html",
	data : {
	    pageTitle : 'Example view'
	},
	access : {
	    loginRequired : true,
	    authorizedRoles : [ USER_ROLES.all ]
	}
    }).state('login', {
	url : "/login",
	templateUrl : "views/public/login.html",
	data : {
	    pageTitle : 'Example view'
	},
	access : {
	    loginRequired : false,
	    authorizedRoles : [ USER_ROLES.all ]
	}
    })
};

myapp.constant('USER_ROLES', {
    all : '*',
    admin : 'admin',
    user : 'user'
});

angular.module('inspinia').config(config).run(function($rootScope, $state, $location, $http, AuthSharedService, Session, USER_ROLES, $q, $timeout) {

    $rootScope.$state = $state;

    $rootScope.$on('$routeChangeStart', function(event, next) {

	if (next.originalPath === "/login" && $rootScope.authenticated) {
	    event.preventDefault();
	} else if (next.access && next.access.loginRequired && !$rootScope.authenticated) {
	    event.preventDefault();
	    $rootScope.$broadcast("event:auth-loginRequired", {});
	} else if (next.access && !AuthSharedService.isAuthorized(next.access.authorizedRoles)) {
	    event.preventDefault();
	    $rootScope.$broadcast("event:auth-forbidden", {});
	}
    });

    $rootScope.$on('$routeChangeSuccess', function(scope, next, current) {
	$rootScope.$evalAsync(function() {
	    $.material.init();
	});
    });

    // Call when the the client is confirmed
    $rootScope.$on('event:auth-loginConfirmed', function(event, data) {
	console.log('login confirmed start ' + data);
	$rootScope.loadingAccount = false;
	var nextLocation = ($rootScope.requestedUrl ? $rootScope.requestedUrl : "/home");
	var delay = ($location.path() === "/loading" ? 1500 : 0);

	$timeout(function() {
	    Session.create(data);
	    $rootScope.account = Session;
	    $rootScope.authenticated = true;
	    $location.path(nextLocation).replace();
	}, delay);

    });

    // Call when the 401 response is returned by the server
    $rootScope.$on('event:auth-loginRequired', function(event, data) {
	if ($rootScope.loadingAccount && data.status !== 401) {
	    $rootScope.requestedUrl = $location.path()
	    $location.path('/loading');
	} else {
	    Session.invalidate();
	    $rootScope.authenticated = false;
	    $rootScope.loadingAccount = false;
	    $location.path('/login');
	}
    });

    // Call when the 403 response is returned by the server
    $rootScope.$on('event:auth-forbidden', function(rejection) {
	$rootScope.$evalAsync(function() {
	    $location.path('/error/403').replace();
	});
    });

    // Call when the user logs out
    $rootScope.$on('event:auth-loginCancelled', function() {
	$location.path('/login').replace();
    });

    // Get already authenticated user account
    AuthSharedService.getAccount();

});