// WebImageGenerator.jsx
// 2016 Francisco Aguilera
// License: none (public domain)
// v1.0
//
// This script is for Photoshop CC 2015.
// It generates high quality, small, medium
// and large Web JPEGs for open documents.
//
 
// bring Photoshop into focus
#target photoshop
 
main();
 
function main() {
  var docs = app.documents;
  var openDocs = docs.length
 
  if(openDocs > 0) {
 
    var query = 'Generate web images for the following documents?\n';
    for (var i = 0; i < openDocs; ++i) {
      query += docs[i].name + '\n';
    }
     
    if(confirm(query)) {
      var startRulerUnits = app.preferences.rulerUnits;
      var startTypeUnits = app.preferences.typeUnits;
      app.preferences.rulerUnits = Units.PIXELS;
      app.preferences.typeUnits = TypeUnits.PIXELS;
   
      for (var i = 0; i < openDocs; ++i) {
        var doc = docs[i];
        var large_2x = parseInt(doc.width.toString().replace(/\s(?:px)?/g, ''));
        genWeb(doc, large, 'large_2x');
        var large = large_2x / 2;
        genWeb(doc, large, 'large');
        var medium_2x = large_2x / 1.5;
        genWeb(doc, large, 'medium_2x');
        var medium = medium_2x / 2;
        genWeb(doc, large, 'medium');
        var small_2x = medium_2x / 3;
        genWeb(doc, large, 'small_2x');
        var small = small_2x / 2;
        genWeb(doc, large, 'small');
      }
   
      app.preferences.rulerUnits = startRulerUnits;
      app.preferences.typeUnits = startTypeUnits;
       
      alert('Generated 6 JPEGs for '
      + openDocs + ' documents totalling '
      + 6 * openDocs + ' images!');
    }
  }
}
 
function genWeb(doc, width, postFix) {
  var oldDoc = doc;
  app.activeDocument = oldDoc;
  var newDoc = oldDoc.duplicate();
 
  var oldWidth = parseInt(oldDoc.width.toString().replace(/\s(?:px)?/g, ''));
  var oldHeight = parseInt(oldDoc.height.toString().replace(/\s(?:px)?/g, ''));
 
  var newWidth = parseInt(width);
  var newHeight = (oldHeight / oldWidth) * newWidth;
 
  app.activeDocument = newDoc;
  if(oldWidth > newWidth) {
    newDoc.resizeImage(newWidth + 'px', newHeight + 'px');
  }
 
  var options = new ExportOptionsSaveForWeb();
  options.interlaced = false;
  options.format = SaveDocumentType.JPEG;
  options.includeProfile = false;
  options.optimized = true;
  options.quality = 100;
  options.transparency = true;
 
  var newName = oldDoc.name.replace('.psd', '') + '_' + postFix + '.jpg';
 
  newDoc.exportDocument(new File(oldDoc.path + '/' + newName), ExportType.SAVEFORWEB, options);
  newDoc.close(SaveOptions.DONOTSAVECHANGES);
}