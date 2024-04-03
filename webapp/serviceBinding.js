function initModel() {
	var sUrl = "/sap/opu/odata/sap/ZHR_HCMFAB_LEAVE_REQUEST_CR_SRV/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}