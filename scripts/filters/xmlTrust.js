/**
 * Created by ngabelloa on 11/10/2016.
 */
function XMLTrustFilter() {
  return [ '$sce', function ($sce) {
    return function(htmlCode){
      return $sce.trustAsHtml(htmlCode);
    }
  }]
}
