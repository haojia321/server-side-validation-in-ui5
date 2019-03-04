sap.ui.define([
	'jquery.sap.global',
	'sap/m/MessageToast',
	'sap/ui/core/Fragment',
	'com/haojia/test/controller/BaseController',
	'sap/ui/model/Filter',
	'sap/ui/model/json/JSONModel'
], function (jQuery, MessageToast, Fragment, Controller, Filter, JSONModel) {
	"use strict";

	return Controller.extend("com.haojia.test.controller.ErrorValidation", {
		onInit: function () {
			var dummyData = {
				form: [{
					title: "title1",
					content: 'cc1'
				}, {
					title: "UI5",
					content: 'SAP'
				}, {
					title: "title3",
					content: 'cc3'
				}],
				createdBy: 'Hao'
			};
			var oModel = new JSONModel(dummyData);

			this.oView = this.getView();
			this._MessageManager = sap.ui.getCore().getMessageManager();
			this.oView.setModel(oModel, "forms");

			this._MessageManager.registerObject(this.oView.byId("formContainer"), true);
			this.oView.setModel(this._MessageManager.getMessageModel(), "message");
			this.createMessagePopover();
		},

		handleMessagePopoverPress: function (oEvent) {
			if (!this.oMP) {
				this.createMessagePopover();
			}
			this.oMP.toggle(oEvent.getSource());
		},
		createMessagePopover: function () {
			var that = this;
			this.oMP = new sap.m.MessagePopover({
				activeTitlePress: function (oEvent) {
					var oItem = oEvent.getParameter("item"),
						oPage = that.oView.byId("messageHandlingPage"),
						oMessage = oItem.getBindingContext("message").getObject(),
						oControl = sap.ui.getCore().byId(oMessage.getControlId());

					if (oControl) {
						oPage.scrollToElement(oControl.getDomRef(), 200, [0, -100]);
						setTimeout(function () {
							oControl.focus();
						}, 300);
					}
				},
				items: {
					path: "message>/",
					template: new sap.m.MessageItem({
						title: "{message>message}",
						subtitle: "{message>additionalText}",

						activeTitle: {
							parts: [{
								path: 'message>controlIds'
							}],
							formatter: this.isPositionable
						},
						type: "{message>type}",
						description: "{message>message}"
					})
				}
			});

			this.oMP._oMessageView.setGroupItems(true);
			this.getView().byId("messagePopoverBtn").addDependent(this.oMP);
		},
		isPositionable: function (sControlId) {
			// Such a hook can be used by the application to determine if a control can be found/reached on the page and navigated to.
			return sControlId ? true : true;
		},
		onSavePress: function (oEvent) {
			var data = this.getView().getModel('forms').getData();
			var validationErrors = this._generateServerSideValidation(data);
			if (validationErrors && validationErrors.length) {
				this.showValidationErrors(validationErrors);
			}
		},
		showValidationErrors: function (errors) {
			sap.ui.getCore().getMessageManager().removeAllMessages();

			for (var i = 0; i < errors.length; i++) {
				sap.ui.getCore().getMessageManager().addMessages(
					new sap.ui.core.message.Message({
						type: sap.ui.core.MessageType.Error,
						message: errors[i].message,
						//additionalText: 'additional text',
						//description: "desc",
						target: errors[i].path,
						processor: this.getView().getModel('forms')
					})
				);
			}
		},
		_generateServerSideValidation: function (data) {
			var errorList = [];
			data = this._generateCurrentLevelPath(data);
			for (var i = 0; i < data.form.length; i++) {
				if (data.form[i].title !== 'UI5') {
					errorList.push({
						path: data.form[i].currentLevelPath + '/title',
						message: 'Title is not UI5'
					});
				}
				if (data.form[i].content !== 'SAP') {
					errorList.push({
						path: data.form[i].currentLevelPath + '/content',
						message: 'Content is not SAP'
					});
				}
			}
			console.log(errorList);
			return errorList;
		},
		_generateCurrentLevelPath: function (data) {
			console.log('before currentLevelPath is generated: ', data);
			data.currentLevelPath = '/';

			var list = data.form;
			var currentLevelPath = '/form';
			for (var i = 0; i < list.length; i++) {
				var listItem = list[i];
				listItem.currentLevelPath = currentLevelPath + '/' + i;
			}
			console.log('after currentLevelPath is generated: ', data);
			return data;
		},
	});

});