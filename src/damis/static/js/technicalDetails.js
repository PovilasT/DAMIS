(function() {
	window.technicalDetails = {
		// initialization upon dialog creation
		init: function(componentType, formWindow) {
			if (componentType == 'TECHNICAL DETAILS') {
				if (formWindow.find("input[name$=source_ref]").val()) {
					// editing workflow: a connection already exists 
					this.update(formWindow);
				} else {
					// new workflow: 
					this.toUnconnectedState(formWindow);
				}
			}
		},

		// prepare dialog, when component is unconnected 
		toUnconnectedState: function(formWindow) {
			formWindow.find(".technical-details-container").remove();
			var container = $("<div class=\"technical-details-container\">" + gettext("This component should be connected to an executed task in order to view results.") + "</div>");
			formWindow.append(container);
			formWindow.dialog("option", "buttons", window.taskBoxes.defaultDialogButtons());
			formWindow.dialog("option", "minWidth", 0);
			formWindow.dialog("option", "width", 300);
		},

		// all buttons for this component
		allButtons: function() {
			var buttons = [{
				text: gettext('Download'),
				class: "btn btn-primary",
				click: function(ev) {

				}
			}];
			var defaultButtons = window.taskBoxes.defaultDialogButtons();
			return buttons.concat(defaultButtons);
		},

		// update dialog content with new data
		update: function(formWindow) {
			var url = window.componentFormUrls['TECHNICAL DETAILS'];
			formWindow.find(".technical-details-container").remove();
			var container = $("<div class=\"technical-details-container\"><img src=\"static/img/loading.gif\"/></div>");
			formWindow.append(container);
			var data = window.technicalDetails.getOutputParamDetails(formWindow);
			$.ajax({
				url: url,
				data: data,
				context: container
			}).done(function(resp) {
				$(this).html(resp);
				if (!/<[a-z][\s\S]*>/i.test(resp)) {
					// non-html (failure) response
				} else {
					formWindow.dialog("option", "buttons", window.technicalDetails.allButtons());
					formWindow.dialog("option", "minWidth", 0);
					formWindow.dialog("option", "width", "auto");
				}
			});
		},

		// get details of a parameter, that is connected to the current component input connection
		getOutputParamDetails: function(dialog) {
			var inParam = dialog.find("input[value=INPUT_CONNECTION]");
			var srcRefField = inParam.closest("div").find("input[id$=source_ref]");
			var oParamField = window.experimentForm.getOutputParam(srcRefField);
			if (oParamField) {
				return {
					pv_name: oParamField.attr("name"),
					dataset_url: oParamField.val()
				}
			}
			return {}
		},

		// called when connection is established
		connectionEstablished: function(srcComponentType, targetComponentType, connectionParams) {
			if (targetComponentType == 'TECHNICAL DETAILS') {
				this.update($("#" + window.taskBoxes.getFormWindowId(connectionParams.iTaskBoxId)));
			}
		},

		// called when connection is deleted
		connectionDeleted: function(srcComponentType, targetComponentType, connectionParams) {
			if (srcComponentType == 'TECHNICAL DETAILS' || targetComponentType == 'TECHNICAL DETAILS') {
				var formWindow = $("#" + window.taskBoxes.getFormWindowId(connectionParams.iTaskBoxId));
				this.toUnconnectedState(formWindow);
			}
		}
	}
})();

