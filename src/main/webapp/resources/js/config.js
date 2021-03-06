/**
 * INSPINIA - Responsive Admin Theme
 *
 * Inspinia theme use AngularUI Router to manage routing and views Each view are
 * defined as state. Initial there are written state for all view in theme.
 *
 */
function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, USER_ROLES) {
    $urlRouterProvider.otherwise("/index/cadastrar-interesse");

    $ocLazyLoadProvider.config({
	// Set to true if you want to see what and when is dynamically loaded
	debug : false
    });

    $stateProvider

    .state('index', {
	abstract : true,
	url : "/index",
	templateUrl : "resources/views/common/content.html",
	access : {
	    loginRequired : true,
	    authorizedRoles : [ USER_ROLES.all ]
	}
    }).state('index.main', {
	url : "/main",
	templateUrl : "resources/views/main.html",
	data : {
	    pageTitle : 'Menu Principal'
	},
	access : {
	    loginRequired : true,
	    authorizedRoles : [ USER_ROLES.all ]
	}
    }).state('login', {
	url : "/login",
	templateUrl : "resources/views/login.html",
	bodyClass: 'gray-bg',
	data: { pageTitle: 'Login' },
	resolve: {
            loadPlugin: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    {
                        files: ['resources/css/plugins/iCheck/custom.css','resources/js/vendor/plugins/iCheck/icheck.min.js']
                    }
                ]);
            }
        },
	access : {
	    loginRequired : false,
	    authorizedRoles : [ USER_ROLES.all ]
	}
    }).state('loading', {
	url : "/loading",
	templateUrl : "resources/views/common/loading.html",
	data : {
	    pageTitle : 'Example view'
	},
	access : {
	    loginRequired : false,
	    authorizedRoles : [ USER_ROLES.all ]
	}
    }).state('cadastrar-usuario', {
    	url : "/cadastrar-usuario",
    	templateUrl : "resources/views/cadastrar-usuario.html",
    	data : {
    	    pageTitle : 'Cadastro Usuario'
    	},
    	resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['resources/css/plugins/iCheck/custom.css','resources/js/vendor/plugins/iCheck/icheck.min.js']
                        }
                    ]);
                }
            },
    	access : {
    	    loginRequired : false,
    	    authorizedRoles : [ USER_ROLES.all ]
    	}
    }).state('index.cadastrar-interesse', {
	url : "/cadastrar-interesse",
	templateUrl : "resources/views/cadastrar-interesse.html",
	data : {
	    pageTitle : 'Example view'
	},
	resolve: {
            loadPlugin: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    {
                        files: ['resources/css/plugins/iCheck/custom.css','resources/js/vendor/plugins/iCheck/icheck.min.js']
                    }
                ]);
            }
        },
	access : {
	    loginRequired : true,
	    authorizedRoles : [ USER_ROLES.all ]
	}
    }).state('index.listar-interesses', {
    	url : "/listar-interesses",
    	templateUrl : "resources/views/listar-interesses.html",
    	data : {
    	    pageTitle : 'Example view'
    	},
    	resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['resources/css/plugins/iCheck/custom.css','resources/js/vendor/plugins/iCheck/icheck.min.js']
                        }
                    ]);
                }
            },
    	access : {
    	    loginRequired : true,
    	    authorizedRoles : [ USER_ROLES.all ]
    	}
        }).state("error", {
        url: "/error/:code",
        templateUrl: "resources/views/common/error.html",
        controller: "ErrorController",
        access: {
            loginRequired: false,
            authorizedRoles: [USER_ROLES.all]
        }
    });
};

inspiniaApp.constant('USER_ROLES', {
    all : '*',
    admin : 'admin',
    user : 'user'
});

inspiniaApp.config(config).run(function($rootScope, $state, $location, $http, AuthSharedService, Session, USER_ROLES, $q, $timeout) {

    $rootScope.$state = $state;
    $rootScope.bodyClass = 'gray-bg';

    $rootScope.$on('$stateChangeStart', function(event, next) {

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

//    $rootScope.$on('$stateChangeSuccess', function(scope, next, current) {
//	$rootScope.$evalAsync(function() {
//	    //Verificar
//	    $.inspiniaApp.init();
//	});
//    });

    // Call when the the client is confirmed
    $rootScope.$on('event:auth-loginConfirmed', function(event, data) {
    $rootScope.bodyClass = undefined;
	console.log('login confirmed start ' + data);
	$rootScope.loadingAccount = false;
	var nextLocation = ($rootScope.requestedUrl ? $rootScope.requestedUrl : "/index");
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
	    $state.go('loading');
	} else {
		$rootScope.bodyClass = 'gray-bg';
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
    $rootScope.bodyClass = 'gray-bg';
	$location.path('/login').replace();
    });

    // Get already authenticated user account
    AuthSharedService.getAccount();

});
