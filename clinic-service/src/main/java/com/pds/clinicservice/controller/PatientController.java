package com.pds.clinicservice.controller;

import com.pds.clinicservice.entity.Patient;
import com.pds.clinicservice.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/clinic/patients")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PatientController {
    private final PatientService patientService;
    
    @GetMapping("/getAllPatients")
    //@PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN', 'SECRETARY')")
    public ResponseEntity<List<Patient>> getAllPatients() {
        return ResponseEntity.ok(patientService.getAllPatients());
    }
    
    @GetMapping("/getPatientById/{id}")
    //@PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN', 'PATIENT', 'SECRETARY')")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        return ResponseEntity.ok(patientService.getPatientById(id));
    }
    
    @PostMapping("/createPatient")
    //@PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN', 'SECRETARY')")
    public ResponseEntity<Patient> createPatient(@RequestBody Patient patient) {
        return ResponseEntity.ok(patientService.createPatient(patient));
    }
    
    @PutMapping("/updatePatient/{id}")
    //@PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN', 'SECRETARY')")
    public ResponseEntity<Patient> updatePatient(@PathVariable Long id, @RequestBody Patient patient) {
        return ResponseEntity.ok(patientService.updatePatient(id, patient));
    }
    
    @DeleteMapping("/deletePatient/{id}")
    //@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        patientService.deletePatient(id);
        return ResponseEntity.ok().build();
    }
}