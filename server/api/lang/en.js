'use strict';

module.exports = {
    VALIDATION_ERROR_IN: 'Validation error in',
    NOTHING_UPDATED: 'Nothing Updated',
    UPDATE_NON_EXISTING_DOCUMENT_FAILED: 'cann\'t update a non-existing document',
    ID_REQUIRED: '\'_id\'is required',
    USERID_REQUIRED: '\'userId\'is required',


    /*
     * leave messages
     */
    FIELD_REQUIRED: 'Please fill all required fields.',
    INVALID_DATE: 'Please give correct Date.',
    INVALID_WEIGHT: 'Please give correct Weight.',
    NO_DATA: 'No data found',

    LEAVE_APPLICATION_SUCCESSFULL: 'Leave application is successful',
    PENDING_SAME_TYPE_LEAVE: 'You have pending application of same leave type',
    LEAVE_ALREADY_STARTED: 'Leave already started.',
    LEAVE_ALREADY_REJECTED: 'Application already rejected.',
    SUCCESSFULLY_REJECTED: 'Application rejected successfully.',
    LEAVE_ALREADY_CANCELLED: 'Application already cancelled.',
    LEAVE_ALREADY_APPROVED: 'Application already approved.',
    SUCCESSFULLY_APPROVED: 'Application approved successfully.',
    INVALID_LEAVE_TYPE: 'Invalid leave type, should between 1 and 3.',
    EL_LEAVE_RULE: 'To get EL you must have to apply 15 days before the leave starts.',
    CL_LEAVE_RULE: 'You can take atmost two consecutive CL',
    LEAVE_APPLY_RULE: 'You can only apply leave for current year or next year.',
    LEAVE_SAME_DATE: 'You cannot apply for same date.',
    AVAILABLE_CL: 'Available CL is less than you requested.',
    AVAILABLE_EL: 'Available EL is less than you requested.',
    INVALID_VALUE_APPROVED: 'Invalid value for approved, should either 1 or 0.',
    INVALID_LEAVE_TYPE_MANUAL_ENTRY: 'Invalid leave type, should 1 or 3.',
    LEAVE_DATE_EXIST: 'Date already exist as leave.',
    NO_AVAILABLE_CL: 'No available CL',
    SUCCESSFULLY_CANCELLED: 'Application cancelled successfully.',
    CANNT_SET_OWN_LEAVE_CONFIG: 'You cann\'t set own leave config',
    NO_LEAVE_ACCOUNT: 'You do not have any leave account for cuuent duration. Please contact with your admin',
    /*
     * holiday messages
     */
    HOLIDAY_ADD_SUCCESSFUL: 'Holiday successfully added.',
    HOLIDAY_ADD_RULE: 'You cannot add holiday of previous year.',
    HOLIDAY_UPDATION_SUCCESSFUL: 'Holiday successfully updated.',
    HOLIDAY_REMOVE_SUCCESSFUL: 'Holiday successfully removed.',

    /*
     * user messages
     */
    NOT_LOGGED_IN: 'You are not logged in',
    ALREADY_LOGGED_IN: 'You are already logged in logout first',
    AUTHENTICATION_FAILED: 'Authentication failed',
    INCOMPLETE_ATTRIBUTE_SET: 'Send proper attributes',
    LOGOUT_FAILED: 'Logout failed',
    PERMISSION_DENIED: 'You donn\'t have permission for this operation',
    PERMISSION_UPDATION_COMPANY_PROFILE: 'You don\'t have permission to update Company Profile',
    PERMISSION_UPDATION_PERSONAL_PROFILE: 'You don\'t have permission to update Personal Profile',
    INCORRECT_EXISTING_PASSWORD: 'incorrect existing password',
    INCORRECT_EMAIL: 'This email does not exists',
    VALIDATION_ERROR: 'validation error',
    UNIQUE_KEY_CONSTRAINT_ERROR: 'Unique key constraint error',
    ADD_ADMIN_NOT_PERMITED: 'You don\'t have permission to add an admin',
    PASSWORD_CHANGED_SUCCESSFULLY: 'Password changed successfully',
    IS_NOT_MANAGER: 'Choosen manager is not a manager',
    USER_BLOCKED: 'You are blocked',
    INVALID_TYPE_IN_BLOCKED: 'Invalid type in blocked',
    USER_SHOULD_HAVE_A_ROLE: 'User should have a role',
    USER_SHOULD_HAVE_A_MANAGER: 'User should have a manager',
    INVALID_ROLE: 'Invalid role',
    USER_SHOULD_HAVE_A_COMPANYPROFILE: 'User should have a company-profile',
    INVALID_CATAGORY_OF_ROLE: 'Invalid catagory of role',
    ROLE_NAME_ALREADY_EXISTS: 'Role name already exists',
    IMAGE_SIZE_LIMIT_EXCEEDED: 'Image size limit exceeded',
    DURATION_MUST_BE_ALTEAST_30_DAYS: 'Duration must be alteast 30 days',
    END_DATE_CANNT_BE_PAST_DATE: 'End date cann\'t be past date',

    /*
     *   attendance messages
     */
    NO_DATA_FOUND_IN_FILE: 'No data found in file',
    ERROR_IN_READING_FILE: 'Error in reading file '
};
