/**
 * Created by ngabelloa on 10/28/2016.
 */
String.format = function() {
  // The string containing the format items (e.g. "{0}")
  // will and always has to be the first argument.
  var theString = arguments[0];

  // start with the second argument (i = 1)
  for (var i = 1; i < arguments.length; i++) {
    // "gm" = RegEx options for Global search (more than one instance)
    // and for Multiline search
    var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
    theString = theString.replace(regEx, arguments[i]);
  }

  return theString;
};

String.prototype.trim = function() {
  return this.replace(/^\s+|\s+$/g,"");
};

String.prototype.trimRight = function(charlist) {
  if (charlist === undefined)
    charlist = "\s";

  return this.replace(new RegExp("[" + charlist + "]+$"), "");
};

String.randomString = function randomString(len, charSet) {
  charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var randomString = '';
  for (var i = 0; i < len; i++) {
    var randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  return randomString;
};

String.getString = function(item){
  if(_.isString(item)){
    var stringItem = item.trim();
    if(stringItem.length > 0){
      return item.trim();
    }else{
      return undefined;
    }
  }else if(_.isArray(item) && item.length > 0){
    return item[0].trim();
  }else{
    return undefined;
  }
};

String.capitalizeFirst = function(item){
  if(item && item.length > 0) {
    var trimedString = item.trim().toLowerCase();
    return trimedString.charAt(0).toUpperCase() + trimedString.substring(1)
  }else{
    return '';
  }
};
