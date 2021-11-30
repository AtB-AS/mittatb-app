export let PayloadAction;

(function (PayloadAction) {
  PayloadAction[PayloadAction["unspecified"] = 0] = "unspecified";
  PayloadAction[PayloadAction["ticketTransfer"] = 1] = "ticketTransfer";
  PayloadAction[PayloadAction["addRemoveToken"] = 2] = "addRemoveToken";
  PayloadAction[PayloadAction["identification"] = 3] = "identification";
  PayloadAction[PayloadAction["ticketInspection"] = 4] = "ticketInspection";
  PayloadAction[PayloadAction["getFarecontracts"] = 5] = "getFarecontracts";
  PayloadAction[PayloadAction["travelcard"] = 6] = "travelcard";
})(PayloadAction || (PayloadAction = {}));
//# sourceMappingURL=types.js.map