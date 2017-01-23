/**
 * Created by ngabelloa on 11/9/2016.
 */
var EnumSublineType = {
  GeneralLiability: 1,
  Property: 2,
  ExcessLiability: 3,
  OwnersContractsProtective: 4,
  Liquor: 5,
  InlandMarine: 6,
  SpecialEvent: 7
};

var EnumLineOfBusiness = {
  GL: 0,
};

var EnumWorkFlowState = {
  InProgress: 0,
  Referred: 1,
  Approved: 2,
  Declined: 3,
  Quote: 4,
  Bind: 5,
  ReferredAssigned: 6,
  ReferredInquiry: 7,
  ReferredClosed: 8,
  PreIssue: 9,
  Issued: 10,
  ReferredAll: 999
};

//Application workflow states
var EnumApplicationFlow = {
  AccountInformation: 0,
  CoverageSelection: 1,
  RatesPremiums: 2,
  ReviewQuote: 3,
  ReviewBind: 4,
  ReviewIssue: 5 
};