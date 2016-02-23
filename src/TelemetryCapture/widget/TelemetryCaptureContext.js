/*global logger*/
/*
    TelemetryCapture
    ========================

    @file      : TelemetryCaptureContext.js
    @version   : 
    @author    : 
    @date      : Tue, 16 Feb 2016 19:16:37 GMT
    @copyright : 
    @license   : Apache 2

    Documentation
    ========================
    Describe your widget here.
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",

    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event",
    "dojo/ready",

    "TelemetryCapture/lib/jquery-1.11.2"
], function (declare, _WidgetBase, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, dojoLang, dojoText, dojoHtml, dojoEvent, ready, _jQuery) {
	"use strict";

	var $ = _jQuery.noConflict(true);

	// Declare widget's prototype.
	return declare("TelemetryCapture.widget.TelemetryCaptureContext", [_WidgetBase], {

		// Parameters configured in the Modeler.
		mfToExecute: "",
		mfEntity: "",
		eventNameAttribute: "",
		eventFormAttribute: "",
		contextEntity: "",
		telemetryEvents: "",

		// Internal variables. Non-primitives created in the prototype are shared between all widget instances.
		_handles: null,
		_alertDiv: null,
		_context: null,
		_observer: null,

		//_contextEntityName: null,
		_contextEntityRef: null,

		// dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
		constructor: function () {
			// Uncomment the following line to enable debug messages
			//logger.level(logger.DEBUG);
			logger.debug(this.id + ".constructor");
			this._handles = [];
		},

		// dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
		postCreate: function () {
			logger.debug(this.id + ".postCreate");

			this._contextEntityRef = this.contextEntity.split('/')[0];
			//this._contextEntityName = this.contextEntity.split('/')[1];
		},

		_setupListeners: function () {
			for (var i = 0; i < this.telemetryEvents.length; i++) {
				var event = this.telemetryEvents[i];

				if (event.checkParent) {
					$(this.domNode).parent().find(event.clickSelector).off("click." + this.id).on("click." + this.id, dojoLang.hitch(this, this._buttonClicked, event));
				} else {
					$(event.clickSelector).off("click." + this.id).on("click." + this.id, dojoLang.hitch(this, this._buttonClicked, event));
				}
			}
		},

		_buttonClicked: function (event) {
			// If a microflow has been set execute the microflow on a click.
			if (this.mfToExecute !== "") {
				mx.data.create({
					entity: this.mfEntity,
					callback: dojoLang.hitch(this, function (event, obj) {
						console.log("Object created on server");
						this._callMicroflow(obj, event);
					}, event),
					error: function (e) {
						console.log("an error occured: " + e);
					}
				});
			}
		},

		_callMicroflow: function (mxObj, event) {
			//Code here for setting attributes!
			mxObj.set(this.eventNameAttribute, event.eventName);
			mxObj.set(this.eventFormAttribute, this.mxform.title);

			mxObj.addReference(this._contextEntityRef, this._context.getGuid());

			mx.data.action({
				params: {
					applyto: "selection",
					actionname: this.mfToExecute,
					guids: [mxObj.getGuid()]
				},
				store: {
					caller: this.mxform
				},
				callback: function (obj) {
					//TODO what to do when all is ok!
				},
				error: dojoLang.hitch(this, function (error) {
					console.log(this.id + ": An error occurred while executing microflow: " + error.description);
				})
			}, this);
		},

		// mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
		update: function (obj, callback) {
			logger.debug(this.id + ".update");
			this._context = obj;

			ready(dojoLang.hitch(this, this._setupMutationObserver));

			callback();
		},

		_setupMutationObserver: function () {
			MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

			this._observer = new MutationObserver(dojoLang.hitch(this, this._setupListeners));

			// define what element should be observed by the observer
			// and what types of mutations trigger the callback
			this._observer.observe(this.domNode.parentNode, {
				subtree: true,
				childList: true,
				attributes: false,
				characterData: false,
				attributeOldValue: false,
				characterDataOldValue: false
			});
			
			this._setupListeners();
		},

		// mxui.widget._WidgetBase.enable is called when the widget should enable editing. Implement to enable editing if widget is input widget.
		enable: function () {
			logger.debug(this.id + ".enable");
		},

		// mxui.widget._WidgetBase.enable is called when the widget should disable editing. Implement to disable editing if widget is input widget.
		disable: function () {
			logger.debug(this.id + ".disable");
		},

		// mxui.widget._WidgetBase.resize is called when the page's layout is recalculated. Implement to do sizing calculations. Prefer using CSS instead.
		resize: function (box) {
			logger.debug(this.id + ".resize");
		},

		// mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
		uninitialize: function () {
			logger.debug(this.id + ".uninitialize");
			// Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
			this._observer.disconnect();
			
			for (var i = 0; i < this.telemetryEvents.length; i++) {
				var event = this.telemetryEvents[i];

				if (event.checkParent) {
					$(this.domNode).parent().find(event.clickSelector).off("click." + this.id);
				} else {
					$(event.clickSelector).off("click." + this.id);
				}
			}
		}
	});
});

require(["TelemetryCapture/widget/TelemetryCaptureContext"], function () {
	"use strict";
});