sap.ui.define([
	'jquery.sap.global',
	'sap/m/MessageToast',
	'sap/ui/core/Fragment',
	'com/haojia/test/controller/BaseController',
	'sap/ui/model/Filter',
	'sap/ui/model/json/JSONModel'
], function (jQuery, MessageToast, Fragment, Controller, Filter, JSONModel) {
	"use strict";

	return Controller.extend("com.haojia.test.controller.Main", {
		onInit: function () {
			sap.ui.core.UIComponent.getRouterFor(this).getRoute("Main").attachPatternMatched(this.onRoutePatternMatched, this);
		},
		onRoutePatternMatched: function (oEvent) {
			var sRoute = oEvent.getParameter("name");
			this.getRouter().navTo(sRoute, null, true);
		},
		onLinkClick: function (e) {
			this.getRouter().navTo(e.getSource().data('viewName'));
		}
	});

});