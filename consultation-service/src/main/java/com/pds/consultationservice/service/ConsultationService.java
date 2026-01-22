package com.pds.consultationservice.service;

import com.pds.consultationservice.entity.Consultation;
import com.pds.consultationservice.repository.ConsultationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ConsultationService {
    
    @Autowired
    private ConsultationRepository consultationRepository;
    
    public List<Consultation> getAllConsultations() {
        return consultationRepository.findAll();
    }
    
    public Optional<Consultation> getConsultationById(Long id) {
        return consultationRepository.findById(id);
    }
    
    public List<Consultation> getConsultationsByPatientId(Long patientId) {
        return consultationRepository.findByPatientId(patientId);
    }
    
    public List<Consultation> getConsultationsByDoctorId(Long doctorId) {
        return consultationRepository.findByDoctorId(doctorId);
    }
    
    public List<Consultation> getConsultationsByStatus(Consultation.ConsultationStatus status) {
        return consultationRepository.findByStatus(status);
    }
    
    public Consultation createConsultation(Consultation consultation) {
        return consultationRepository.save(consultation);
    }
    
    public Consultation updateConsultation(Long id, Consultation consultationDetails) {
        Consultation consultation = consultationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consultation not found"));
        
        consultation.setConsultationDate(consultationDetails.getConsultationDate());
        consultation.setReason(consultationDetails.getReason());
        consultation.setDiagnosis(consultationDetails.getDiagnosis());
        consultation.setPrescription(consultationDetails.getPrescription());
        consultation.setNotes(consultationDetails.getNotes());
        consultation.setStatus(consultationDetails.getStatus());
        
        return consultationRepository.save(consultation);
    }
    
    public void deleteConsultation(Long id) {
        consultationRepository.deleteById(id);
    }
}
