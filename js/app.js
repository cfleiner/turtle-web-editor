$("#btn_validate").click( function () {
  $("#warnings").html("");
  $("#errors").html("");
  $("#results").html("");
  
  validate(editor.getValue(), function (feedback) {
    $.each(feedback.warnings, function (index, warning) {
      $("#warnings").append($('<li id="warning' + index + '">').text(warning));
    });
    
    $.each(feedback.errors, function (index, error) {
      $("#errors").append($('<li id="error' + index + '">').text(error));
    });

    if (feedback.errors.length === 0 && feedback.warnings.length === 0) {
      $("#results").append("Congrats! Your syntax is correct.");
    }
  });
});

var editor = CodeMirror.fromTextArea(document.getElementById("ta_turtle"), {
    lineNumbers: true,
    mode: 'turtle',
    viewportMargin: Infinity,
    theme: 'default'
});

var example =
   ['@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .',
    '@prefix dc: <http://purl.org/dc/elements/1.1/> .',
    '@prefix ex: <http://example.org/stuff/1.0/> .',
    '<http://www.w3.org/TR/rdf-syntax-grammar>',
    '  dc:title "RDF/XML Syntax Specification (Revised)" ;',
    '  ex:editor [',
    '    ex:fullname "Dave Beckett";',
    '    ex:homePage <http://purl.org/net/dajobe/>',
    '  ] .'
   ].join('\n');

$("#btn_example").click( function () {
editor.setValue(example);
});

$("#btn_download").click( function () {
var textToWrite = editor.getValue();
var textToWrite = textToWrite.replace(/\n/g, "\r\n");
var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
var fileNameToSaveAs = "FILENAME.ttl";
var downloadLink = document.createElement("a");
downloadLink.download = fileNameToSaveAs;
downloadLink.innerHTML = "Turtle Web Editor Content";
window.URL = window.URL || window.webkitURL;
downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
downloadLink.onclick = destroyClickedElement;
downloadLink.style.display = "none";
document.body.appendChild(downloadLink);
downloadLink.click();
});

function destroyClickedElement(event) {
document.body.removeChild(event.target);
}
