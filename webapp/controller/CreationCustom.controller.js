sap.ui.define([
	"hcm/fab/myleaverequest/HCMFAB_LEAV_MANExtension/utils/formatter",
	"hcm/fab/myleaverequest/controller/Creation.controller",
	"hcm/fab/lib/common/util/DateUtil",
], function (formatter, CreationController, DateUtil) {

	return sap.ui.controller("hcm.fab.myleaverequest.HCMFAB_LEAV_MANExtension.controller.CreationCustom", {

		_updateLocalModel: function (oAdditionalFieldPaths, oAbsenceTypeData, oStartDateUTC, oEndDateUTC) {
			CreationController.prototype._updateLocalModel.apply(this, arguments);
			
			this.oCreateModel.setProperty("/allowedDurationHalfdayMorningInd", oAbsenceTypeData.IsAllowedDurationHalfdayMorning);
			this.oCreateModel.setProperty("/allowedDurationHalfdayAfternoonInd", oAbsenceTypeData.IsAllowedDurationHalfdayAfternoon);
		},

		onSingleMultiDayRadioSelected: function (oEvent) {

			if (this.oCreateModel.getProperty("/multiOrSingleDayRadioGroupIndex") > 1) {
				this._updateHalfDayTime(this.getSelectedAbsenceTypeControl().getBindingContext().getObject());
			} else if (this.oCreateModel.getProperty("/prevMultiOrSingleDayRadioGroupIndex") && this.oCreateModel.getProperty(
					"/prevMultiOrSingleDayRadioGroupIndex") > 1) {
				var sPath = this.getView().getBindingContext().getPath();
				this.oODataModel.setProperty(sPath + "/StartTime", "");
				this.oODataModel.setProperty(sPath + "/EndTime", "");
				this._updateCalcLeaveDays();
			}

			CreationController.prototype.onSingleMultiDayRadioSelected.apply(this, arguments);

			this.oCreateModel.setProperty("/prevMultiOrSingleDayRadioGroupIndex", this.oCreateModel.getProperty(
				"/multiOrSingleDayRadioGroupIndex"));
		},

		onDatePickChanged: function (oEvent) {

			if (this.oCreateModel.getProperty("/multiOrSingleDayRadioGroupIndex") > 1) {
				this._updateHalfDayTime(this.getSelectedAbsenceTypeControl().getBindingContext().getObject());
			} else {
				var sPath = this.getView().getBindingContext().getPath();
				this.oODataModel.setProperty(sPath + "/StartTime", "");
				this.oODataModel.setProperty(sPath + "/EndTime", "");
			}

			CreationController.prototype.onDatePickChanged.apply(this, arguments);
		},

		_updateHalfDayTime: function (oAbsenceTypeData) {
			var oParams = {
					AbsenceTypeCode: oAbsenceTypeData.AbsenceTypeCode,
					EmployeeID: oAbsenceTypeData.EmployeeID,
					InfoType: oAbsenceTypeData.InfoType
				},
				sPath = this.getView().getBindingContext().getPath(),
				oStartDateUTC = DateUtil.convertToUTC(this.oCreateModel.getProperty("/oLeaveStartDate"));

			if (oStartDateUTC) {
				oParams.StartDate = oStartDateUTC;
				oParams.EndDate = oStartDateUTC;
				oParams.IsFirstHalf = this.oCreateModel.getProperty("/multiOrSingleDayRadioGroupIndex") === 2;

				this._callHalfDayTimeFunctionImport(oParams).then((oHalfDayTime) => {
						this.oODataModel.setProperty(sPath + "/StartTime", oHalfDayTime.CalculateHalfDayTime.BeginTime);
						this.oODataModel.setProperty(sPath + "/EndTime", oHalfDayTime.CalculateHalfDayTime.EndTime);
						this._updateCalcLeaveDays();
						this._closeBusyDialog();
					},
					(oError) => {
						this.oODataModel.setProperty(sPath + "/StartTime", "");
						this.oODataModel.setProperty(sPath + "/EndTime", "");
						this._closeBusyDialog();
					});
			}
		},

		_callHalfDayTimeFunctionImport: function (oParams) {
			return new Promise((fnResolve, fnReject) => {
				this.oODataModel.callFunction("/CalculateHalfDayTime", {
					method: "GET",
					groupId: "halfDayTime",
					urlParameters: oParams,
					success: (oResult) => {
						fnResolve(oResult);
					},
					error: (oError) => {
						fnReject(oError);
					}
				});
			});
		},

	});
});