package com.pds.clinicservice.controller;

import com.pds.clinicservice.dto.AvailabilityRequest;
import com.pds.clinicservice.dto.TimeSlotResponse;
import com.pds.clinicservice.entity.DoctorAvailability;
import com.pds.clinicservice.service.DoctorAvailabilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/clinic/availability")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class DoctorAvailabilityController {

    private final DoctorAvailabilityService availabilityService;

    /**
     * Le médecin définit sa disponibilité hebdomadaire
     * POST /api/clinic/availability
     */
    @PostMapping
    public ResponseEntity<?> setAvailability(@RequestBody AvailabilityRequest request) {
        try {
            DoctorAvailability availability = availabilityService.setAvailability(request);
            return ResponseEntity.ok(availability);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Récupérer les disponibilités d'un médecin
     * GET /api/clinic/availability/{doctorId}
     */
    @GetMapping("/{doctorId}")
    public ResponseEntity<List<DoctorAvailability>> getAvailability(@PathVariable Long doctorId) {
        return ResponseEntity.ok(availabilityService.getAvailability(doctorId));
    }

    /**
     * Récupérer les créneaux disponibles pour une date donnée
     * GET /api/clinic/availability/{doctorId}/slots?date=2025-06-16
     */
    @GetMapping("/{doctorId}/slots")
    public ResponseEntity<List<TimeSlotResponse>> getAvailableSlots(
            @PathVariable Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(availabilityService.getAvailableSlots(doctorId, date));
    }

    /**
     * Supprimer une disponibilité
     * DELETE /api/clinic/availability/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAvailability(@PathVariable Long id) {
        availabilityService.deleteAvailability(id);
        return ResponseEntity.ok().build();
    }
}
