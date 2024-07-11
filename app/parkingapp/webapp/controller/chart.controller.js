sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel"
    ],
    function(BaseController,JSONModel) {
      "use strict";
  
      return BaseController.extend("com.app.parkingapp.controller.chart", {
        onInit: function() {
        	// this._setIceCreamModel();
    },

_setIceCreamModel:function(){

        // var aData = {
        //         Items : [  
        //             {
        //                 Flavor:"Blue Moon",
        //                 Sales : 700
        //             },
        //             {
        //                 Flavor:"Matcha Green Tea",
        //                 Sales : 1100
        //             },
        //             {
        //                 Flavor:"ButterScotch",
        //                 Sales : 1400
        //             },
        //             {
        //                 Flavor:"Black Current",
        //                 Sales : 560
        //             }
        //             ]
        // }
        // var oIceCreamModel = new JSONModel();
        // oIceCreamModel.setData(aData);
        // this.getView().setModel(oIceCreamModel, "IceCreamModel");
},

chartfunction:function(){
    // var oModel = this.getView().getModel("ModelV2");

    // this.getView().byId("idreservependingtable").getModel();
}




      });
    }
  );
  