namespace app.parking;


define entity ParkingLot {

    key id             : String  @(title: 'PakingLotNumber');
        inward         : Boolean @(title: 'IN/OUT');
        length         : String;
        avialable      : Boolean;
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
        parkinglot : Association to ParkingLot;

};


define entity ReserveParking {

    key id           : UUID;
        truckNo      : String;
        driverName   : String;
        driverMob    : String;
        resStartDate : Date;
        resStartTime : Time;
        confDate     : Date;
        confTime     : Time;
        vendorName   : String;
        res_staus    : Boolean;
        parkinglot   : Association to ParkingLot;
}
