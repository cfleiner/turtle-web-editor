# Turtle Validator

An online text editor with code highlighting for [Turtle notation (RDF)](https://www.w3.org/TR/turtle/) and validation check using [N3.js](https://github.com/rdfjs/N3.js/).

This modified version is based on:
- [IDLab Turtle Validator](https://github.com/IDLabResearch/TurtleValidator) developed as part of a summer of code event hosted by Ghent University and imec.
- [Turtle Web Editor](https://github.com/felixlohmeier/turtle-web-editor) by Felix Lohmeier
  

The modified version contains the following changes:
- Continous error catching. In case of an error, the validation check is continued after the next dot.
- Line number identification and line highlighting.
- Editor state saving. The states are lost when reloading the page.
- A prettier interface (my subjective opinion of course).

See the [Online Demo](cfleiner.github.io/turtle-web-editor/)
