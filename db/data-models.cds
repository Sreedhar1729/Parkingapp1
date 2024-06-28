namespace app.parking;


define entity ParkingLot {

    key id             : Integer @(title: 'PakingLotNumber');
        inward         : Boolean @(title: 'IN/OUT');
        length         : String;
        parkingveh     : Composition of many ParkignVeh
                             on parkingveh.parkinglot = $self;
        reserveparking : Composition of many ReserveParking
                             on reserveparking.parkinglot = $self;
}


define entity ParkignVeh {

    key id         : UUID;
        truckNo    : String;
        driverName : String;
        driverMob  : Int64;
        enterDate  : Date;
        enterTime  : Time;
        exitDate   : Date;
        exitTime   : Time;
        assign     : Boolean;
        parkinglot : Association to ParkingLot;

};


define entity ReserveParking {

    key id           : UUID;
        truckNo      : String;
        driverName   : String;
        driverMob    : Int64;
        resStartDate : Date;
        resStartTime : Time;
        confDate     : Date;
        confTime     : Time;
        res_staus    : Boolean;
        parkinglot   : Association to ParkingLot;
}
