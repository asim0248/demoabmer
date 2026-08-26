"use strict";

// Global Variables
var editor;
var header_html_editor;
var footer_html_editor;
var css_editor;

(function () {

  // JavaScript Editor
  editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.getSession().setMode("ace/mode/javascript");
  editor.setShowPrintMargin(false);

  // Header HTML Editor
  header_html_editor = ace.edit("header-html-editor");
  header_html_editor.setTheme("ace/theme/monokai");
  header_html_editor.getSession().setMode("ace/mode/html");
  header_html_editor.setShowPrintMargin(false);

  // Footer HTML Editor
  footer_html_editor = ace.edit("footer-html-editor");
  footer_html_editor.setTheme("ace/theme/monokai");
  footer_html_editor.getSession().setMode("ace/mode/html");
  footer_html_editor.setShowPrintMargin(false);

  // CSS Editor
  css_editor = ace.edit("css-editor");
  css_editor.setTheme("ace/theme/monokai");
  css_editor.getSession().setMode("ace/mode/css");
  css_editor.setShowPrintMargin(false);

})();

// Form Submit
document.querySelector('form').addEventListener('submit', function () {

  document.getElementById('headerCode').value =
    header_html_editor.getValue();

  document.getElementById('footerCode').value =
    footer_html_editor.getValue();

  document.getElementById('jsCode').value =
    editor.getValue();

  document.getElementById('cssCode').value =
    css_editor.getValue();

});

header_html_editor.setValue(
    document.getElementById('savedHeaderCode').value,
    -1
);

footer_html_editor.setValue(
    document.getElementById('savedFooterCode').value,
    -1
);

editor.setValue(
    document.getElementById('savedJsCode').value,
    -1
);

css_editor.setValue(
    document.getElementById('savedCssCode').value,
    -1
);