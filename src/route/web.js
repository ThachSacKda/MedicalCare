import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController";
import specialtyController from "../controllers/specialtyController";
import pharmacyController from "../controllers/pharmacyController"; // Correct import
import clinicController from "../controllers/clinicController";
import dashboardController from "../controllers/dashboardController";
import messagesController from "../controllers/messagesController";

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/about', homeController.getAboutPage);
    router.get('/crud', homeController.getCRUD);

    // CRUD routes
    router.post('/post-crud', homeController.postCRUD);
    router.get('/get-crud', homeController.displayGetCRUD);
    router.get('/edit-crud', homeController.getEditCRUD);
    router.post('/put-crud', homeController.putCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);

    // User routes
    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-user', userController.handleGetAllUsers);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);
    router.get('/api/allcode', userController.getAllCode);


    // Doctor routes
    router.get('/api/top-doctor-home', doctorController.getDoctorHome);
    router.get('/api/get-all-doctor', doctorController.getAllDoctors);
    router.post('/api/save-infor-doctors', doctorController.postInforDoctor);
    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById);

    // Schedule routes
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);
    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleByDate);
    router.get('/api/get-extra-infor-doctor-by-id', doctorController.getExtraInforDoctorById);
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById);
    router.get('/api/get-list-patient-for-doctor', doctorController.getListPatientForDoctor)

    router.post('/api/patient-book-appointment', patientController.postBookAppoinment);
    router.post('/api/verify-book-appointment', patientController.postVerifyBookAppoinment);

    // Specialty routes
    router.post('/api/create-new-specialty', specialtyController.createSpecialty);

    router.get('/api/get-specialty', specialtyController.getAllSpecialty);
    router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById);

    router.post('/api/create-new-medicine', pharmacyController.createNewMedicine);
    router.get('/api/get-all-medicine', pharmacyController.getAllMedicines);
    router.put('/api/update-medicine', pharmacyController.updateMedicine);
    router.delete('/api/delete-medicine', pharmacyController.deleteMedicine);

    router.post('/api/create-new-clinic', clinicController.createClinic);
    // router.get('/api/get-specialty', specialtyController.getAllSpecialty);
    // router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById);

    router.get('/api/get-detail-patient-by-id', patientController.getProfilePatientById);


    router.post('/api/add-medical-record', patientController.addMedicalRecord);

    router.get('/api/medical-records/:patientId', patientController.getMedicalRecordsByPatientId);

    router.get('/api/patient-profile/:patientId', patientController.handleGetPatientProfile);

    router.get('/api/get-all-patients', patientController.getAllPatients);  // Lấy danh sách bệnh nhân

    router.get('/api/admin/dashboard/appointments', dashboardController.getAppointmentStatistics);
    router.get('/api/admin/dashboard/weekly-appointments', dashboardController.getWeeklyBookingStatistics);

    router.get('/api/patient/booking-history', patientController.getBookingHistoryByPatientId);
    router.delete('/api/patient/booking', patientController.deleteBooking);

    router.post('/api/messages/send', messagesController.handleSendMessage);
    router.get('/api/messages/conversation', messagesController.handleGetMessagesBetweenUsers);
    router.get('/api/messages/user', messagesController.handleGetAllMessagesForUser);

    router.get('/api/unread-count', messagesController.handleGetUnreadMessagesCount);
    router.post('/api/messages/mark-as-read', messagesController.markMessagesAsRead);



    return app.use("/", router);
}

module.exports = initWebRoutes;
