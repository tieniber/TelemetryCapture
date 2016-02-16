/*global logger*/
/*
    TelemetryCapture
    ========================

    @file      : TelemetryCapture.js
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

    "TelemetryCapture/lib/jquery-1.11.2"
], function (declare, _WidgetBase, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, dojoLang, dojoText, dojoHtml, dojoEvent, _jQuery) {
    "use strict";

    var $ = _jQuery.noConflict(true);

    // Declare widget's prototype.
    return declare("TelemetryCapture.widget.TelemetryCapture", [ _WidgetBase ], {

        // Parameters configured in the Modeler.
        mfToExecute: "",
        mfEntity: "",
        eventAttribute: "",
		eventName: "",
		jSelector: "",

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _handles: null,
        _alertDiv: null,

        // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
        constructor: function() {
            // Uncomment the following line to enable debug messages
            //logger.level(logger.DEBUG);
            logger.debug(this.id + ".constructor");
            this._handles = [];
        },

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function() {
            logger.debug(this.id + ".postCreate");
			
			$(document).on("click", this.jSelector, dojoLang.hitch(this, this._buttonClicked));
		
        },

		_buttonClicked: function() {
			// If a microflow has been set execute the microflow on a click.
			if (this.mfToExecute !== "") {
				mx.data.create({
					entity: this.mfEntity,
					callback: dojoLang.hitch(this, function(obj) {
						console.log("Object created on server");
						this._callMicroflow(obj);
					}),
					error: function(e) {
						console.log("an error occured: " + e);
					}
				});
			}
		},
		
		_callMicroflow: function (obj) {
			//Code here for setting attributes!
			obj.setAttribute(this.eventAttribute,this.eventName);

			mx.data.action({
				params: {
					applyto: "selection",
					actionname: this.mfToExecute,
					guids: [ obj.getGuid() ]
				},
				store: {
					caller: this.mxform
				},
				callback: function(obj) {
					//TODO what to do when all is ok!
				},
				error: dojoLang.hitch(this, function(error) {
					console.log(this.id + ": An error occurred while executing microflow: " + error.description);
				})
			}, this);
		},
		
        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function(obj, callback) {
            logger.debug(this.id + ".update");

            callback();
        },

        // mxui.widget._WidgetBase.enable is called when the widget should enable editing. Implement to enable editing if widget is input widget.
        enable: function() {
          logger.debug(this.id + ".enable");
        },

        // mxui.widget._WidgetBase.enable is called when the widget should disable editing. Implement to disable editing if widget is input widget.
        disable: function() {
          logger.debug(this.id + ".disable");
        },

        // mxui.widget._WidgetBase.resize is called when the page's layout is recalculated. Implement to do sizing calculations. Prefer using CSS instead.
        resize: function(box) {
          logger.debug(this.id + ".resize");
        },

        // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
        uninitialize: function() {
          logger.debug(this.id + ".uninitialize");
            // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
        }
    });
});

require(["TelemetryCapture/widget/TelemetryCapture"], function() {
    "use strict";
});
