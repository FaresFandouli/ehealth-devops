package com.pds.consultationservice.controller;

import com.pds.consultationservice.entity.Consultation;
import com.pds.consultationservice.service.ConsultationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/consultations")  // ✅ Gardez /consultations ici
@CrossOrigin(origins = "*")
public class ConsultationController {

    @Autowired
    private ConsultationService consultationService;

    @GetMapping("/getAllConsultations")  // ✅ ENLEVÉ "/consultations" - juste @GetMapping
    public ResponseEntity<List<Consultation>> getAllConsultations() {
        return ResponseEntity.ok(consultationService.getAllConsultations());
    }

    @GetMapping("/getConsultationById/{id}")  // ✅ CHANGÉ de "/consultations/{id}" à "/{id}"
    public ResponseEntity<Consultation> getConsultationById(@PathVariable Long id) {
        return consultationService.getConsultationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")  // ✅ CHANGÉ de "/consultations/patient/{patientId}"
    public ResponseEntity<List<Consultation>> getConsultationsByPatientId(@PathVariable Long patientId) {
        return ResponseEntity.ok(consultationService.getConsultationsByPatientId(patientId));
    }

    @GetMapping("/doctor/{doctorId}")  // ✅ CHANGÉ de "/consultations/doctor/{doctorId}"
    public ResponseEntity<List<Consultation>> getConsultationsByDoctorId(@PathVariable Long doctorId) {
        return ResponseEntity.ok(consultationService.getConsultationsByDoctorId(doctorId));
    }

    @GetMapping("/getConsultationsByStatus/status/{status}")  // ✅ CHANGÉ de "/getConsultationsByStatus/{status}"
    public ResponseEntity<List<Consultation>> getConsultationsByStatus(@PathVariable Consultation.ConsultationStatus status) {
        return ResponseEntity.ok(consultationService.getConsultationsByStatus(status));
    }

    @PostMapping("/createConsultation")  // ✅ CHANGÉ de "/createConsultation" à juste @PostMapping
    public ResponseEntity<Consultation> createConsultation(@RequestBody Consultation consultation) {
        return ResponseEntity.ok(consultationService.createConsultation(consultation));
    }

    @PutMapping("/updateConsultation/{id}")  // ✅ CHANGÉ de "/updateConsultation/{id}" à "/{id}"
    public ResponseEntity<Consultation> updateConsultation(@PathVariable Long id, @RequestBody Consultation consultation) {
        return ResponseEntity.ok(consultationService.updateConsultation(id, consultation));
    }

    @DeleteMapping("/deleteConsultation/{id}")  // ✅ CHANGÉ de "/deleteConsultation/{id}" à "/{id}"
    public ResponseEntity<Void> deleteConsultation(@PathVariable Long id) {
        consultationService.deleteConsultation(id);
        return ResponseEntity.ok().build();
    }
}