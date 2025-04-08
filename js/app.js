var tableRows = [];


$(document).ready(function() {
  $(document).on("keydown", addKey);
  $(document).on("keyup", removeKey);

  initalizeCodeMirror();
  initTable();


  $('#select-example').on('change', function(e) {
    let example = exampleList[Number(  $('#select-example').val())];
    const editor = document.querySelector('#editor .CodeMirror').CodeMirror;
    editor.setValue(example);

    setTimeout(function() {performValidation();}, 200);

  });


  $('#btn-validate').on('click', performValidation);

  $('#btn-state').on('click', () => {
    let timeString = getTimeString();
    $('#select-state').append(`<option value="${timeString}">${timeString}</option>`);
    saveState(timeString);
  });

  $('#select-state').on('change', function(e) {
    let state = $('#select-state').val();
    if (state != "0") {
      restoreState(state);
      performValidation();
    }
    // setTimeout(function() {restoreState(state);}, 200);
  });


  $('#editor-container').on('mouseenter', () => $('#btn-copy').css('opacity', '1'))
  $('#editor-container').on('mouseleave', () => $('#btn-copy').css('opacity', '0.05')) 
  $('#btn-copy').on('click', copyCodeToClipboard)
  $('#btn-copy').tooltip({ trigger: 'manual' });
  $('#btn-state').tooltip({ trigger: 'manual' });


  $('#select-example').val('0').trigger('change');
});


function getRemaining(content, prefixes, indexOfError) {
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

function performValidation() {
  $("#warnings-ol").html("");
  $("#errors-ol").html("");

  const editor = document.querySelector('#editor .CodeMirror').CodeMirror;

  reset_lines(editor);

  let content = editor.getValue();
  if (content.length == 0) {
    return;
  }
  const prefixPattern = /(^ *@.*\.$)|(^ *prefix.*$)/gmi;
  const prefixes = content.match(prefixPattern).join('\n') + '\n';
  let offset = 0;
  tableRows = [];
  chainValidation(content, prefixes, offset);

};


function chainValidation(content, prefixes, offset) {
  validate(content, function (feedback) {
    $.each(feedback.warnings, function (index, warning) {
        highlightLine(warning.lineIndex + offset - 1, "highlight-warning");
        warning.message = warning.message.replace(String(warning.lineIndex), String(warning.lineIndex + offset));
        $("#warnings-ol").append($('<li>').text(warning.message));
    });
    
    $.each(feedback.errors, function (index, error) {
      highlightLine(error.lineIndex + offset, "highlight-error");
      error.message = error.message.replace(String(getLineFromError(error.message)), String(error.lineIndex + offset + 1));
      $("#errors-ol").append($('<li>').text(error.message));
      rem = getRemaining(content, prefixes, error.lineIndex);
      content = rem.content;
      offset += rem.lineIndex;
      chainValidation(content, prefixes, offset);
    });

    tableRows = tableRows.concat(feedback.tableRows);

    updateResult();
    updateTable(tableRows);
  });



function updateResult() {
  $("#result-banner").removeClass('bg-success-subtle bg-info-subtle bg-warning-subtle bg-danger-subtle');
  
  const elements = [
    { id: "#information-ol", countId: "#information-count", className: "bg-info-subtle", resultText: "Your code is syntactically correct. There is additional information." },
    { id: "#warnings-ol", countId: "#warning-count", className: "bg-warning-subtle", resultText: "Your code is almost syntactically correct, but at least one datatype assignment is not valid."},
    { id: "#errors-ol", countId: "#error-count", className: "bg-danger-subtle", resultText: "Your code is syntactically INCORRECT. Please refer to the sidebar for additional information."  }
  ];

  let c = 'bg-success-subtle';
  let t = 'Your code is syntactically correct.'


  elements.forEach(element => {
    const count = $(element.id).children().length;
    if (count > 0) {
      c = element.className;
      t = element.resultText;
    }
    $(element.countId).text(`(${count})`);
  });

  $("#result-banner").parent().removeAttr("hidden");
  $("#result-banner").text(`${t} (Last updated: ${getTimeString()})`);
  $("#result-banner").addClass(c);
}
}

function reset_lines(editor) {
  let totalLines = editor.lineCount();
  // Iterate through each line
  for (let i = 0; i < totalLines; i++) {
    editor.removeLineClass(i, 'background', 'highlight-error');  
    editor.removeLineClass(i, 'background', ' highlight-warning ');  
  }
   
}

function highlightLine(lineIndex, highlightClass) {
  const editor = document.querySelector('#editor .CodeMirror').CodeMirror;
  editor.addLineClass(lineIndex, 'background', highlightClass);
}

function initalizeCodeMirror(theme='default') {
  const cm = CodeMirror(document.querySelector('#editor'), {
      lineNumbers: true,
      // lineWrapping:true,
      viewportMargin: Infinity,
      tabSize: 2,
      mode: 'turtle',    
      theme: theme
  });
  cm.focus();
  cm.setCursor(cm.lineCount(), 0);
}




// $("#btn_download").click( function () {
//   var textToWrite = editor.getValue();
//   var textToWrite = textToWrite.replace(/\n/g, "\r\n");
//   var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
//   var fileNameToSaveAs = "FILENAME.ttl";
//   var downloadLink = document.createElement("a");
//   downloadLink.download = fileNameToSaveAs;
//   downloadLink.innerHTML = "Turtle Web Editor Content";
//   window.URL = window.URL || window.webkitURL;
//   downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
//   downloadLink.onclick = destroyClickedElement;
//   downloadLink.style.display = "none";
//   document.body.appendChild(downloadLink);
//   downloadLink.click();
// });

// function destroyClickedElement(event) {
// document.body.removeChild(event.target);
// }


async function copyCodeToClipboard() {
  try {
      const editor = $('#editor .CodeMirror')[0].CodeMirror;
      const content = editor.getValue().replace(/\/n/g, ' /n');

      if (navigator.clipboard) {
          await navigator.clipboard.writeText(content);
      } else {
          const textArea = document.createElement('textarea');
          textArea.value = content;
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          try {
              document.execCommand('copy');
          } catch (err) {
              console.error('Failed to copy: ', err);
          }
          document.body.removeChild(textArea);
      }

      $('#btn-copy').tooltip('show');
      setTimeout(() => {
          $('#btn-copy').tooltip('hide');
      }, 1500);

  } catch (err) {
      console.error('Failed to copy: ', err);
  }
}

var keysPressed = {}; // Object to store key states

function removeKey(e) {
  keysPressed[e.key] = false;
};

function addKey(e) {
  keysPressed[e.key] = true;
  if (keysPressed['Enter'] && keysPressed['Control']) {
      performValidation();
  }
  if (keysPressed['s'] && keysPressed['Control']) {
    e.preventDefault();
    $('#btn-state').trigger('click');
}  
};

const states = {};


function saveState(timeString) {
  const editor = document.querySelector('#editor .CodeMirror').CodeMirror;
  states[timeString] = editor.getValue();

  $('#btn-state').tooltip('show');
  setTimeout(() => {
      $('#btn-state').tooltip('hide');
  }, 1500);
}

function getTimeString() {
  const now = new Date();
  return now.toLocaleTimeString('en-GB', { hour12: false });
}

function restoreState(timeString) {
  const editor = document.querySelector('#editor .CodeMirror').CodeMirror;
  editor.setValue(states[timeString]);
}


function initTable() {
  new DataTable('#data-table', {
    scrollX: true,
    columns: [
        { title: '#' },
        { title: 'Graph' },
        { title: 'Subject' },
        { title: 'Predicate' },
        { title: 'Object' }
    ]
  });
}

function updateTable(data) {
  const t = $('#data-table').DataTable();
  t.clear();
  const indexedData = data.map((row, index) => [index + 1, ...row]);
  t.rows.add(indexedData);
  t.draw();
}


