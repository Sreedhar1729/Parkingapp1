sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Token",
],
    function (Controller, ODataModel, Filter, FilterOperator,Token) {
        "use strict";

        return Controller.extend("com.app.parkingapp.controller.Home", {
            onInit: function () {
                // Tokens

                const oView = this.getView(),
                oMulti1 = this.oView.byId("_IDGenMultiInput1");
                 

            let validae = function (arg) {
                if (true) {
                    var text = arg.text;
                    return new sap.m.Token({ key: text, text: text });
                }
            }
            oMulti1.addValidator(validae);


            },
            // Controller logic
            onItemSelect: function (oEvent) {
                var itemKey = oEvent.getParameter("item").getKey();
                var navContainer = this.getView().byId("idNavContainer");

                // Navigate to the corresponding page based on the selected key
                switch (itemKey) {
                    case "RouteParkingSlot":
                        navContainer.to(this.getView().createId("root3"));
                        break;
                    case "Home":
                        navContainer.to(this.getView().createId("root2"));
                        break;
                    case "RouteReserve":
                        navContainer.to(this.getView().createId("root4"));
                        break;
                    case "parkingslotAssign":
                        navContainer.to(this.getView().createId("idparkingassign"));
                        break;
                    case "root1":
                        navContainer.to(this.getView().createId("root1"));
                    default:
                        break;
                }
            },
            // for filters
            onGoPress: function (oEvent) {

                const oview = this.getView(),
                    oParkingSlotFilter = oview.byId("inward"),
                    oParkingno = oview.byId("_IDGenMultiInput1"),
                    sParkingSlotNumber = oParkingSlotFilter.getSelectedKey(),
                    sParkingno = oParkingno.getTokens(),
                    oTable = oview.byId("idparkingslottable"),
                    aFilters = [];

                sParkingSlotNumber ? aFilters.push(new Filter("inward", FilterOperator.EQ, sParkingSlotNumber)) : "";
                // sParkingno ? aFilters.push(new Filter("id", FilterOperator.EQ, sParkingno)) : "";
                sParkingno.filter((ele) => {
                    ele ? aFilters.push(new Filter("id", FilterOperator.EQ, ele.getKey())) : " ";
                })
                oTable.getBinding("items").filter(aFilters);

            },
            // clearing filters
            onClearFilterPress: function () {
                const oView = this.getView(),
                    oParkingno = oView.byId("_IDGenMultiInput1").setValue(),
                    oParkingSlotFilter = oView.byId("inward").setValue();
            },
            onDelete: function(oEvent) {
                var oTable = this.getView().byId("idparkingslottable");
                var aSelectedItems = oTable.getSelectedItems();
            
                aSelectedItems.forEach(function (oSelectedItem) {
                    var aISBNs = [];
                    var sISBN = oSelectedItem.getBindingContext().getObject().id;
                    aISBNs.push(sISBN);

                    oSelectedItem.getBindingContext().delete("$auto");
                });
                 oTable.getBinding("items").refresh();
            }
            
            


        });
    });
