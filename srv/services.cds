using app.parking as my from '../db/data-models';

@path:'ParkingSRV'
service ParkingService @(requires: 'authenticated-user') {
    entity ParkingLot     as projection on my.ParkingLot;
    entity ParkignVeh     as projection on my.ParkignVeh;
    entity ReserveParking as projection on my.ReserveParking;
}
