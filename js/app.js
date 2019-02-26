// function getPatientName (pt) {
//   if (pt.name) {
//     var names = pt.name.map(function(name) {
//       return name.given.join(" ") + " " + name.family.join(" ");
//     });
//     return names.join(" / ")
//   } else {
//     return "anonymous";
//   }
// }
//
// function getMedicationName (medCodings) {
//   var coding = medCodings.find(function(c){
//     return c.system == "http://www.nlm.nih.gov/research/umls/rxnorm";
//   });
//
//   return coding && coding.display || "Unnamed Medication(TM)"
// }
//
// function displayPatient (pt) {
//   document.getElementById('patient_name').innerHTML = getPatientName(pt);
// }
//

// Create a FHIR client (server URL, patient id in `demo`)
var smart = FHIR.client(config);

document.getElementById('title').innerHTML = "Welcome to the GI on FHIR app!";


smart.api.search({
  type: "Condition",
  query: {code : {$or : ["14760008", "62315008", "21522001"]}}
}).then(function(r){
  var patients = [];
  for (var i in r.data.entry){
    patients.push(r.data.entry[i].resource.subject.reference.split("/")[1]);
    // console.log(r.data.entry[i].resource.subject.reference.split("/")[1]);
  }
  console.log(patients);
   // console.log(JSON.stringify(r.data.entry, null, 2));

   smart.api.search({
     type: "Condition",
     query: {'subject' : {$or : patients}}
   }).then(function(r){
     for (var i in r.data.entry){
       console.log(r.data.entry[i].resource.code.coding[0].display);
     }
     // console.log(JSON.stringify(r.data.entry, null, 2));
   });
});


// // Create a patient banner by fetching + rendering demographics
// smart.patient.read().then(function(pt) {
//   displayPatient (pt);
// });
//
// // A more advanced query: search for active Prescriptions, including med details
// smart.patient.api.fetchAllWithReferences({type: "MedicationOrder"},["MedicationOrder.medicationReference"]).then(function(results, refs) {
//    results.forEach(function(prescription){
//         if (prescription.medicationCodeableConcept) {
//             displayMedication(prescription.medicationCodeableConcept.coding);
//         } else if (prescription.medicationReference) {
//             var med = refs(prescription, prescription.medicationReference);
//             displayMedication(med && med.code.coding || []);
//         }
//    });
// });
