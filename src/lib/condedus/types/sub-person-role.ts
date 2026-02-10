// https://docs.concedus.com/import-process/send-data-sets/send-company-record/company-roles#subperson-roles
// The SubPerson roles can be combined with each other, so an Account Owner can also be a legal representative, beneficial owner or fictitious beneficial owner. For example, the code 106070 indicates that the account owner is also a beneficial Owner and a legal representative. Please use the ascending order in case you need to assign multiple roles.
export type SubPersonRole =
  | 10 // Account Owner (requires identification)
  | 1060
  | 106061
  | 10606170
  | 106070
  | 1061
  | 106170
  | 1070
  | 60 // 60  Wirtschaftlich Berechtigter / Beneficial Owner
  | 6061
  | 606170
  | 6070
  | 61 // 61  fiktiv wirtschaftlich Berechtigter / fictitous beneficial owner
  | 6170
  | 70 // Gesetzlicher Vertreter /Vertretungsorgan / legal representative
