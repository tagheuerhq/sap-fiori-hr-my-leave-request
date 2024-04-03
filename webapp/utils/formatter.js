jQuery.sap.require("hcm.fab.myleaverequest.utils.formatters");

sap.ui.define([
	"hcm/fab/myleaverequest/utils/formatters"
], function (formatters) {

	formatters.isTimePickerAvailable = function (bMultiOrSingleDayRadioGroupIndex, bShowTimePicker) {
		// Show Time Picker in case of half-days
		if (bMultiOrSingleDayRadioGroupIndex >= 1 && !!bShowTimePicker) {
			return true;
		} else {
			return false;
		}
	}

	formatters.isTimePickerEnabled = function (oStartDate, sSelectedAbsenceTypeCode, bInputHoursFilled,
		bMultiOrSingleDayRadioGroupIndex) {
		// Disable Time Picker in case of half-days
		if (bMultiOrSingleDayRadioGroupIndex && bMultiOrSingleDayRadioGroupIndex > 1) {
			return false;
		} else {
			return formatters.isGroupEnabled(oStartDate, sSelectedAbsenceTypeCode) && !bInputHoursFilled;
		}
	}
});