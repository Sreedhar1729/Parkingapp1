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
                this.onReadSorters();
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
                    exitDate: " ",
                    exitTime: " ",
                    assign: true,
                });
                this.getView().setModel(oCreateReserveModel, "oCreateReserveModel")
            },
            // on assign
            onAssignPress: function () {
                var oTruckNo = this.getView().byId("idTruckInput").getValue();
                var oDriverName = this.getView().byId("idDriverNameInputs").getValue();
                var oMobile = this.getView().byId("idDriverMobileInputs").getValue();
                var oParkingLotId = this.getView().byId("parkingLotSelect").getSelectedKey();

                // Function to get current time in hh:mm:ss
                function getCurrentTime() {
                    const now = new Date();
                    const hours = now.getHours().toString().padStart(2, '0');
                    const minutes = now.getMinutes().toString().padStart(2, '0');
                    const seconds = now.getSeconds().toString().padStart(2, '0');
                    const milliseconds = now.getMilliseconds().toString().padStart(3, '0');
                    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
                }

                const formattedTime = getCurrentTime();

                // Payload for creating ParkignVeh entity
                const opayload = {
                    truckNo: oTruckNo,
                    driverName: oDriverName,
                    driverMob: oMobile,
                    parkinglot_id: oParkingLotId,
                    enterDate: new Date(),
                    enterTime: formattedTime,
                    exitDate: "",
                    exitTime: "",
                    assign: true
                };

                const oModel = this.getView().getModel("ModelV2");

                // Create ParkignVeh entity
                this.createData(oModel, opayload, "/ParkignVeh")
                    .then(() => {
                        // Update ParkingLot to mark slot as unavailable
                        const oParkingslotpayload = {
                            id: oParkingLotId,
                            avialable: false // Corrected spelling to 'available'
                        };
                        return this.updateData(oModel, oParkingslotpayload, "/ParkingLot('" + oParkingLotId + "')");
                    })
                    .then(() => {
                        // Refresh table items and clear input fields on success
                        this.getView().byId("idParkingvehiclestable").getBinding("items").refresh();
                        sap.m.MessageToast.show("Vehicle assigned to parking slot successfully!");
                        oModel.refresh(true);
                        this.clearInputFields();
                    })
                    .catch((error) => {
                        sap.m.MessageBox.error("Failed to assign vehicle to parking slot: " + error.message);
                    });
            },

            createData: function (oModel, opayload, sPath) {
                return new Promise((resolve, reject) => {
                    oModel.create(sPath, opayload, {
                        success: function (oSuccessData) {
                            resolve(oSuccessData);
                        },
                        error: function (oErrorData) {
                            reject(oErrorData);
                        }
                    });
                });
            },

            updateData: function (oModel, opayload, sPath) {
                return new Promise((resolve, reject) => {
                    oModel.update(sPath, opayload, {
                        success: function (oSuccessData) {
                            resolve(oSuccessData);
                        },
                        error: function (oErrorData) {
                            reject(oErrorData);
                        }
                    });
                });
            },

            clearInputFields: function () {
                this.getView().byId("idTruckInput").setValue("");
                this.getView().byId("idDriverNameInputs").setValue("");
                this.getView().byId("idDriverMobileInputs").setValue("");
                oModel.refresh(true);
            }
            ,
            // editing code
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
            // Assuming this function is part of a SAPUI5 controller or component
            onLeft: function () {
                var oView = this.getView();
                var oTable = oView.byId("idParkingvehiclestable");
                var oSelectedItem = oTable.getSelectedItem();

                if (!oSelectedItem) {
                    sap.m.MessageToast.show("Please select a vehicle to remove.");
                    return;
                }

                var osel = oSelectedItem.getBindingContext().getObject();
                // Function to get current time in hh:mm:ss
                function getCurrentTime() {
                    const now = new Date();
                    const hours = now.getHours().toString().padStart(2, '0');
                    const minutes = now.getMinutes().toString().padStart(2, '0');
                    const seconds = now.getSeconds().toString().padStart(2, '0');
                    const milliseconds = now.getMilliseconds().toString().padStart(3, '0');
                    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
                }

                const formattedTime = getCurrentTime();

                // Create JSON models for leftModel and oParkingslot
                var leftModel = new sap.ui.model.json.JSONModel({
                    assign: false,
                    id: osel.id,
                    exitDate: new Date(),
                    exitTime: formattedTime,
                    parkinglot_id: osel.parkinglot_id
                });
                oView.setModel(leftModel, "leftModel");

                var oParkingslot = new sap.ui.model.json.JSONModel({
                    id: osel.parkinglot_id,
                    avialable: true // Corrected spelling to 'available'
                });
                oView.setModel(oParkingslot, "oParkingslot");

                var oModel = oView.getModel("ModelV2");

                // Update ParkingLot to mark slot as available
                oModel.update("/ParkingLot('" + osel.parkinglot_id + "')", oParkingslot.getData(), {
                    success: function () {
                        // Update ParkignVeh to mark vehicle as unassigned
                        oModel.update("/ParkignVeh(" + osel.id + ")", leftModel.getData(), {
                            success: function () {
                                oTable.getBinding("items").refresh(); // Refresh table binding
                                sap.m.MessageToast.show("Vehicle left from the parking area.");

                                // Speak message
                                var text = osel.truckNo + " vehicle is left from parking";
                                var utterance = new SpeechSynthesisUtterance(text);
                                speechSynthesis.speak(utterance);

                                oModel.refresh(true); // Refresh the model after updates
                            }.bind(this),
                            error: function (oError) {
                                sap.m.MessageBox.error("Error updating ParkignVeh: " + oError.message);
                                console.error("Error updating ParkignVeh:", oError);
                            }
                        });
                    }.bind(this),
                    error: function (oError) {
                        sap.m.MessageBox.error("Error updating ParkingLot: " + oError.message);
                        console.error("Error updating ParkingLot:", oError);
                    }
                });
            }
            ,
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
            onAdd1: async function () {
                this.oDialog1 ??= await this.loadFragment({
                    name: "com.app.parkingapp.fragments.slotcreation"
                });
                this.oDialog1.open();
            },
            onClears: function () {
                this.byId("idslotcreationDialog").close();
            },
            onCreate: async function () {
                // getting values from the input fields
                var oid = this.getView().byId("idslotcreatingidval").getValue(),
                    olength = this.getView().byId("idslotcreatinglengthval").getValue(),
                    oinward = this.getView().byId("idslotcreatinginwardval").getValue();
                var oparkingslotpayload = new JSONModel({
                    id: oid,
                    inward: oinward,
                    length: olength,
                    avialable: true,
                });
                this.getView().setModel(oparkingslotpayload, "oparkingslotpayload")
                const oPath = this.getView().getModel("oparkingslotpayload").getProperty("/");
                const oModel = this.getView().getModel("ModelV2");
                try {
                    await this.createData(oModel, oPath, "/ParkingLot");
                    this.getView().byId("idparkingslottable").getBinding("items").refresh();
                    sap.m.MessageBox.success("success");
                    this.byId("idslotcreationDialog").close();
                    oModel.refresh(true);
                } catch (error) {
                    this.byId("idslotcreationDialog").close();
                    console.log(error)
                }
            },
            onReadSorters: function () {
                var oModel = this.getOwnerComponent().getModel("ModelV2");
                var oSorter = new sap.ui.model.Sorter('id', true);
                oModel.read("/ParkingLot", {
                    Sorters: [oSorter],
                    success: function (odata) {
                        var jModel = new sap.ui.model.json.JSONModel(odata);
                        this.getView().byId("idparkingslottable").setModel(jModel);
                    }, error: function (oError) {

                    }
                })
            }
        });
    });
