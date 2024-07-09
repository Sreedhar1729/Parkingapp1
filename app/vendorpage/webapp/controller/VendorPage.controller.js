sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment"
],
    function (Controller) {
        "use strict";

        return Controller.extend("com.app.vendorpage.controller.VendorPage", {
            onInit: function () {
                var oModel = new sap.ui.model.odata.v2.ODataModel("https://port4004-workspaces-ws-tltdr.us10.trial.applicationstudio.cloud.sap/v2/odata/v4/parking/");
                this.getView().setModel(oModel);

            },
            onReservePress: async function () {
                this.oDialog ??= await this.loadFragment({
                    name: "com.app.vendorpage.fragments.vendorRes"
                })
                this.oDialog.open();
            },
            onCloseDialog: function () {

                this.byId("idresevednd").close();
            },
            // confirming Reservation
            onConfirmDialog: function () {
                // getting  values from the form input
                const oTruckNo = this.byId("idventruckno").getValue(),
                    oDriverName = this.byId("idvendrivername").getValue(),
                    oDriverMob = this.byId("idvenddrivermob").getValue(),
                    oVendorName = this.byId("idvednorval").getValue();
                // Create a new Date object
                var currentDate = new Date();

                // Extract date components
                var exitDate1 = currentDate.getFullYear() + '-' +
                    ('0' + (currentDate.getMonth() + 1)).slice(-2) + '-' +
                    ('0' + currentDate.getDate()).slice(-2);

                // Extract time components
                var exitTime1 = ('0' + currentDate.getHours()).slice(-2) + ':' +
                    ('0' + currentDate.getMinutes()).slice(-2) + ':' +
                    ('0' + currentDate.getSeconds()).slice(-2);
                debugger
                const oModel = this.getOwnerComponent().getModel("ModelV2");
                const oSample = new sap.ui.model.json.JSONModel({
                    truckNo: oTruckNo,
                    driverName: oDriverName,
                    driverMob: oDriverMob,
                    resStartDate: exitDate1,
                    resStartTime: exitTime1,
                    confDate: "",
                    confTime: "",
                    vendorName: oVendorName,
                    res_staus: false,
                    parkinglot_id: " "
                });
                this.getView().setModel(oSample,"oSample")
               
                debugger
                oModel.create("/ReserveParking", oSample.getData(), {
                    success: function (odata) {
                        sap.m.MessageToast.show("Successfully Reserved!!!!!");
                        this.byId("idresevednd").close();
                        console.log("succcessfully Reserved!!!!");
                        oModel.refresh(true);
                    }, error: function (oError) {

                    }
                })

            }
        });
    });
