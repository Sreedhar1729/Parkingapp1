sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Token",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
],
    function (Controller, ODataModel, Filter, FilterOperator, Token, Fragment, JSONModel) {
        "use strict";

        return Controller.extend("com.app.parkingapp.controller.Home", {
            onInit: function () {
                // set the initial value

                // Tokens

                const oView = this.getView(),
                    oMulti1 = this.oView.byId("_IDGenMultiInput1");
                var oModel = new sap.ui.model.odata.v2.ODataModel("https://port4004-workspaces-ws-tltdr.us10.trial.applicationstudio.cloud.sap/v2/odata/v4/parking/");
                this.getView().setModel(oModel);

                let validae = function (arg) {
                    if (true) {
                        var text = arg.text;
                        return new sap.m.Token({ key: text, text: text });
                    }
                }
                oMulti1.addValidator(validae);


                // creating json model for the  parkinglot assignment
                const oLocalModel = new sap.ui.model.json.JSONModel(
                    {

                        truckNo: "",
                        driverName: "",
                        driverMob: "",
                        enterDate: new Date(),
                        enterTime: "",
                        exitDate: "  ",
                        exitTime: " ",
                        assign: true,
                        parkinglot_id: "",

                    }
                );

                this.getView().setModel(oLocalModel, "gotmm");


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
                        break;
                    case "LeftVehicles":
                        navContainer.to(this.getView().createId("LeftVehicles"));
                        break;
                    case "waitingforconfirm":
                        navContainer.to(this.getView().createId("reservationpending"))
                    default:
                        break;
                }
            },
            // for filters
            onGoPress: function (oEvent) {

                const oview = this.getView(),
                    oParkingSlotFilter = oview.byId("inward"),
                    oParkingno = oview.byId("_IDGenMultiInput1"),
                    oavailable = oview.byId("idavailablestausforselect"),
                    sParkingSlotNumber = oParkingSlotFilter.getSelectedKey(),
                    savailable = oavailable.getSelectedKey(),
                    sParkingno = oParkingno.getTokens(),
                    oTable = oview.byId("idparkingslottable"),
                    aFilters = [];

                sParkingSlotNumber ? aFilters.push(new Filter("inward", FilterOperator.EQ, sParkingSlotNumber)) : "";
                savailable ? aFilters.push(new Filter("avialable", FilterOperator.EQ, savailable)) : "";
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
            onDelete: function () {
                var oTable = this.getView().byId("idparkingslottable");
                var aSelectedItems = oTable.getSelectedItems();

                aSelectedItems.forEach(function (oSelectedItem) {
                    var sPath = oSelectedItem.getBindingContext().getPath();
                    var oModel = oSelectedItem.getModel();

                    oModel.remove(sPath, {
                        success: function () {
                            console.log("Item deleted successfully.");
                        },
                        error: function (oError) {
                            console.error("Error deleting item:", oError);
                        }
                    });
                });


                // oTable.getBinding("items").refresh();
            },
            // fragment open for reservation creation
            onAdd: async function () {
                this.oDialog ??= await this.loadFragment({
                    name: "com.app.parkingapp.fragments.create"
                });
                this.oDialog.open();
            },
            onCloseDialog: function () {
                //checking whether dialog is open or not
                if (this.oDialog.isOpen()) {
                    this.oDialog.close()
                }

            },

            // on create reserve
            onCreateReserve: function () {
                const oCreateReserveModel = new sap.ui.model.JSONModel({
                    truckNo: "",
                    driverName: "",
                    driverMob: "",
                    enterDate: new Date(),
                    enterTime: formattedTime,
                    exitDate: "  ",
                    exitTime: " ",
                    assign: true,
                });
                this.getView().setModel(oCreateReserveModel, "oCreateReserveModel")

            },


            // on assign
            onAssignPress: function () {
                // assuming one model
                var otruckNo = this.getView().byId("idTruckInput").getValue();
                var oDriverName = this.getView().byId("idDriverNameInputs").getValue();
                var omobile = this.getView().byId("idDriverMobileInputs").getValue();
                var oparkingslotid = this.getView().byId("parkingLotSelect").getSelectedKey();
                //getting time in hh:mm:ss
                function getCurrentTime() {
                    const now = new Date();
                    const hours = now.getHours().toString().padStart(2, '0');
                    const minutes = now.getMinutes().toString().padStart(2, '0');
                    const seconds = now.getSeconds().toString().padStart(2, '0');
                    const milliseconds = now.getMilliseconds().toString().padStart(3, '0');

                    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
                }

                // Example usage:
                const formattedTime = getCurrentTime();
                const opayload = new sap.ui.model.json.JSONModel({
                    truckNo: otruckNo,
                    driverName: oDriverName,
                    driverMob: omobile,
                    parkinglot_id: oparkingslotid,
                    enterDate: new Date(),
                    enterTime: formattedTime,
                    exitDate: "  ",
                    exitTime: " ",
                    assign: true,
                })
                this.getView().setModel(opayload, "opayload")

                const oPath = this.getView().getModel("opayload").getProperty("/")
                const oModel = this.getView().getModel("ModelV2")
                try {
                    this.createData(oModel, oPath, "/ParkignVeh");
                    this.getView().byId("idParkingvehiclestable").getBinding("items").refresh();
                    sap.m.MessageBox.success("success");
                    oModel.refresh(true);
                    this.getView().byId("idTruckInput").setValue();
                    this.getView().byId("idDriverNameInputs").setValue();
                    this.getView().byId("idDriverMobileInputs").setValue();



                } catch (error) {
                    // this.oCreateBooksDialog.close();
                    sap.m.MessageBox.error("Some technical Issue");
                }

            },
            createData: function (oModel, oPath, sPath) {
                return new Promise((resolve, reject) => {
                    oModel.create(sPath, oPath, {
                        refreshAfterChange: true,
                        success: function (oSuccessData) {
                            resolve(oSuccessData);
                        },
                        error: function (oErrorData) {
                            reject(oErrorData)
                        }
                    })
                });
            },
            editbutton: function (oEvent) {
                var oButton = oEvent.getSource();
                var sButtonText = oButton.getText();
                var oTable = oButton.getParent().getParent(); // Assuming the button is directly inside a table row

                var oModel = this.getView().getModel(); // Assuming the model is accessible from the view

                if (sButtonText === "edit") {
                    oButton.setText("submit");
                    var oRow = oButton.getParent(); // Assuming the button is directly inside a table row
                    var oCell = oRow.getCells()[4]; // Accessing the 5th cell (index 4) in the row
                    oCell.setEditable(true);
                } else {
                    oButton.setText("edit");
                    var oRow = oButton.getParent(); // Assuming the button is directly inside a table row
                    var oCell = oRow.getCells()[4]; // Accessing the same cell as in edit mode
                    oCell.setEditable(false);

                    // Perform data update
                    var oInput = oRow.getCells()[4].getValue();
                    var oID = oEvent.getSource().getBindingContext().getProperty("id");
                    oModel.update("/ReserveParking(" + oID + ")", { parkinglot_id: oInput }, {
                        success: function (odata) {
                            oModel.refresh(true);
                        }, error: function (oError) {
                            alert(oError);
                        }
                    })
                }

            },
            // vehicle leaves from the parkinglot
            onLeft: function () {
                var osel = this.getView().byId("idParkingvehiclestable").getSelectedItem().getBindingContext().getObject();
                const leftModel = new sap.ui.model.json.JSONModel({
                    assign: false,
                    id: osel.id,
                    parkinglot_id: osel.parkinglot_id
                });
                this.getView().setModel(leftModel, "leftModel");
                const opayload = this.getView().getModel("leftModel").getData(),
                    oModel = this.getView().getModel("ModelV2");
                try {
                    oModel.update("/ParkignVeh(" + opayload.id + ")", opayload, {
                        success: function () {
                            this.getView().byId("idParkingvehiclestable").getBinding("items").refresh();
                            sap.m.MessageBox.success("Vehicle left from the parking area!!!");
                            oModel.refresh(true);
                        }.bind(this),
                        error: function (oError) {
                            sap.m.MessageBox.error("Vehicle still in the Parking Area!!" + oError.message);
                        }.bind(this)
                    })
                } catch (error) {
                    sap.m.MessageBox.error("Vehicle still in the parking area")

                }
            },
            onConfirm: function () {
                var osel = this.getView().byId("idreservependingtable").getSelectedItem().getBindingContext().getObject();
                const oSample = new sap.ui.model.json.JSONModel({
                    res_staus: true,
                    id: osel.id
                });
                var number = osel.driverMob; // Assuming osel.driverMob contains the recipient's phone number
                var text = "Your reservation is confirmed!!!";

                // Construct the WhatsApp API URL
                var baseUrl = "https://wa.me/";
                var encodedPhoneNumber = encodeURIComponent(number);
                var encodedText = encodeURIComponent(text);
                var finalUrl = baseUrl + encodedPhoneNumber + "?text=" + encodedText;

                // Redirect to the WhatsApp URL
                sap.m.URLHelper.redirect(finalUrl, true);

                this.getView().setModel(oSample, "oSample");
                const opayload = this.getView().getModel("oSample").getData(),
                    oModel = this.getView().getModel("ModelV2");
                try {
                    oModel.update("/ReserveParking(" + opayload.id + ")", opayload, {
                        success: function () {
                            this.getView().byId("idreservependingtable").getBinding("items").refresh();
                            sap.m.MessageBox.success("Reservation Confirmed/Approved !!!");
                        }.bind(this),
                        error: function (oError) {
                            sap.m.MessageBox.error("Reservation not approved!!" + oError.message);
                        }.bind(this)
                    })
                } catch (error) {
                    sap.m.MessageBox.error("Reservation not Confirmed!!!");

                }

            },
            // New parking slots creation fragment loaded
            onAdd: async function () {
                this.oDialog ??= this.loadFragment({
                    name: "com.app.parkingapp.fragments.slotcreation"
                });
                this.oDialog.open();
            },
            onClears: function () {
                this.byId("idslotcreationDialog").close();
            }

        });
    });
