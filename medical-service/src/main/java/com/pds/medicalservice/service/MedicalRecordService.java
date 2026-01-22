package com.pds.medicalservice.service;

import com.pds.medicalservice.entity.MedicalRecord;
import com.pds.medicalservice.repository.MedicalRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MedicalRecordService {
    
    @Autowired
    private MedicalRecordRepository medicalRecordRepository;
    
    public List<MedicalRecord> getAllRecords() {
        return medicalRecordRepository.findAll();
    }
    
    public Optional<MedicalRecord> getRecordById(Long id) {
        return medicalRecordRepository.findById(id);
    }
    
    public List<MedicalRecord> getRecordsByPatientId(Long patientId) {
        return medicalRecordRepository.findByPatientId(patientId);
    }
    
    public List<MedicalRecord> getRecordsByDoctorId(Long doctorId) {
        return medicalRecordRepository.findByDoctorId(doctorId);
    }
    
    public MedicalRecord createRecord(MedicalRecord record) {
        return medicalRecordRepository.save(record);
    }
    
    public MedicalRecord updateRecord(Long id, MedicalRecord recordDetails) {
        MedicalRecord record = medicalRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medical record not found"));
        
        record.setDiagnosis(recordDetails.getDiagnosis());
        record.setSymptoms(recordDetails.getSymptoms());
        record.setTreatment(recordDetails.getTreatment());
        record.setPrescription(recordDetails.getPrescription());
        record.setNotes(recordDetails.getNotes());
        record.setBloodPressure(recordDetails.getBloodPressure());
        record.setTemperature(recordDetails.getTemperature());
        record.setHeartRate(recordDetails.getHeartRate());
        record.setWeight(recordDetails.getWeight());
        record.setHeight(recordDetails.getHeight());
        
        return medicalRecordRepository.save(record);
    }
    
    public void deleteRecord(Long id) {
        medicalRecordRepository.deleteById(id);
    }
}
