package com.pds.clinicservice.service;

import com.pds.clinicservice.dto.AvailabilityRequest;
import com.pds.clinicservice.dto.TimeSlotResponse;
import com.pds.clinicservice.entity.Appointment;
import com.pds.clinicservice.entity.DoctorAvailability;
import com.pds.clinicservice.repository.AppointmentRepository;
import com.pds.clinicservice.repository.DoctorAvailabilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorAvailabilityService {

    private final DoctorAvailabilityRepository availabilityRepository;
    private final AppointmentRepository appointmentRepository;

    /**
     * Le médecin définit sa disponibilité hebdomadaire
     */
    @Transactional
    public DoctorAvailability setAvailability(AvailabilityRequest request) {
        if (request.getStartTime().isAfter(request.getEndTime()) || request.getStartTime().equals(request.getEndTime())) {
            throw new RuntimeException("L'heure de début doit être avant l'heure de fin");
        }

        DoctorAvailability availability = new DoctorAvailability();
        availability.setDoctorId(request.getDoctorId());
        availability.setDayOfWeek(request.getDayOfWeek());
        availability.setStartTime(request.getStartTime());
        availability.setEndTime(request.getEndTime());
        availability.setSlotDurationMinutes(
                request.getSlotDurationMinutes() != null ? request.getSlotDurationMinutes() : 30
        );

        return availabilityRepository.save(availability);
    }

    /**
     * Récupérer toutes les disponibilités d'un médecin
     */
    public List<DoctorAvailability> getAvailability(Long doctorId) {
        return availabilityRepository.findByDoctorId(doctorId);
    }

    /**
     * Supprimer une disponibilité
     */
    @Transactional
    public void deleteAvailability(Long id) {
        availabilityRepository.deleteById(id);
    }

    /**
     * Calculer les créneaux disponibles pour un médecin à une date donnée.
     * Croise les disponibilités hebdomadaires avec les RDV existants.
     */
    public List<TimeSlotResponse> getAvailableSlots(Long doctorId, LocalDate date) {
        DayOfWeek dayOfWeek = date.getDayOfWeek();

        // 1. Récupérer les disponibilités du médecin pour ce jour de la semaine
        List<DoctorAvailability> availabilities = availabilityRepository
                .findByDoctorIdAndDayOfWeek(doctorId, dayOfWeek);

        if (availabilities.isEmpty()) {
            return List.of(); // Pas de disponibilité ce jour-là
        }

        // 2. Récupérer les RDV existants pour ce médecin à cette date
        LocalDateTime dayStart = date.atStartOfDay();
        LocalDateTime dayEnd = date.atTime(23, 59, 59);
        List<Appointment> existingAppointments = appointmentRepository
                .findByDoctorIdAndAppointmentDateBetween(doctorId, dayStart, dayEnd);

        // Créer un set des heures de début des RDV existants (non annulés)
        Set<LocalDateTime> bookedSlots = existingAppointments.stream()
                .filter(a -> !"CANCELLED".equals(a.getStatus()))
                .map(Appointment::getAppointmentDate)
                .collect(Collectors.toSet());

        // 3. Générer tous les créneaux possibles et marquer leur disponibilité
        List<TimeSlotResponse> slots = new ArrayList<>();

        for (DoctorAvailability availability : availabilities) {
            LocalTime currentTime = availability.getStartTime();
            int duration = availability.getSlotDurationMinutes();

            while (currentTime.plusMinutes(duration).isBefore(availability.getEndTime())
                    || currentTime.plusMinutes(duration).equals(availability.getEndTime())) {

                LocalDateTime slotStart = LocalDateTime.of(date, currentTime);
                LocalDateTime slotEnd = slotStart.plusMinutes(duration);

                boolean isAvailable = !bookedSlots.contains(slotStart);

                slots.add(new TimeSlotResponse(slotStart, slotEnd, isAvailable));

                currentTime = currentTime.plusMinutes(duration);
            }
        }

        return slots;
    }
}
