namespace app.parking;


define entity ParkingLot {

    key id             : String @(title: 'PakingLotNumber');
        length         : String;
        avialable      : String;
        parkingveh     : Composition of many ParkignVeh
                             on parkingveh.parkinglot = $self;
        reserveparking : Composition of many ReserveParking
                             on reserveparking.parkinglot = $self;
}


define entity ParkignVeh {

    key id         : UUID;
        truckNo    : String;
        driverName : String;
        driverMob  : String;
        enterDate  : Date;
        enterTime  : Time;
        exitDate   : String;
        exitTime   : String;
        vendorName : String;
        assign     : Boolean;
        leave      : Boolean;
        inbound    : Boolean;
        parkinglot : Association to ParkingLot;

};


define entity ReserveParking {

    key id           : UUID;
        truckNo      : String;
        driverName   : String;
        driverMob    : String;
        resStartDate : Date;
        resStartTime : Time;
        confDate     : String;
        confTime     : String;
        vendorName   : String;
        res_staus    : Boolean;
        inbound      : Boolean;
        parkinglot   : Association to ParkingLot;
}

define entity Notifications {
    key id          : UUID;
        nvendorName : String;
        parkinglot  : Association to ParkingLot;
        message     : String;
        ndate       : Date;
}
