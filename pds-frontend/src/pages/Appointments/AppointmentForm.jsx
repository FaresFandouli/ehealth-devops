// AppointmentForm.jsx - Version CORRIGÉE pour affichage des RDV
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Save,
  Calendar,
  Clock,
  User,
  FileText,
  Loader,
  Stethoscope,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react'
import { appointmentsAPI } from '../../api/appointments.api'
import { doctorsAPI } from '../../api/doctors.api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { format, isAfter, addDays } from 'date-fns'
import { fr } from 'date-fns/locale'

const specialities = [
  { value: 'GENERAL_MEDICINE', label: 'Medecine Generale', color: 'from-blue-500 to-blue-600' },
  { value: 'CARDIOLOGY', label: 'Cardiologie', color: 'from-red-500 to-red-600' },
  { value: 'DERMATOLOGY', label: 'Dermatologie', color: 'from-green-500 to-green-600' },
  { value: 'PEDIATRICS', label: 'Pediatrie', color: 'from-pink-500 to-pink-600' },
  { value: 'GYNECOLOGY', label: 'Gynecologie', color: 'from-purple-500 to-purple-600' },
  { value: 'OPHTHALMOLOGY', label: 'Ophtalmologie', color: 'from-yellow-500 to-yellow-600' },
  { value: 'ORTHOPEDICS', label: 'Orthopedie', color: 'from-indigo-500 to-indigo-600' },
  { value: 'NEUROLOGY', label: 'Neurologie', color: 'from-gray-500 to-gray-600' },
  { value: 'PSYCHIATRY', label: 'Psychiatrie', color: 'from-teal-500 to-teal-600' },
  { value: 'UROLOGY', label: 'Urologie', color: 'from-orange-500 to-orange-600' },
  { value: 'ENT', label: 'ORL', color: 'from-cyan-500 to-cyan-600' },
  { value: 'DENTISTRY', label: 'Dentisterie', color: 'from-lime-500 to-lime-600' },
  { value: 'RADIOLOGY', label: 'Radiologie', color: 'from-rose-500 to-rose-600' },
  { value: 'ONCOLOGY', label: 'Oncologie', color: 'from-violet-500 to-violet-600' },
]

const AppointmentForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const isEditing = !!id

  // États du formulaire
  const [step, setStep] = useState(1)
  const [selectedSpeciality, setSelectedSpeciality] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [reason, setReason] = useState('')
  const [errors, setErrors] = useState({})
  
  // Date minimum (demain)
  const minDate = format(addDays(new Date(), 1), 'yyyy-MM-dd')

  // --- Requêtes API ---

  // Charger les médecins par spécialité
  const { data: doctors = [], isLoading: loadingDoctors, error: doctorsError } = useQuery({
    queryKey: ['doctors', selectedSpeciality],
    queryFn: () => doctorsAPI.getBySpeciality(selectedSpeciality),
    enabled: !!selectedSpeciality && step >= 2,
    retry: 1,
  })

  // Charger les créneaux disponibles
  const { data: slots = [], isLoading: loadingSlots } = useQuery({
    queryKey: ['slots', selectedDoctor?.id, selectedDate],
    queryFn: () => doctorsAPI.getAvailableSlots(selectedDoctor.id, selectedDate),
    enabled: !!selectedDoctor && !!selectedDate && step >= 3,
  })

  // Mode édition: charger le RDV existant
  const { data: appointment, isLoading: loadingAppointment } = useQuery({
    queryKey: ['appointment', id],
    queryFn: () => appointmentsAPI.getById(id),
    enabled: isEditing,
  })

  // Initialiser le formulaire en mode édition
  useEffect(() => {
    if (appointment && isEditing) {
      setReason(appointment.reason || '')
    }
  }, [appointment, isEditing])

  // ✅ CORRECTION 1 : Mutation améliorée avec invalidation complète du cache
  const bookMutation = useMutation({
    mutationFn: appointmentsAPI.book,
    onSuccess: async (data) => {
      console.log('✅ Rendez-vous créé avec succès:', data)
      
      // Invalider TOUTES les queries liées aux appointments
      await queryClient.invalidateQueries({ 
        queryKey: ['appointments'],
        exact: false, // Invalide toutes les variantes de la clé
        refetchType: 'all' 
      })
      
      // Forcer le refetch immédiatement
      await queryClient.refetchQueries({ 
        queryKey: ['appointments'],
        exact: false 
      })
      
      toast.success('🎉 Rendez-vous pris avec succès !', {
        duration: 4000,
        icon: '✅',
      })
      
      // ✅ CORRECTION 2 : Attendre un peu avant de naviguer
      setTimeout(() => {
        navigate('/appointments', { replace: true })
      }, 500)
    },
    onError: (error) => {
      console.error('❌ Erreur lors de la création du RDV:', error)
      console.error('Détails de la réponse:', error.response?.data)
      
      const msg = error.response?.data?.message || error.response?.data || 'Erreur lors de la prise de rendez-vous'
      toast.error(typeof msg === 'string' ? msg : 'Ce créneau n\'est plus disponible. Veuillez en choisir un autre.', {
        duration: 5000,
        icon: '❌',
      })
      setStep(3)
    },
  })

  // Mutation pour modifier le RDV
  const updateMutation = useMutation({
    mutationFn: (data) => appointmentsAPI.update(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['appointments'] })
      await queryClient.refetchQueries({ queryKey: ['appointments'] })
      
      toast.success('✅ Rendez-vous mis à jour avec succès')
      navigate('/appointments')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour')
    },
  })

  // --- Handlers ---

  const handleSelectSpeciality = (spec) => {
    setSelectedSpeciality(spec)
    setSelectedDoctor(null)
    setSelectedDate('')
    setSelectedSlot(null)
    setStep(2)
  }

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor)
    setSelectedDate('')
    setSelectedSlot(null)
    setStep(3)
  }

  const handleSelectDate = (date) => {
    setSelectedDate(date)
    setSelectedSlot(null)
  }

  const handleSelectSlot = (slot) => {
    if (!slot.available) {
      toast.error('Ce créneau n\'est pas disponible', {
        icon: '⏰',
        duration: 3000,
      })
      return
    }
    setSelectedSlot(slot)
  }

  const handleConfirm = () => {
    if (!reason.trim()) {
      setErrors({ reason: 'Le motif est requis' })
      toast.error('Veuillez saisir le motif de votre rendez-vous', {
        icon: '📝',
      })
      return
    }
    if (reason.trim().length < 5) {
      setErrors({ reason: 'Le motif doit contenir au moins 5 caractères' })
      return
    }
    
    setErrors({})
    setStep(4)
  }

  // ✅ CORRECTION 3 : Amélioration de la préparation des données
  const handleSubmit = () => {
    if (!selectedSlot) {
      toast.error('Veuillez sélectionner un créneau horaire', {
        icon: '⏰',
      })
      return
    }

    // Préparer les données de rendez-vous
    const appointmentData = {
      patientId: user.id,
      doctorId: selectedDoctor.id,
      appointmentDate: selectedSlot.startTime, // Format ISO complet
      reason: reason.trim(),
      duration: selectedSlot.duration || 30,
      speciality: selectedSpeciality,
    }

    // ✅ CORRECTION 4 : Logs détaillés pour debug
    console.log('📤 Envoi des données de rendez-vous:', {
      ...appointmentData,
      user: { id: user.id, username: user.username },
      doctor: { id: selectedDoctor.id, username: selectedDoctor.username },
      slot: selectedSlot,
    })

    bookMutation.mutate(appointmentData)
  }

  const isLoading = bookMutation.isPending || updateMutation.isPending

  // --- Mode édition (simplifié) ---
  if (isEditing) {
    if (loadingAppointment) {
      return (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="spinner" />
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="p-3 rounded-xl glass hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>
          <div>
            <h1 className="text-2xl font-bold text-white">Modifier le Rendez-vous</h1>
            <p className="text-white/60">Modifiez les détails du rendez-vous</p>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Motif de consultation
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="glass-input min-h-[100px]"
                placeholder="Décrivez le motif de votre rendez-vous..."
                rows="3"
              />
              {errors.reason && (
                <p className="text-red-400 text-sm mt-1">{errors.reason}</p>
              )}
            </div>
            
            <div className="p-4 rounded-xl bg-white/5">
              <p className="text-white/50 text-sm mb-1">Statut actuel</p>
              <div className="flex items-center gap-2">
                {appointment?.status === 'SCHEDULED' && (
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium">
                    ⏳ Planifié
                  </span>
                )}
                {appointment?.status === 'COMPLETED' && (
                  <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium">
                    ✅ Terminé
                  </span>
                )}
                {appointment?.status === 'CANCELLED' && (
                  <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-medium">
                    ❌ Annulé
                  </span>
                )}
                {appointment?.status === 'IN_PROGRESS' && (
                  <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-sm font-medium">
                    🔄 En cours
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex justify-end gap-4">
          <button
            onClick={() => navigate(-1)}
            className="glass-button px-6 py-2"
          >
            Annuler
          </button>
          <button
            onClick={() => updateMutation.mutate({ 
              reason, 
              status: appointment?.status 
            })}
            disabled={updateMutation.isPending}
            className="glass-button-primary px-6 py-2 flex items-center gap-2"
          >
            {updateMutation.isPending ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {updateMutation.isPending ? 'Mise à jour...' : 'Mettre à jour'}
          </button>
        </div>
      </div>
    )
  }

  // --- Mode création (multi-étapes) ---
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
          className="p-3 rounded-xl glass hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </motion.button>
        <div>
          <h1 className="text-2xl font-bold text-white">Prendre un Rendez-vous</h1>
          <p className="text-white/60">Étape {step} sur 4</p>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-2 flex-1 rounded-full transition-all duration-300 ${
              s <= step ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-white/10'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ÉTAPE 1: Choisir la spécialité */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="glass-card"
          >
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-blue-400" />
              Choisissez une spécialité médicale
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {specialities.map((spec) => (
                <motion.button
                  key={spec.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectSpeciality(spec.value)}
                  className={`p-4 rounded-xl text-left transition-all duration-200 ${
                    selectedSpeciality === spec.value
                      ? `bg-gradient-to-r ${spec.color} shadow-lg shadow-${spec.color.split('-')[1]}/30`
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-white">{spec.label}</p>
                      <p className="text-xs text-white/50 mt-1">
                        {spec.value === 'GENERAL_MEDICINE' && 'Consultation générale, suivi'}
                        {spec.value === 'CARDIOLOGY' && 'Cœur et système circulatoire'}
                        {spec.value === 'DERMATOLOGY' && 'Peau, cheveux, ongles'}
                        {spec.value === 'PEDIATRICS' && 'Santé des enfants et adolescents'}
                        {spec.value === 'GYNECOLOGY' && 'Santé féminine et reproductive'}
                        {spec.value === 'OPHTHALMOLOGY' && 'Yeux et vision'}
                        {spec.value === 'ORTHOPEDICS' && 'Os, articulations, muscles'}
                        {spec.value === 'NEUROLOGY' && 'Système nerveux'}
                        {spec.value === 'PSYCHIATRY' && 'Santé mentale'}
                        {spec.value === 'UROLOGY' && 'Système urinaire'}
                        {spec.value === 'ENT' && 'Oreilles, nez, gorge'}
                        {spec.value === 'DENTISTRY' && 'Dents et santé bucco-dentaire'}
                        {spec.value === 'RADIOLOGY' && 'Imagerie médicale'}
                        {spec.value === 'ONCOLOGY' && 'Traitements du cancer'}
                      </p>
                    </div>
                    {selectedSpeciality === spec.value && (
                      <CheckCircle className="w-5 h-5 text-white" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ÉTAPE 2: Choisir le médecin */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="glass-card"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-green-400" />
                  Choisissez votre médecin
                </h3>
                <p className="text-white/50 text-sm mt-1">
                  Spécialité: {specialities.find(s => s.value === selectedSpeciality)?.label}
                </p>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                Changer de spécialité
              </button>
            </div>

            {loadingDoctors ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader className="w-8 h-8 text-white/50 animate-spin mb-4" />
                <p className="text-white/60">Chargement des médecins...</p>
              </div>
            ) : doctorsError ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-red-400/50 mx-auto mb-3" />
                <p className="text-white/60 mb-2">Erreur de chargement des médecins</p>
                <button
                  onClick={() => queryClient.invalidateQueries(['doctors', selectedSpeciality])}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Réessayer
                </button>
              </div>
            ) : doctors.length === 0 ? (
              <div className="text-center py-12">
                <User className="w-12 h-12 text-white/30 mx-auto mb-3" />
                <p className="text-white/60 mb-2">Aucun médecin disponible pour cette spécialité</p>
                <button
                  onClick={() => setStep(1)}
                  className="glass-button mt-2"
                >
                  Choisir une autre spécialité
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {doctors.map((doctor) => (
                  <motion.button
                    key={doctor.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleSelectDoctor(doctor)}
                    className={`w-full p-4 rounded-xl text-left flex items-center gap-4 transition-all duration-200 ${
                      selectedDoctor?.id === doctor.id
                        ? 'bg-gradient-to-r from-green-500 to-blue-600 shadow-lg shadow-green-500/20'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {doctor.username?.charAt(0).toUpperCase() || 'D'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-white">
                            Dr. {doctor.username || doctor.fullName || `Médecin ${doctor.id}`}
                          </p>
                          <p className="text-sm text-white/60 mt-1">
                            {specialities.find(s => s.value === doctor.speciality)?.label || doctor.speciality}
                          </p>
                        </div>
                        {doctor.experience && (
                          <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70">
                            {doctor.experience} ans d'expérience
                          </span>
                        )}
                      </div>
                      {doctor.description && (
                        <p className="text-sm text-white/50 mt-2 line-clamp-2">
                          {doctor.description}
                        </p>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ÉTAPE 3: Choisir date + créneau + motif */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            {/* Info médecin sélectionné */}
            <div className="glass-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                    {selectedDoctor?.username?.charAt(0).toUpperCase() || 'D'}
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      Dr. {selectedDoctor?.username || selectedDoctor?.fullName}
                    </p>
                    <p className="text-sm text-white/60">
                      {specialities.find(s => s.value === selectedDoctor?.speciality)?.label}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Changer de médecin
                </button>
              </div>
            </div>

            {/* Selecteur de date */}
            <div className="glass-card">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                Choisissez une date de rendez-vous
              </h3>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => handleSelectDate(e.target.value)}
                min={minDate}
                max={format(addDays(new Date(), 60), 'yyyy-MM-dd')}
                className="glass-input w-full"
              />
              <p className="text-xs text-white/50 mt-2">
                Sélectionnez une date à partir de demain
              </p>
            </div>

            {/* Créneaux disponibles */}
            {selectedDate && (
              <div className="glass-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-400" />
                    Créneaux horaires disponibles
                  </h3>
                  {selectedDate && (
                    <span className="text-sm text-white/50 font-normal">
                      {format(new Date(selectedDate + 'T00:00:00'), 'EEEE dd MMMM yyyy', { locale: fr })}
                    </span>
                  )}
                </div>

                {loadingSlots ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader className="w-8 h-8 text-white/50 animate-spin mb-4" />
                    <p className="text-white/60">Chargement des créneaux disponibles...</p>
                  </div>
                ) : slots.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-white/30 mx-auto mb-3" />
                    <p className="text-white/60 mb-2">Aucun créneau disponible pour cette date</p>
                    <p className="text-white/40 text-sm mb-4">
                      Le médecin ne travaille pas ou est complet ce jour-là
                    </p>
                    <button
                      onClick={() => handleSelectDate('')}
                      className="glass-button"
                    >
                      Choisir une autre date
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {slots
                        .filter(slot => slot.available)
                        .map((slot, index) => {
                          const startTime = new Date(slot.startTime)
                          const endTime = new Date(slot.endTime)
                          const isSelected = selectedSlot?.startTime === slot.startTime
                          
                          return (
                            <motion.button
                              key={index}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleSelectSlot(slot)}
                              className={`p-4 rounded-xl text-center transition-all duration-200 ${
                                isSelected
                                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30'
                                  : 'bg-white/5 hover:bg-white/10'
                              }`}
                            >
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <CheckCircle className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-green-400'}`} />
                              </div>
                              <p className={`font-bold text-lg ${isSelected ? 'text-white' : 'text-white'}`}>
                                {format(startTime, 'HH:mm')}
                              </p>
                              <p className={`text-sm ${isSelected ? 'text-white/80' : 'text-white/50'}`}>
                                {format(endTime, 'HH:mm')}
                              </p>
                              <p className="text-xs text-white/40 mt-1">
                                {slot.duration || 30} min
                              </p>
                            </motion.button>
                          )
                        })}
                    </div>
                    
                    {/* Créneaux indisponibles (grisés) */}
                    {slots.some(slot => !slot.available) && (
                      <div className="mt-8">
                        <p className="text-white/50 text-sm mb-3">Créneaux complets :</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 opacity-50">
                          {slots
                            .filter(slot => !slot.available)
                            .map((slot, index) => (
                              <div
                                key={`unavailable-${index}`}
                                className="p-3 rounded-xl bg-white/5 text-center cursor-not-allowed"
                              >
                                <div className="flex items-center justify-center gap-1 mb-1">
                                  <XCircle className="w-4 h-4 text-red-400" />
                                </div>
                                <p className="font-bold text-white/40">
                                  {format(new Date(slot.startTime), 'HH:mm')}
                                </p>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Motif (visible seulement si créneau sélectionné) */}
            {selectedSlot && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card"
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-yellow-400" />
                  Motif de la consultation
                </h3>
                <div className="space-y-4">
                  <textarea
                    value={reason}
                    onChange={(e) => {
                      setReason(e.target.value)
                      if (errors.reason) setErrors({})
                    }}
                    className={`glass-input w-full min-h-[120px] ${
                      errors.reason ? 'border-red-400' : ''
                    }`}
                    placeholder="Décrivez brièvement le motif de votre consultation...
Ex: Consultation de routine, douleur persistante, suivi de traitement, examen spécifique..."
                    rows="4"
                  />
                  {errors.reason && (
                    <p className="text-red-400 text-sm mt-1">{errors.reason}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-white/50">
                      <p>Créneau sélectionné :</p>
                      <p className="font-medium text-white">
                        {selectedDate && format(new Date(selectedDate + 'T00:00:00'), 'EEEE dd MMMM', { locale: fr })} • 
                        {selectedSlot && ` ${format(new Date(selectedSlot.startTime), 'HH:mm')} - ${format(new Date(selectedSlot.endTime), 'HH:mm')}`}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleConfirm}
                      disabled={!reason.trim()}
                      className={`px-6 py-2 rounded-xl transition-all ${
                        reason.trim()
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-purple-500/30'
                          : 'bg-white/10 cursor-not-allowed opacity-50'
                      }`}
                    >
                      <span className="font-medium text-white flex items-center gap-2">
                        Continuer
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                      </span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ÉTAPE 4: Confirmation */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="glass-card"
          >
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Confirmez votre rendez-vous
            </h3>

            <div className="space-y-6">
              {/* Résumé */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5">
                  <p className="text-white/50 text-sm mb-1">Spécialité</p>
                  <p className="text-white font-semibold">
                    {specialities.find(s => s.value === selectedSpeciality)?.label}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5">
                  <p className="text-white/50 text-sm mb-1">Médecin</p>
                  <p className="text-white font-semibold">
                    Dr. {selectedDoctor?.username || selectedDoctor?.fullName}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5">
                  <p className="text-white/50 text-sm mb-1">Date du rendez-vous</p>
                  <p className="text-white font-semibold">
                    {selectedDate && format(new Date(selectedDate + 'T00:00:00'), 'EEEE dd MMMM yyyy', { locale: fr })}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5">
                  <p className="text-white/50 text-sm mb-1">Horaire</p>
                  <p className="text-white font-semibold">
                    {selectedSlot && `${format(new Date(selectedSlot.startTime), 'HH:mm')} - ${format(new Date(selectedSlot.endTime), 'HH:mm')}`}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-white/50 text-sm mb-2">Motif de consultation</p>
                <p className="text-white font-medium">{reason}</p>
              </div>

              {/* Informations importantes */}
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <h4 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Informations importantes
                </h4>
                <ul className="text-white/70 text-sm space-y-1">
                  <li>• Présentez-vous 10 minutes avant l'heure du rendez-vous</li>
                  <li>• Apportez votre carte vitale et mutuelle</li>
                  <li>• Annulation possible jusqu'à 24h avant le rendez-vous</li>
                  <li>• En cas d'empêchement, veuillez annuler via votre espace patient</li>
                </ul>
              </div>

              {/* Boutons */}
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="glass-button px-6 py-2"
                >
                  ← Retour pour modifier
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="glass-button-primary px-8 py-3 flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Réservation en cours...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Confirmer et prendre rendez-vous
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AppointmentForm