sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller'
], function (jQuery, Controller) {
	"use strict";

	var BaseController = Controller.extend("com.haojia.test.controller.BaseController", {

		getComponent: function () {
			return sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.getView()));
		},

		getEventBus: function () {
			return sap.ui.getCore().getEventBus();
		},

		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		}
	});

	return BaseController;

});