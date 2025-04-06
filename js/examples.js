var valid = `@prefix foaf: <http://xmlns.com/foaf/0.1/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

_:alice a foaf:Person ;
       foaf:name "Alice" ;
       foaf:age "28"^^xsd:int ;
       foaf:birthday "1997-05-15T00:00:00"^^xsd:dateTime ;
       foaf:knows _:bob, _:christian .

_:bob a foaf:Person ;
     foaf:name "Bob" ;
     foaf:age "40"^^xsd:int ;
     foaf:birthday "1985-12-22T00:00:00"^^xsd:dateTime ;
     foaf:knows _:alice, _:christian .

_:christian a foaf:Person ;
            foaf:name "Christian" ;
            foaf:age "33"^^xsd:int ;
            foaf:birthday "1992-08-30T00:00:00"^^xsd:dateTime ;
            foaf:knows _:alice, _:bob .`


var warnings = `@prefix foaf: <http://xmlns.com/foaf/0.1/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

_:alice a foaf:Person ;
       foaf:name "Alice" ;
       foaf:age "28"^^xsd:int ;
       foaf:birthday "1997-05-15"^^xsd:dateTime ;
       foaf:knows _:bob, _:christian .

_:bob a foaf:Person ;
     foaf:name "Bob" ;
     foaf:age "40.5"^^xsd:int ;
     foaf:birthday "1985-12-22T00:00:00"^^xsd:dateTime ;
     foaf:knows _:alice, _:christian .

_:christian a foaf:Person ;
            foaf:name "Christian" ;
            foaf:age "thirty-three"^^xsd:int ;
            foaf:birthday "10"^^xsd:dateTime ;
            foaf:knows _:alice, _:bob .`

var errors = `@prefix foaf: <http://xmlns.com/foaf/0.1/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

alice a foaf:Person ;
       foaf:name "Alice" ;
       foaf:age "28"^^xsd:int ;
       foaf:birthday "1997-05-15T00:00:00"^^xsd:dateTime ;
       foaf:knows _:bob, _:christian .

_:bob a foaf:Person ;
     foaf:name "Bob" 
     foaf:age "40"^^xsd:int ;
     foaf:birthday "1985-12-22T00:00:00"^^xsd:dateTime ;
     foaf:knows _:alice, _:christian .

_:christian a foaf:Person ;
            foaf:name "Christian" ;
            foaf:age "33"^^xsd:int ;
            foaf:birthday "1992-08-30T00:00:00"^^xsd:dateTime ;
            foaf:knows `

var err_warn = `@prefix foaf: <http://xmlns.com/foaf/0.1/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

alice a foaf:Person ;
       foaf:name "Alice" ;
       foaf:age "28"^^xsd:int ;
       foaf:birthday "1997-05-15"^^xsd:dateTime ;
       foaf:knows _:bob, _:christian .

_:bob a foaf:Person ;
     foaf:name "Bob" 
     foaf:age "40.5"^^xsd:int ;
     foaf:birthday "1985-12-22T00:00:00"^^xsd:dateTime ;
     foaf:knows _:alice, _:christian .

_:christian a foaf:Person ;
            foaf:name "Christian" ;
            foaf:age "thirty-three"^^xsd:int ;
            foaf:birthday "10"^^xsd:dateTime ;
            foaf:knows `


const exampleList = [valid, warnings, errors, err_warn];