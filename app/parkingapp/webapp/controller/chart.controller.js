sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
  "use strict";

  return Controller.extend("com.app.parkingapp.controller.chart", {
      
      onInit: function() {
          this._setParkingLotModel();
      },

      _setParkingLotModel: function() {
          var oModel = this.getOwnerComponent().getModel("ModelV2");
          var that = this;

          oModel.read("/ParkingLot", {
              success: function(oData) {
                  var aItems = oData.results;
                  var NotavailableCount = aItems.filter(item => item.avialable === "Not Available").length;
                  var AvailableCount = aItems.filter(item => item.avialable === "Available").length;
                  var reserveCount = aItems.filter(item => item.avialable === "Reserved").length;

                  var aChartData = {
                      Items: [{
                              Status: "Available",
                              Count: AvailableCount
                          },
                          {
                              Status: "Not Available",
                              Count: NotavailableCount
                          },
                          {
                              Status: "Reserved",
                              Count: reserveCount
                          }
                      ]
                  };

                  var oParkingLotModel = new JSONModel();
                  oParkingLotModel.setData(aChartData);
                  that.getView().setModel(oParkingLotModel, "ParkingLotModel");
              },
              error: function(oError) {
                  console.error(oError);
              }
          });
      },

      myOnClickHandler: function(oEvent) {
          // Handle click event
      },

      handleRenderComplete: function(oEvent) {
          // Handle render complete event
      }

  });
});
