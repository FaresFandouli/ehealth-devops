#!/bin/bash

# Medical Service - Similar structure to clinic
cp -r /home/claude/pds-complete-project/clinic-service/src /home/claude/pds-complete-project/medical-service/
find /home/claude/pds-complete-project/medical-service/src -type f -name "*.java" -exec sed -i 's/clinicservice/medicalservice/g' {} \;
find /home/claude/pds-complete-project/medical-service/src -type f -name "*.java" -exec sed -i 's/ClinicService/MedicalService/g' {} \;
sed -i 's/8083/8084/g' /home/claude/pds-complete-project/medical-service/src/main/resources/application.yml
sed -i 's/clinic-service/medical-service/g' /home/claude/pds-complete-project/medical-service/src/main/resources/application.yml
sed -i 's/pds_clinic/pds_medical/g' /home/claude/pds-complete-project/medical-service/src/main/resources/application.yml

# Consultation Service
cp -r /home/claude/pds-complete-project/clinic-service/src /home/claude/pds-complete-project/consultation-service/
find /home/claude/pds-complete-project/consultation-service/src -type f -name "*.java" -exec sed -i 's/clinicservice/consultationservice/g' {} \;
find /home/claude/pds-complete-project/consultation-service/src -type f -name "*.java" -exec sed -i 's/ClinicService/ConsultationService/g' {} \;
sed -i 's/8083/8085/g' /home/claude/pds-complete-project/consultation-service/src/main/resources/application.yml
sed -i 's/clinic-service/consultation-service/g' /home/claude/pds-complete-project/consultation-service/src/main/resources/application.yml
sed -i 's/pds_clinic/pds_consultation/g' /home/claude/pds-complete-project/consultation-service/src/main/resources/application.yml

echo "All business services created!"
