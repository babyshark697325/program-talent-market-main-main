// notifications/templates.js

export const notificationTemplates = {
  applicationUpdate: (jobTitle) => ({
    subject: "Application Update",
    body: `Your application for "${jobTitle}" has been updated.`,
  }),

  newApplicant: (applicantName, jobTitle) => ({
    subject: "New Applicant",
    body: `${applicantName} just applied to your job post "${jobTitle}".`,
  }),

  jobUpdate: (jobTitle) => ({
    subject: "Job Update",
    body: `Your job post "${jobTitle}" was recently updated.`,
  }),

  request: (requestType) => ({
    subject: "Request Notification",
    body: `You have a new request: ${requestType}.`,
  }),

  billing: (invoiceId) => ({
    subject: "Billing Update",
    body: `Your invoice #${invoiceId} is now available.`,
  }),
};
