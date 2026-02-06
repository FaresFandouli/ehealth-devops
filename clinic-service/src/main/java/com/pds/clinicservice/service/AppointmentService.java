package com.pds.clinicservice.service;

import com.pds.clinicservice.dto.AppointmentRequest;
import com.pds.clinicservice.dto.TimeSlotResponse;
import com.pds.clinicservice.entity.Appointment;
import com.pds.clinicservice.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorAvailabilityService availabilityService;

    /**
     * Patient prend un rendez-vous
     */
    @Transactional
    public Appointment bookAppointment(AppointmentRequest request) {
        // 1. Vérifier que le créneau est disponible
        List<TimeSlotResponse> slots = availabilityService.getAvailableSlots(
                request.getDoctorId(),
                request.getAppointmentDate().toLocalDate()
        );

        boolean slotAvailable = slots.stream()
                .anyMatch(slot -> slot.getStartTime().equals(request.getAppointmentDate()) && slot.isAvailable());

        if (!slotAvailable) {
            throw new RuntimeException("Ce créneau n'est pas disponible");
        }

        // 2. Vérifier qu'il n'y a pas déjà un RDV à cette heure pour ce médecin
        List<Appointment> existing = appointmentRepository
                .findByDoctorIdAndAppointmentDateAndStatusNot(
                        request.getDoctorId(),
                        request.getAppointmentDate(),
                        "CANCELLED"
                );

        if (!existing.isEmpty()) {
            throw new RuntimeException("Ce créneau est déjà pris");
        }

        // 3. Créer le rendez-vous
        Appointment appointment = new Appointment();
        appointment.setPatientId(request.getPatientId());
        appointment.setDoctorId(request.getDoctorId());
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setReason(request.getReason());
        appointment.setStatus("SCHEDULED");
        appointment.setDurationMinutes(30);

        return appointmentRepository.save(appointment);
    }

    /**
     * Annuler un rendez-vous
     */
    @Transactional
    public Appointment cancelAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Rendez-vous non trouvé"));

        if ("CANCELLED".equals(appointment.getStatus())) {
            throw new RuntimeException("Ce rendez-vous est déjà annulé");
        }

        appointment.setStatus("CANCELLED");
        return appointmentRepository.save(appointment);
    }

    /**
     * Récupérer les rendez-vous d'un patient
     */
    public List<Appointment> getPatientAppointments(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    /**
     * Récupérer les rendez-vous d'un médecin
     */
    public List<Appointment> getDoctorAppointments(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    /**
     * Récupérer un rendez-vous par ID
     */
    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rendez-vous non trouvé"));
    }
}
