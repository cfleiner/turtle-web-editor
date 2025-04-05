
function getRemaining(content, prefixes, indexOfError) {
  console.log("ioe", indexOfError);
  const nextDotPattern = /\. *$/g;
  const prefixPattern = /(^ *@.*\.$)|(^ *prefix.*$)/gmi;
  const hasprefixes = prefixPattern.test(content);
  const lines = content.split('\n');
  const remainingLines = lines.slice(Math.min(indexOfError + 1, lines.length), lines.length);

  let matchIndex = remainingLines.findIndex(str => nextDotPattern.test(str));
  
  if (matchIndex !== -1 && matchIndex < remainingLines.length - 1) {
    return {"lineIndex": indexOfError + matchIndex + 3 - (hasprefixes ?  prefixes.split('\n').length: 0),  // 
      "content": prefixes + remainingLines.slice(matchIndex + 1, remainingLines.length).join('\n')
    }
  } else {
    return {"lineIndex": -1, "content": ""}
  }
}

$("#btn_validate").click( function () {
  $("#warnings").html("");
  $("#errors").html("");
  $("#results").html("");
  reset_lines();


  let content = editor.getValue();
  const prefixPattern = /(^ *@.*\.$)|(^ *prefix.*$)/gmi;
  const prefixes = content.match(prefixPattern).join('\n') + '\n';
  let offset = 0;

  chainValidation(content, prefixes, offset)
});

function chainValidation(content, prefixes, offset) { 
  validate(content, function (feedback) {
    $.each(feedback.warnings, function (index, warning) {
        highlightLine(warning.lineIndex + offset - 1, "highlight-warning");
        console.log('warning', index, warning.lineIndex)
        warning.message = warning.message.replace(String(warning.lineIndex), String(warning.lineIndex + offset));

        $("#warnings").append($('<li id="warning' + index + '">').text(warning.message));
    });
    
    $.each(feedback.errors, function (index, error) {

      highlightLine(error.lineIndex + offset, "highlight-error");
      error.message = error.message.replace(String(lineIndex + 1), String(lineIndex + offset + 1));
      $("#errors").append($('<li id="error' + index + '">').text(error.message));
      rem = getRemaining(content, prefixes, error.lineIndex);
      content = rem.content;
      offset += rem.lineIndex;
      console.log(offset, rem.lineIndex, content);
      chainValidation(content, prefixes, offset)
    });

    if (feedback.errors.length === 0 && feedback.warnings.length === 0) {
      $("#results").append("Congrats! Your syntax is correct.");
    }
  });

}

function reset_lines() {
  let totalLines = editor.lineCount();
  // Iterate through each line
  for (let i = 0; i < totalLines; i++) {
    editor.removeLineClass(i, 'background', 'highlight-error');  
    editor.removeLineClass(i, 'background', ' highlight-warning ');  
  }
   
}


function highlightLine(lineIndex, highlightClass) {
  editor.addLineClass(lineIndex, 'background', highlightClass);
}



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
