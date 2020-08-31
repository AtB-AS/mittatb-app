export enum NoResultReason {
    Unspecified,
    IdenticalLocations = 'Fra- og til-sted er identiske',
    CloseLocations = 'Det er veldig kort avstand mellom fra- og til-sted',
    PastArrivalTime = 'Ankomsttid har passert',
    PastDepartureTime = 'Avreisetid har passert',
}